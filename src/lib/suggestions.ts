// No reader suggestions were stored in the repo, the database seed, or GitHub issues.
// These studio ideas are the ones this pass actually ships. Reader additions stay Open.

export interface StudioSuggestion {
  id: string;
  title: string;
  detail: string;
  status: "implemented";
  source: "studio";
}

export interface ReaderSuggestion {
  id: string;
  title: string;
  detail: string;
  status: "open";
  source: "reader";
  createdAt: string;
}

export const STUDIO_SUGGESTIONS: StudioSuggestion[] = [
  {
    id: "branching-choices",
    title: "Choice buttons that change the next scene",
    detail: "A date should branch. The button you tap is the next scene, not a one-off chat line.",
    status: "implemented",
    source: "studio",
  },
  {
    id: "carried-state",
    title: "Remember what I chose in the last scene",
    detail: "Affection, flags, and a line in her voice carry into the next scene.",
    status: "implemented",
    source: "studio",
  },
  {
    id: "continue-later",
    title: "Continue a story where I left it",
    detail: "Scene, affection, and unlocks stay on this phone.",
    status: "implemented",
    source: "studio",
  },
  {
    id: "unlock-outfits",
    title: "Unlock outfits after we get closer",
    detail: "Locked looks show why. Unlocked looks can be worn in the scene.",
    status: "implemented",
    source: "studio",
  },
  {
    id: "ending-gallery",
    title: "Keep an ending gallery",
    detail: "Finished endings stay unlocked when you start the night over.",
    status: "implemented",
    source: "studio",
  },
  {
    id: "locked-scenes",
    title: "Scenes that open after a certain night",
    detail: "Saturday morning and the dawn overlook stay locked until you earn them.",
    status: "implemented",
    source: "studio",
  },
  {
    id: "affection-gates",
    title: "Some choices wait until affection is high enough",
    detail: "The button stays visible and says what it is waiting on.",
    status: "implemented",
    source: "studio",
  },
  {
    id: "follow-up-story",
    title: "A follow-up story that unlocks from an ending",
    detail: "Chloe's rooftop encore opens after The porch light.",
    status: "implemented",
    source: "studio",
  },
];
