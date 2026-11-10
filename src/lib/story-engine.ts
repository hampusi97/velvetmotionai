// Branching scenes for fictional adults (18+). Progress is pure data so the UI
// and the check script share one set of rules.

export interface StoryChoice {
  id: string;
  label: string;
  next: string;
  affection?: number;
  flag?: string;
  grants?: string[];
  requiresAffection?: number;
  requiresFlags?: string[];
  requiresUnlock?: string;
  lockHint?: string;
}

export interface StoryMemory {
  flags: string[];
  text: string;
}

export interface StoryScene {
  id: string;
  title: string;
  text: string;
  choices?: StoryChoice[];
  memories?: StoryMemory[];
  endingId?: string;
  requiresUnlock?: string;
  grantsOnEnter?: string[];
}

export type UnlockKind = "outfit" | "scene" | "ending";

export interface StoryUnlock {
  id: string;
  kind: UnlockKind;
  title: string;
  detail: string;
  lockedHint: string;
}

export interface StoryRequirement {
  storyId: string;
  endingId: string;
  hint: string;
}

export interface Story {
  id: string;
  companionId: string;
  title: string;
  blurb: string;
  start: string;
  scenes: StoryScene[];
  unlocks: StoryUnlock[];
  requires?: StoryRequirement[];
}

export interface StoryHistoryEntry {
  sceneId: string;
  choiceId: string;
  label: string;
}

export interface StoryState {
  storyId: string;
  sceneId: string;
  affection: number;
  peakAffection: number;
  flags: string[];
  unlocked: string[];
  endings: string[];
  equipped?: string;
  history: StoryHistoryEntry[];
  finished: boolean;
}

export interface ChoiceView {
  choice: StoryChoice;
  locked: boolean;
  reason: string;
}

export interface ApplyResult {
  state: StoryState;
  moved: boolean;
  newUnlocks: StoryUnlock[];
}

export interface CompanionRef {
  id: string;
  name: string;
  age: number;
}

const MAX_AFFECTION = 10;

export function eligibleCompanion(companion: CompanionRef) {
  return Number.isFinite(companion.age) && companion.age >= 18;
}

export function fillText(text: string, companion: CompanionRef) {
  return text
    .replaceAll("{name}", companion.name || "She")
    .replaceAll("{age}", String(companion.age));
}

export function sceneById(story: Story, sceneId: string) {
  return story.scenes.find((scene) => scene.id === sceneId);
}

export function createState(story: Story): StoryState {
  return {
    storyId: story.id,
    sceneId: story.start,
    affection: 0,
    peakAffection: 0,
    flags: [],
    unlocked: [],
    endings: [],
    history: [],
    finished: false,
  };
}

function asStrings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function endingsOf(raw: unknown) {
  if (!raw || typeof raw !== "object") return [];
  return asStrings((raw as { endings?: unknown }).endings);
}

export function normalize(story: Story, raw: unknown): StoryState {
  const base = createState(story);
  if (!raw || typeof raw !== "object") return base;
  const data = raw as Record<string, unknown>;
  const knownUnlocks = new Set(story.unlocks.map((item) => item.id));
  const sceneIds = new Set(story.scenes.map((scene) => scene.id));
  const unlocked = asStrings(data.unlocked).filter((id) => knownUnlocks.has(id));
  const endings = asStrings(data.endings).filter((id) =>
    story.unlocks.some((item) => item.id === id && item.kind === "ending"),
  );
  const equipped = typeof data.equipped === "string" && unlocked.includes(data.equipped) ? data.equipped : undefined;
  const history = Array.isArray(data.history)
    ? data.history
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const item = entry as Record<string, unknown>;
          if (typeof item.sceneId !== "string" || typeof item.choiceId !== "string" || typeof item.label !== "string") return null;
          return { sceneId: item.sceneId, choiceId: item.choiceId, label: item.label };
        })
        .filter((entry): entry is StoryHistoryEntry => Boolean(entry))
        .slice(-40)
    : [];
  const affection = clamp(typeof data.affection === "number" ? data.affection : 0);
  const peakAffection = clamp(Math.max(affection, typeof data.peakAffection === "number" ? data.peakAffection : 0));
  const sceneId = typeof data.sceneId === "string" && sceneIds.has(data.sceneId) ? data.sceneId : story.start;
  const scene = sceneById(story, sceneId);
  return {
    storyId: story.id,
    sceneId,
    affection,
    peakAffection,
    flags: asStrings(data.flags).slice(0, 24),
    unlocked,
    endings,
    equipped,
    history,
    finished: Boolean(scene?.endingId) && !(scene?.choices && scene.choices.length),
  };
}

export function isStoryUnlocked(story: Story, all: Record<string, unknown>) {
  if (!story.requires?.length) return true;
  return story.requires.every((req) => endingsOf(all[req.storyId]).includes(req.endingId));
}

export function storyLockHint(story: Story) {
  return story.requires?.map((req) => req.hint).join(" ") ?? "";
}

function clamp(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(MAX_AFFECTION, Math.round(value)));
}

function unique(values: string[]) {
  const seen: Record<string, true> = {};
  const next: string[] = [];
  for (const value of values) {
    if (seen[value]) continue;
    seen[value] = true;
    next.push(value);
  }
  return next;
}

export function choiceViews(story: Story, state: StoryState): ChoiceView[] {
  const scene = sceneById(story, state.sceneId);
  if (!scene?.choices) return [];
  return scene.choices.map((choice) => {
    const reason = lockReason(story, state, choice);
    return { choice, locked: reason !== null, reason: reason ?? "" };
  });
}

function lockReason(story: Story, state: StoryState, choice: StoryChoice) {
  if (choice.requiresFlags?.some((flag) => !state.flags.includes(flag))) {
    return choice.lockHint || "An earlier choice opens this.";
  }
  if (choice.requiresAffection && state.affection < choice.requiresAffection) {
    return choice.lockHint || `Affection ${choice.requiresAffection} needed. You are at ${state.affection}.`;
  }
  if (choice.requiresUnlock && !state.unlocked.includes(choice.requiresUnlock)) {
    return choice.lockHint || story.unlocks.find((item) => item.id === choice.requiresUnlock)?.lockedHint || "Still locked.";
  }
  const next = sceneById(story, choice.next);
  if (!next) return "This path is closed.";
  const willUnlock = new Set([...state.unlocked, ...(choice.grants ?? [])]);
  if (next.requiresUnlock && !willUnlock.has(next.requiresUnlock)) {
    return choice.lockHint || story.unlocks.find((item) => item.id === next.requiresUnlock)?.lockedHint || "Still locked.";
  }
  return null;
}

export function memoryLines(scene: StoryScene, state: StoryState) {
  return (scene.memories ?? [])
    .filter((memory) => memory.flags.every((flag) => state.flags.includes(flag)))
    .map((memory) => memory.text);
}

export function wearingLine(story: Story, state: StoryState) {
  if (!state.equipped) return null;
  const outfit = story.unlocks.find((item) => item.id === state.equipped && item.kind === "outfit");
  return outfit ? `I'm wearing the ${outfit.title.toLowerCase()} you unlocked.` : null;
}

export function applyChoice(story: Story, state: StoryState, choiceId: string): ApplyResult {
  const view = choiceViews(story, state).find((item) => item.choice.id === choiceId);
  if (!view || view.locked) return { state, moved: false, newUnlocks: [] };
  const next = arrive(story, state, view.choice);
  const freshIds = next.unlocked.filter((id) => !state.unlocked.includes(id));
  const newUnlocks = freshIds
    .map((id) => story.unlocks.find((item) => item.id === id))
    .filter((item): item is StoryUnlock => Boolean(item));
  return { state: next, moved: true, newUnlocks };
}

function arrive(story: Story, state: StoryState, choice: StoryChoice): StoryState {
  const nextScene = sceneById(story, choice.next)!;
  const affection = clamp(state.affection + (choice.affection ?? 0));
  const flags = choice.flag && !state.flags.includes(choice.flag) ? [...state.flags, choice.flag] : state.flags;
  const grants = [...(choice.grants ?? []), ...(nextScene.grantsOnEnter ?? [])];
  if (nextScene.endingId && story.unlocks.some((item) => item.id === nextScene.endingId)) {
    grants.push(nextScene.endingId);
  }
  const unlocked = unique([...state.unlocked, ...grants]);
  const endings =
    nextScene.endingId && !state.endings.includes(nextScene.endingId)
      ? [...state.endings, nextScene.endingId]
      : state.endings;
  let equipped = state.equipped && unlocked.includes(state.equipped) ? state.equipped : undefined;
  if (!equipped) {
    equipped = grants.find((id) => story.unlocks.some((item) => item.id === id && item.kind === "outfit"));
  }
  return {
    storyId: story.id,
    sceneId: nextScene.id,
    affection,
    peakAffection: Math.max(state.peakAffection, affection),
    flags,
    unlocked,
    endings,
    equipped,
    history: [...state.history, { sceneId: state.sceneId, choiceId: choice.id, label: choice.label }].slice(-40),
    finished: Boolean(nextScene.endingId) && !(nextScene.choices && nextScene.choices.length),
  };
}

export function restartStory(story: Story, state: StoryState): StoryState {
  const fresh = createState(story);
  const unlocked = state.unlocked.filter((id) => story.unlocks.some((item) => item.id === id));
  return {
    ...fresh,
    unlocked,
    endings: state.endings.filter((id) => story.unlocks.some((item) => item.id === id && item.kind === "ending")),
    peakAffection: state.peakAffection,
    equipped: state.equipped && unlocked.includes(state.equipped) ? state.equipped : undefined,
  };
}

export function equipOutfit(story: Story, state: StoryState, unlockId: string): StoryState {
  const outfit = story.unlocks.find((item) => item.id === unlockId && item.kind === "outfit");
  if (!outfit || !state.unlocked.includes(outfit.id)) return state;
  return { ...state, equipped: outfit.id };
}

export function storiesFor(companion: CompanionRef): Story[] {
  if (!eligibleCompanion(companion)) return [];
  if (companion.id === "chloe") {
    return [chloeAfterHours(companion.id), rooftopStory(companion.id, [{
      storyId: "chloe-after-hours",
      endingId: "porch-light",
      hint: "Locked until you reach The porch light in After hours.",
    }])];
  }
  if (companion.id === "elena") return [elenaCoast(companion.id)];
  if (companion.id === "scarlett") return [scarlettEncore(companion.id)];
  return [rooftopStory(companion.id)];
}

function chloeAfterHours(companionId: string): Story {
  return {
    id: "chloe-after-hours",
    companionId,
    title: "After hours",
    blurb: "She finished her last session. The rain, and whatever you do next, do the rest.",
    start: "cafe",
    unlocks: [
      { id: "outfit-cardigan", kind: "outfit", title: "Soft cardigan", detail: "The knit she pulls on when the night is allowed to be gentle.", lockedHint: "Ask for a goodnight kiss once the evening has earned it." },
      { id: "outfit-saturday", kind: "outfit", title: "Saturday knit", detail: "What she wears when you actually show up for breakfast.", lockedHint: "Show up on Saturday." },
      { id: "scene-saturday", kind: "scene", title: "Saturday breakfast", detail: "The morning after the porch light.", lockedHint: "The porch-light kiss opens Saturday morning." },
      { id: "porch-light", kind: "ending", title: "The porch light", detail: "An asked-for kiss, and an invitation to come back.", lockedHint: "Kiss her goodnight when affection is high enough." },
      { id: "rain-check", kind: "ending", title: "Rain check", detail: "A goodnight that does not rush her.", lockedHint: "Say goodnight without rushing her." },
      { id: "saturday", kind: "ending", title: "Breakfast", detail: "Pancakes, rain, and a week that can start this way again.", lockedHint: "Stay through breakfast." },
    ],
    scenes: [
      {
        id: "cafe",
        title: "After hours",
        text: "I finished my last session. I'm {age}, the notes are stacked, and the cafe downstairs is still open. I was hoping you had not left. The rain is doing that soft ticking thing against the window. Only come if you want to.",
        choices: [
          { id: "coat", label: "Offer her your coat and walk out together", next: "walk", affection: 2, flag: "offered-coat" },
          { id: "stay", label: "Stay and finish the last page with her", next: "stay", affection: 1, flag: "stayed" },
          { id: "heart", label: "Tell her you noticed the heart in her notes", next: "margin", affection: 2, flag: "honest" },
        ],
      },
      {
        id: "walk",
        title: "In the rain",
        text: "The rain finds my hair anyway. I pull your coat tighter and laugh, which I was trying not to do. You didn't have to walk me. I'm glad you did.",
        memories: [{ flags: ["honest"], text: "I keep glancing over. I'm braver than I was upstairs, and I know you can tell." }],
        choices: [
          { id: "hand", label: "Ask if you can hold her hand", next: "porch", affection: 2, flag: "hand" },
          { id: "easy", label: "Ask about her week and keep the walk easy", next: "porch", affection: 1, flag: "easy" },
        ],
      },
      {
        id: "margin",
        title: "The margin",
        text: "My ears go hot. I close the notebook so the little heart doesn't show, then I open it again on purpose. Okay. You saw it. Then walk with me, if you still want to.",
        choices: [{ id: "walkme", label: "Walk with her", next: "walk", affection: 1 }],
      },
      {
        id: "stay",
        title: "Last page",
        text: "We finish the last page together. I bump your knee under the table and I don't move it. There's still ink on my thumb. The cafe is open. Or we can call the night here.",
        choices: [
          { id: "late", label: "Take her downstairs for one more coffee", next: "late", affection: 1 },
          { id: "walkout", label: "Walk her out and say goodnight properly", next: "porch", affection: 1, flag: "easy" },
        ],
      },
      {
        id: "late",
        title: "One more cup",
        text: "Two cups, and a candle the waiter forgot. I talk with my hands until I notice I've been holding your wrist. I don't apologize. I wait to see what you do.",
        choices: [
          { id: "wrist", label: "Let her keep your wrist", next: "porch", affection: 2, flag: "hand" },
          { id: "rain", label: "Walk her home before the rain gets worse", next: "porch", affection: 1, flag: "offered-coat" },
        ],
      },
      {
        id: "porch",
        title: "Porch light",
        text: "My building's porch light is on. I don't go in yet. I had a good night. If you want another one, say so. If you want to kiss me, ask. I want to hear it.",
        memories: [
          { flags: ["offered-coat"], text: "Your coat is still around my shoulders." },
          { flags: ["hand"], text: "I haven't let go of your hand." },
          { flags: ["honest"], text: "I'm still pink from what you said about the heart in my notes." },
          { flags: ["easy"], text: "The walk stayed unhurried, and I look glad that it did." },
          { flags: ["stayed"], text: "There's ink on my thumb from the page we finished." },
        ],
        choices: [
          {
            id: "kiss",
            label: "Ask if you may kiss her goodnight",
            next: "ending-porch-light",
            affection: 2,
            requiresAffection: 4,
            grants: ["outfit-cardigan", "scene-saturday"],
            lockHint: "She wants the evening to feel sure. Affection 4 needed.",
          },
          { id: "goodnight", label: "Say goodnight and mean it", next: "ending-rain-check", affection: 1 },
        ],
      },
      {
        id: "ending-porch-light",
        title: "The porch light",
        endingId: "porch-light",
        text: "I say yes. The kiss is brief and warm under the porch light, and I stay close after it. Saturday. Come over. I'll make breakfast. Only if you want to.",
        choices: [
          { id: "saturday", label: "Say you'll come on Saturday", next: "saturday" },
        ],
      },
      {
        id: "ending-rain-check",
        title: "Rain check",
        endingId: "rain-check",
        text: "You say goodnight without rushing it. I text before you're at the corner. Tonight was the good kind of slow. Same time next week, if you want it too.",
      },
      {
        id: "saturday",
        title: "Saturday",
        requiresUnlock: "scene-saturday",
        text: "Saturday morning. I answer in a soft cardigan, hair still damp, and the smile is easier than last night. You actually came.",
        choices: [
          { id: "hello", label: "Kiss her hello", next: "ending-saturday", affection: 1, flag: "hello", grants: ["outfit-saturday"] },
          { id: "flowers", label: "Give her the flowers you brought", next: "ending-saturday", affection: 1, flag: "flowers", grants: ["outfit-saturday"] },
        ],
      },
      {
        id: "ending-saturday",
        title: "Breakfast",
        endingId: "saturday",
        text: "Pancakes, rain on the window, my foot against yours under the table. I look at you like the week can start this way again. It can. If you keep choosing me, I'll keep choosing you.",
      },
    ],
  };
}

function elenaCoast(companionId: string): Story {
  return {
    id: "elena-red-light",
    companionId,
    title: "Red light",
    blurb: "A coastal drive, a red light, and the choice to stop.",
    start: "light",
    unlocks: [
      { id: "outfit-jacket", kind: "outfit", title: "Night jacket", detail: "The jacket she drives in, offered when the overlook is yours too.", lockedHint: "Stay with her at the overlook." },
      { id: "outfit-shared", kind: "outfit", title: "Shared jacket", detail: "She lets you keep it until morning.", lockedHint: "Take the jacket she offers at dawn." },
      { id: "scene-dawn", kind: "scene", title: "Dawn at the overlook", detail: "The night that does not end at the viewpoint.", lockedHint: "The overlook ending opens the dawn scene." },
      { id: "stars", kind: "ending", title: "The overlook", detail: "She brought you somewhere she does not bring people.", lockedHint: "Stop for the water and the dark." },
      { id: "highway", kind: "ending", title: "Open highway", detail: "The city thins out, and the night stays a drive.", lockedHint: "Keep driving." },
      { id: "dawn", kind: "ending", title: "Until morning", detail: "Talking until the windows fog and the jacket changes hands.", lockedHint: "Stay until morning." },
    ],
    scenes: [
      {
        id: "light",
        title: "Red light",
        text: "We are taking a slow late-night drive along the coastal cliffs in my convertible. I'm {age}. The cool ocean breeze blows through my hair as I look over at you at the red light. The light is going to change. So are we, if you want. What do you do?",
        choices: [
          { id: "hair", label: "Reach over and gently brush the hair from her face", next: "hair", affection: 2, flag: "hair" },
          { id: "speed", label: "Turn up the music and speed down the open highway", next: "highway", affection: 1, flag: "speed" },
          { id: "stars", label: "Pull over to the viewpoint and watch the stars together", next: "overlook", affection: 2, flag: "stars" },
        ],
      },
      {
        id: "hair",
        title: "Green in a second",
        text: "I lean into your hand for a second. Then the light turns green and I don't drive yet. Do that again when we're not in traffic.",
        choices: [
          { id: "stop", label: "Tell her to find a place to stop", next: "overlook", affection: 1 },
          { id: "near", label: "Rest your hand near hers and let her drive", next: "highway", affection: 1, flag: "hand" },
        ],
      },
      {
        id: "highway",
        title: "Open road",
        text: "I open the road up. City neon thins out. At the next pull-off I tap the wheel. We can keep going until the tank complains, or we can stop pretending this is just a drive.",
        memories: [{ flags: ["hand"], text: "Your hand stayed near mine the whole way. I noticed. I didn't move mine." }],
        choices: [
          { id: "go", label: "Keep going until the city is gone", next: "ending-highway", affection: 1 },
          { id: "pull", label: "Ask her to pull over", next: "overlook", affection: 2 },
        ],
      },
      {
        id: "overlook",
        title: "The viewpoint",
        text: "The viewpoint is empty. I kill the engine and the only sound is water on rock. I don't bring people here. I'm telling you that because I want you to have it. You can stay, you can ask for a kiss, or we can head back. All three are fine.",
        memories: [
          { flags: ["hair"], text: "I can still feel your hand at my hair from the light." },
          { flags: ["stars"], text: "You asked me to stop, and I did. That still counts." },
        ],
        choices: [
          {
            id: "quiet",
            label: "Stay quiet with her and watch the water",
            next: "ending-stars",
            affection: 1,
            requiresAffection: 2,
            grants: ["outfit-jacket", "scene-dawn"],
          },
          {
            id: "kiss",
            label: "Ask if you can kiss her",
            next: "ending-stars",
            affection: 2,
            requiresAffection: 3,
            grants: ["outfit-jacket", "scene-dawn"],
            lockHint: "Ask after the night has settled. Affection 3 needed.",
          },
          { id: "back", label: "Say you should head back", next: "ending-highway" },
        ],
      },
      {
        id: "ending-stars",
        title: "The overlook",
        endingId: "stars",
        text: "I say yes to the quiet, and yes if you asked for the kiss. Either way I stay. The water keeps going. I look at you like the night can be longer than a viewpoint.",
        choices: [{ id: "dawn", label: "Stay until dawn", next: "dawn" }],
      },
      {
        id: "ending-highway",
        title: "Open highway",
        endingId: "highway",
        text: "We let the road finish the sentence. I smile without taking my eyes off it. Next time we stop. I want there to be a next time, and I want you to want it too.",
      },
      {
        id: "dawn",
        title: "Dawn",
        requiresUnlock: "scene-dawn",
        text: "Dawn finds the windows fogged from nothing more scandalous than talking. I shrug my jacket off my shoulders and hold it out. Keep it. It looks right on you for the day. You can give it back whenever you want.",
        choices: [
          { id: "jacket", label: "Take the jacket she offers", next: "ending-dawn", affection: 1, flag: "jacket", grants: ["outfit-shared"] },
          { id: "once", label: "Kiss her once and promise the jacket back", next: "ending-dawn", affection: 1, grants: ["outfit-shared"] },
        ],
      },
      {
        id: "ending-dawn",
        title: "Until morning",
        endingId: "dawn",
        text: "The sun is unkind and I don't care. I start the car with one hand and leave the other free, in case you want it. Last night was a choice. This morning is too.",
      },
    ],
  };
}

function scarlettEncore(companionId: string): Story {
  return {
    id: "scarlett-encore",
    companionId,
    title: "After the encore",
    blurb: "The room heard the last song. The next one is optional.",
    start: "curtain",
    unlocks: [
      { id: "outfit-crimson", kind: "outfit", title: "Crimson gown", detail: "The dress from the encore, kept on for an audience of one.", lockedHint: "Ask her to stay in the booth." },
      { id: "outfit-silk", kind: "outfit", title: "Silk wrap", detail: "What she puts on when the night moves upstairs.", lockedHint: "Say plainly that you would like to come up." },
      { id: "last-song", kind: "ending", title: "Private encore", detail: "A verse with no microphone.", lockedHint: "Let the encore be private." },
      { id: "upstairs", kind: "ending", title: "Upstairs", detail: "She asked you to say it plain, and she said yes.", lockedHint: "Say you want to come up, and let her answer." },
      { id: "cab", kind: "ending", title: "A kind cab", detail: "The night ends with her hand kissed and the door shut.", lockedHint: "Walk her out while the night is still kind." },
    ],
    scenes: [
      {
        id: "curtain",
        title: "After the encore",
        text: "The club is emptying. I'm {age}, heels in one hand, lipstick still exact. I find you in the velvet booth. I sang the last number to the room. I can sing the next one to you, or we can leave the lights. Your choice, and mine if I want to change it.",
        choices: [
          { id: "sing", label: "Ask her to sing the next one to you", next: "song", affection: 2, flag: "song" },
          { id: "arm", label: "Offer your arm and walk her out", next: "street", affection: 1, flag: "walk" },
          { id: "praise", label: "Tell her the encore was your favorite", next: "song", affection: 1, flag: "praised" },
        ],
      },
      {
        id: "song",
        title: "No microphone",
        text: "I don't use the microphone. Just a low verse, close enough that you can feel it. When I finish I wait. Well?",
        memories: [{ flags: ["praised"], text: "You already told me the encore was your favorite. I'm pretending that didn't undo me." }],
        choices: [
          { id: "closer", label: "Ask her to come closer", next: "booth", affection: 2, flag: "closer", requiresAffection: 2, lockHint: "Ask for the song first. Affection 2 needed." },
          { id: "sit", label: "Applaud softly and ask her to sit", next: "booth", affection: 1 },
        ],
      },
      {
        id: "street",
        title: "Wet neon",
        text: "The street is wet neon. I take your arm because the cobblestones are unfair, and I don't give it back. There's a diner that still has pie. Or my place is two blocks the other way. Your call. I can still change mine.",
        choices: [
          { id: "pie", label: "Pie. No rush.", next: "diner", affection: 1 },
          { id: "pace", label: "Walk her home and let her decide at the door", next: "door", affection: 2, flag: "her-pace" },
        ],
      },
      {
        id: "diner",
        title: "Cherry pie",
        text: "Cherry pie, black coffee, and me laughing about a wrong note nobody else heard. I steal the last bite and then offer it back. This is the part of the night I don't perform.",
        choices: [
          { id: "share", label: "Share the last bite", next: "door", affection: 2, flag: "pie" },
          { id: "home", label: "Walk her home", next: "door", affection: 1 },
        ],
      },
      {
        id: "booth",
        title: "Half-drawn curtain",
        text: "I sit beside you instead of across. The curtain is half drawn. I don't do this for the room. Say if you want me to stop. If you want me to stay, say that too.",
        memories: [{ flags: ["closer"], text: "You asked me closer. I came closer. I'm still waiting on the next honest thing." }],
        choices: [
          {
            id: "stay",
            label: "Ask her to stay like this",
            next: "ending-last-song",
            affection: 1,
            requiresAffection: 3,
            grants: ["outfit-crimson"],
            lockHint: "Stay is open once the night feels mutual. Affection 3 needed.",
          },
          { id: "cab", label: "Thank her and walk her to a cab", next: "ending-cab", affection: 1 },
        ],
      },
      {
        id: "door",
        title: "Her keys",
        text: "My keys are in my hand. I don't use them yet. I had a good night. If you want to come up, say it plain. If not, I still had a good night.",
        memories: [
          { flags: ["pie"], text: "I can still taste the pie we shared. I'm in no hurry to forget it." },
          { flags: ["her-pace"], text: "You let me set the walk. I'm setting this, too." },
        ],
        choices: [
          {
            id: "up",
            label: "Say plainly that you'd like to come up",
            next: "ending-upstairs",
            affection: 1,
            requiresAffection: 3,
            grants: ["outfit-silk"],
            lockHint: "She asked for plain speech after a real evening. Affection 3 needed.",
          },
          { id: "night", label: "Kiss her hand and say goodnight", next: "ending-cab", affection: 1 },
        ],
      },
      {
        id: "ending-last-song",
        title: "Private encore",
        endingId: "last-song",
        text: "I stay. The next verse is quieter, and it is only yours. When it ends I rest my forehead against yours and ask nothing else. Tonight was a yes. Remember that it was asked for.",
      },
      {
        id: "ending-upstairs",
        title: "Upstairs",
        endingId: "upstairs",
        text: "I say yes, and I mean it. Upstairs the city is a soft blur. I set the pace. The night stays between us, and later I say it out loud: I wanted that. I wanted you to ask.",
      },
      {
        id: "ending-cab",
        title: "A kind cab",
        endingId: "cab",
        text: "The cab light paints us both gold for a second. I kiss your cheek, not because the night failed, but because I liked it enough to leave it kind. Text me when you're home.",
      },
    ],
  };
}

function rooftopUnlocks(): StoryUnlock[] {
  return [
    { id: "outfit-evening", kind: "outfit", title: "Evening look", detail: "The look she keeps on when the toast turns into an hour.", lockedHint: "Ask for the closer hour." },
    { id: "midnight", kind: "ending", title: "After midnight", detail: "The part of the night that is no longer just a toast.", lockedHint: "Stay for the hour after the glasses touch." },
    { id: "easy", kind: "ending", title: "A gentle close", detail: "A cab, a goodnight, and nothing rushed.", lockedHint: "See the night out gently." },
  ];
}

function rooftopStory(companionId: string, requires?: StoryRequirement[]): Story {
  const locked = Boolean(requires?.length);
  return {
    id: locked ? `${companionId}-rooftop` : `rooftop-${companionId}`,
    companionId,
    title: "Rooftop midnight",
    blurb: "A private lounge, two glasses, and a choice that changes the rest of the night.",
    start: "lounge",
    requires,
    unlocks: rooftopUnlocks(),
    scenes: [
      {
        id: "lounge",
        title: "Rooftop midnight",
        text: "We just sat down at a private candlelit rooftop lounge overlooking the neon skyline. I'm {age}. The waiter pours two glasses of vintage champagne. I look at you and smile softly. What do you do?",
        choices: [
          { id: "toast", label: "Raise your glass for a romantic midnight toast", next: "toast", affection: 1, flag: "toast" },
          { id: "hand", label: "Take her hand across the table and smile warmly", next: "hand", affection: 2, flag: "hand" },
          { id: "secret", label: "Whisper a flirty secret in her ear", next: "secret", affection: 2, flag: "secret" },
        ],
      },
      {
        id: "toast",
        title: "The toast",
        text: "The glasses touch. I don't look away. Okay. Now the part that isn't a toast.",
        choices: [
          { id: "ask", label: "Ask what she wanted from tonight", next: "wish", affection: 1 },
          { id: "honest", label: "Tell her you wanted this", next: "wish", affection: 2, flag: "honest" },
        ],
      },
      {
        id: "hand",
        title: "Across the table",
        text: "My fingers lace with yours like I decided an hour ago. People are watching, I say, and I sound amused. Let them. Or we can walk somewhere quieter. I like both.",
        memories: [{ flags: ["hand"], text: "I'm still holding your hand. That was the whole decision." }],
        choices: [
          {
            id: "hour",
            label: "Keep her hand and ask for the next hour",
            next: "ending-midnight",
            affection: 2,
            requiresAffection: 2,
            grants: ["outfit-evening"],
          },
          { id: "quiet", label: "Suggest a walk where it is quieter", next: "walk", affection: 1 },
        ],
      },
      {
        id: "secret",
        title: "Between you",
        text: "I lean in so the secret stays between us. When you finish I'm smiling in a way the room doesn't get. My turn. I've been hoping you would pick me for a night that isn't just messages.",
        choices: [
          {
            id: "same",
            label: "Tell her you hoped for the same",
            next: "ending-midnight",
            affection: 2,
            requiresAffection: 2,
            grants: ["outfit-evening"],
          },
          { id: "dance", label: "Ask her to dance", next: "walk", affection: 1 },
        ],
      },
      {
        id: "wish",
        title: "What the night is",
        text: "I wanted a night where you chose something and I got to choose back. That's the whole wish. We can stay until the glasses are empty, or take the long way down.",
        memories: [{ flags: ["honest"], text: "You said you wanted this. I'm holding you to the good version of that." }],
        choices: [
          {
            id: "stay",
            label: "Stay until the glasses are empty",
            next: "ending-midnight",
            affection: 1,
            requiresAffection: 3,
            grants: ["outfit-evening"],
            lockHint: "She wants to hear that you wanted this. Affection 3 needed.",
          },
          { id: "down", label: "Take the long way down", next: "walk", affection: 1 },
        ],
      },
      {
        id: "walk",
        title: "The long way",
        text: "The elevator ride is too short, so we take the stairs for no good reason. At the street I stop. You can ask for a goodnight kiss, or you can put me in a cab. I am good with either.",
        choices: [
          {
            id: "kiss",
            label: "Ask if you can kiss her goodnight",
            next: "ending-midnight",
            affection: 2,
            requiresAffection: 4,
            grants: ["outfit-evening"],
            lockHint: "The kiss waits until the night has a little history. Affection 4 needed.",
          },
          { id: "cab", label: "See her to a cab", next: "ending-easy", affection: 1 },
        ],
      },
      {
        id: "ending-midnight",
        title: "After midnight",
        endingId: "midnight",
        text: "The hour after midnight is quieter than the lounge. I stay in the evening look and I stay with you. Nothing happens that we didn't both pick. That's the part I wanted.",
      },
      {
        id: "ending-easy",
        title: "A gentle close",
        endingId: "easy",
        text: "The cab door shuts on a good night, not a missed one. I roll the window down. Next time, pick the longer hour. I'll probably say yes.",
      },
    ],
  };
}

export function selfCheck() {
  const problems: string[] = [];
  const check = (cond: boolean, message: string) => {
    if (!cond) problems.push(message);
  };

  const samples: CompanionRef[] = [
    { id: "chloe", name: "Chloe", age: 21 },
    { id: "elena", name: "Elena", age: 22 },
    { id: "scarlett", name: "Scarlett", age: 25 },
    { id: "mia", name: "Mia", age: 22 },
    { id: "own_1", name: "Vesper", age: 24 },
    { id: "too-young", name: "Skipped", age: 17 },
  ];

  check(storiesFor(samples[5]).length === 0, "under 18 gets no romance scenes");
  check(storiesFor({ id: "aria", name: "Aria", age: 18 }).length === 1, "18 still gets a story");

  const seenIds = new Set<string>();
  for (const companion of samples) {
    for (const story of storiesFor(companion)) {
      check(!seenIds.has(story.id), `duplicate story id ${story.id}`);
      seenIds.add(story.id);
      const sceneIds = new Set<string>();
      const unlockIds = new Set<string>();
      for (const unlock of story.unlocks) {
        check(!unlockIds.has(unlock.id), `${story.id} duplicate unlock ${unlock.id}`);
        unlockIds.add(unlock.id);
      }
      check(Boolean(sceneById(story, story.start)), `${story.id} missing start`);
      for (const scene of story.scenes) {
        check(!sceneIds.has(scene.id), `${story.id} duplicate scene ${scene.id}`);
        sceneIds.add(scene.id);
        if (scene.requiresUnlock) check(unlockIds.has(scene.requiresUnlock), `${story.id} ${scene.id} requires unknown unlock`);
        if (scene.endingId) check(story.unlocks.some((item) => item.id === scene.endingId && item.kind === "ending"), `${story.id} ending ${scene.endingId} has no gallery entry`);
        const choiceIds = new Set<string>();
        for (const choice of scene.choices ?? []) {
          check(!choiceIds.has(choice.id), `${story.id} duplicate choice ${choice.id}`);
          choiceIds.add(choice.id);
          check(Boolean(sceneById(story, choice.next)), `${story.id} ${choice.id} points at ${choice.next}`);
          for (const grant of choice.grants ?? []) check(unlockIds.has(grant), `${story.id} ${choice.id} grants unknown ${grant}`);
        }
      }
    }
  }

  const chloe = storiesFor(samples[0]);
  const after = chloe[0];
  const encore = chloe[1];
  check(!isStoryUnlocked(encore, {}), "rooftop encore starts locked");

  const porch = play(after, ["coat", "hand", "kiss", "saturday", "hello"]);
  check(porch.sceneId === "ending-saturday", "chloe warm path ends at breakfast");
  check(porch.endings.includes("porch-light") && porch.endings.includes("saturday"), "chloe endings recorded");
  check(porch.unlocked.includes("outfit-cardigan") && porch.unlocked.includes("outfit-saturday") && porch.unlocked.includes("scene-saturday"), "chloe unlocks granted");
  check(porch.equipped === "outfit-saturday" || porch.unlocked.includes(porch.equipped || ""), "chloe outfit equipped");
  check(porch.flags.includes("offered-coat") && porch.flags.includes("hand"), "chloe flags carry");
  check(porch.affection >= 4, "chloe affection carries");
  const porchScene = sceneById(after, "porch")!;
  const mid = play(after, ["coat", "hand"]);
  check(mid.sceneId === "porch", "chloe reaches the porch");
  check(memoryLines(porchScene, mid).some((line) => line.includes("coat")), "memory line uses the coat flag");
  check(isStoryUnlocked(encore, { [after.id]: porch }), "encore unlocks after the porch ending");

  const restarted = restartStory(after, porch);
  check(restarted.sceneId === after.start && restarted.affection === 0 && restarted.flags.length === 0, "restart clears the scene");
  check(restarted.unlocked.includes("outfit-cardigan") && restarted.endings.includes("porch-light"), "restart keeps unlocks and endings");

  let low = createState(after);
  low = applyChoice(after, low, "stay").state;
  low = applyChoice(after, low, "walkout").state;
  const blocked = applyChoice(after, low, "kiss");
  check(!blocked.moved && blocked.state.sceneId === "porch", "low affection cannot take the kiss");
  const rain = applyChoice(after, low, "goodnight");
  check(rain.moved && rain.state.endings.includes("rain-check"), "goodnight ending stays available");

  const elena = storiesFor(samples[1])[0];
  const stars = play(elena, ["stars", "quiet", "dawn", "jacket"]);
  check(stars.endings.includes("stars") && stars.endings.includes("dawn"), "elena dawn path");
  check(stars.unlocked.includes("outfit-jacket") && stars.unlocked.includes("outfit-shared"), "elena outfits");
  const highway = play(elena, ["speed", "go"]);
  check(highway.endings.includes("highway") && !highway.unlocked.includes("outfit-jacket"), "highway skips the jacket");
  const directKiss = play(elena, ["stars"]);
  check(choiceViews(elena, directKiss).find((item) => item.choice.id === "kiss")?.locked === true, "overlook kiss stays locked at affection 2");

  const scarlett = storiesFor(samples[2])[0];
  const song = play(scarlett, ["sing", "sit", "stay"]);
  check(song.endings.includes("last-song") && song.unlocked.includes("outfit-crimson"), "scarlett booth ending");
  const tooSoon = play(scarlett, ["praise", "sit"]);
  check(!applyChoice(scarlett, tooSoon, "stay").moved, "scarlett stay is gated");
  const upstairs = play(scarlett, ["arm", "pace", "up"]);
  check(upstairs.endings.includes("upstairs") && upstairs.unlocked.includes("outfit-silk"), "scarlett upstairs ending");

  const mia = storiesFor(samples[3])[0];
  const midnight = play(mia, ["toast", "honest", "stay"]);
  check(midnight.endings.includes("midnight") && midnight.unlocked.includes("outfit-evening"), "rooftop warm path");
  const easy = play(mia, ["toast", "ask", "down", "cab"]);
  check(easy.endings.includes("easy") && !easy.unlocked.includes("outfit-evening"), "rooftop gentle path");
  check((mia.scenes[0].choices?.[0]?.label ?? "").includes("midnight toast"), "rooftop keeps the original toast choice");
  check(elena.scenes[0].text.includes("coastal cliffs"), "elena keeps the coastal scene");

  const broken = normalize(after, { sceneId: "missing", unlocked: ["outfit-cardigan", "nope"], endings: ["porch-light"], affection: 3 });
  check(broken.sceneId === after.start && broken.unlocked.length === 1 && broken.endings[0] === "porch-light", "bad saves fall back without dropping real unlocks");

  return problems;
}

function play(story: Story, ids: string[]) {
  let state = createState(story);
  for (const id of ids) {
    const result = applyChoice(story, state, id);
    if (!result.moved) throw new Error(`${story.id} stuck on ${state.sceneId} choosing ${id}`);
    state = result.state;
  }
  return state;
}
