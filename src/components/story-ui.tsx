"use client";

import React, { useEffect, useState } from "react";
import { Lock, RotateCcw } from "lucide-react";
import {
  applyChoice,
  equipOutfit,
  fillText,
  memoryLines,
  restartStory,
  sceneById,
  wearingLine,
  type CompanionRef,
  type Story,
  type StoryState,
  type StoryUnlock,
  choiceViews,
} from "../lib/story-engine";
import { STUDIO_SUGGESTIONS, type ReaderSuggestion } from "../lib/suggestions";

export function StatusTag({ status }: { status: "implemented" | "open" | "locked" | "unlocked" }) {
  const tone =
    status === "implemented" || status === "unlocked"
      ? "bg-emerald-500/15 text-emerald-300"
      : status === "locked"
        ? "bg-white/10 text-zinc-400"
        : "bg-amber-500/15 text-amber-200";
  const label = status === "implemented" ? "Implemented" : status === "open" ? "Open" : status === "locked" ? "Locked" : "Unlocked";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone}`}>{label}</span>;
}

export function AffectionMeter({ value, peak }: { value: number; peak: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Affection ${value} of 10`}>
      {Array.from({ length: 10 }, (_, index) => (
        <span key={index} className={`h-1.5 w-2.5 rounded-full ${index < value ? "bg-pink-500" : "bg-white/10"}`} />
      ))}
      <span className="ml-1 text-[10px] font-bold text-pink-200">{value}/10</span>
      {peak > value ? <span className="text-[10px] text-zinc-500">best {peak}</span> : null}
    </div>
  );
}

export function ScenePlayer({
  companion,
  story,
  state,
  compact,
  onChange,
  onSpeak,
}: {
  companion: CompanionRef & { avatar?: string };
  story: Story;
  state: StoryState;
  compact?: boolean;
  onChange: (state: StoryState) => void;
  onSpeak?: (line: string) => void;
}) {
  const [notice, setNotice] = useState<StoryUnlock[]>([]);
  const scene = sceneById(story, state.sceneId) ?? sceneById(story, story.start)!;
  const views = choiceViews(story, state);
  const memories = memoryLines(scene, state).map((line) => fillText(line, companion));
  const worn = wearingLine(story, state);

  useEffect(() => {
    setNotice([]);
  }, [story.id]);

  const pick = (choiceId: string) => {
    const result = applyChoice(story, state, choiceId);
    if (!result.moved) return;
    setNotice(result.newUnlocks);
    onChange(result.state);
    const next = sceneById(story, result.state.sceneId);
    if (next && onSpeak) {
      const spoken = fillText(next.text, companion).split(/(?<=[.!?])\s/)[0] ?? "";
      onSpeak(spoken.slice(0, 180));
    }
  };

  return (
    <div className={compact ? "" : "rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"} data-testid="story-scene">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-pink-300">{story.title}</p>
          <h3 className="text-sm font-bold text-white">{scene.title}</h3>
        </div>
        <AffectionMeter value={state.affection} peak={state.peakAffection} />
      </div>
      <p className={`mt-3 text-sm leading-relaxed text-white/90 ${compact ? "max-h-24 overflow-y-auto" : ""}`}>{fillText(scene.text, companion)}</p>
      {worn ? <p className="mt-2 text-[11px] text-pink-200">{worn}</p> : null}
      {memories.length > 0 ? (
        <div className="mt-3 space-y-1 rounded-2xl border border-pink-500/20 bg-pink-500/10 px-3 py-2">
          {memories.map((line) => (
            <p key={line} className="text-[11px] leading-relaxed text-pink-100">Still with you: {line}</p>
          ))}
        </div>
      ) : null}
      {state.history.length > 0 ? (
        <p className="mt-2 text-[11px] text-zinc-500">You chose: {state.history.slice(-3).map((entry) => entry.label).join(" · ")}</p>
      ) : null}
      {scene.endingId ? (
        <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-emerald-300">
          Ending · {story.unlocks.find((item) => item.id === scene.endingId)?.title ?? scene.title}
        </p>
      ) : null}
      {notice.length > 0 ? (
        <p className="mt-2 text-[11px] font-semibold text-emerald-300">Unlocked: {notice.map((item) => item.title).join(", ")}</p>
      ) : null}
      <div className="mt-3 space-y-1.5">
        {views.map(({ choice, locked, reason }) => (
          <button
            key={choice.id}
            type="button"
            disabled={locked}
            onClick={() => pick(choice.id)}
            data-testid="story-choice"
            data-locked={locked ? "true" : "false"}
            className={`flex w-full items-start gap-2 rounded-2xl border px-3 py-2 text-left text-sm ${
              locked
                ? "cursor-not-allowed border-white/5 bg-black/30 text-zinc-500"
                : "border-white/10 bg-white/5 text-white hover:border-pink-500/50"
            }`}
          >
            {locked ? <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <span className="mt-0.5 text-pink-400">▸</span>}
            <span>
              <span className="block">{choice.label}</span>
              {locked ? <span className="mt-0.5 block text-[11px] text-zinc-500">{reason}</span> : null}
            </span>
          </button>
        ))}
      </div>
      {state.history.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            setNotice([]);
            onChange(restartStory(story, state));
          }}
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" /> Start over, keep unlocks
        </button>
      ) : null}
      {compact ? null : <UnlockBoard story={story} state={state} onEquip={(id) => onChange(equipOutfit(story, state, id))} />}
    </div>
  );
}

export function UnlockBoard({
  story,
  state,
  onEquip,
}: {
  story: Story;
  state: StoryState;
  onEquip?: (id: string) => void;
}) {
  const groups: { kind: StoryUnlock["kind"]; label: string }[] = [
    { kind: "outfit", label: "Outfits" },
    { kind: "scene", label: "Scenes" },
    { kind: "ending", label: "Endings" },
  ];
  return (
    <div className="mt-4 space-y-3">
      {groups.map((group) => {
        const items = story.unlocks.filter((item) => item.kind === group.kind);
        if (!items.length) return null;
        return (
          <div key={group.kind}>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{group.label}</p>
            <div className="space-y-1.5">
              {items.map((item) => {
                const open = state.unlocked.includes(item.id) || (item.kind === "ending" && state.endings.includes(item.id));
                const wearing = state.equipped === item.id;
                return (
                  <div key={item.id} data-testid="unlock-row" data-state={open ? "unlocked" : "locked"} className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-white">{item.title}</p>
                      <StatusTag status={open ? "unlocked" : "locked"} />
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">{open ? item.detail : item.lockedHint}</p>
                    {open && item.kind === "outfit" && onEquip ? (
                      <button
                        type="button"
                        onClick={() => onEquip(item.id)}
                        className={`mt-2 rounded-full px-3 py-1 text-[10px] font-bold ${wearing ? "bg-pink-600 text-white" : "border border-white/15 text-zinc-200"}`}
                      >
                        {wearing ? "Wearing" : "Wear"}
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SuggestionBoard({
  ideas,
  onAdd,
}: {
  ideas: ReaderSuggestion[];
  onAdd: (title: string, detail: string) => boolean;
}) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-pink-300">Ideas</p>
        <h2 className="mt-1 text-lg font-black text-white">What to build next</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          No reader suggestions were saved in this project. The studio ideas below are already in the app, and each one carries a status tag. Add your own and it stays on this phone as Open.
        </p>
      </div>
      <ul className="space-y-2">
        {STUDIO_SUGGESTIONS.map((idea) => (
          <li key={idea.id} data-testid="suggestion-row" data-status={idea.status} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-white">{idea.title}</p>
                <p className="mt-1 text-[11px] text-zinc-500">Studio</p>
              </div>
              <StatusTag status={idea.status} />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">{idea.detail}</p>
          </li>
        ))}
        {ideas.map((idea) => (
          <li key={idea.id} data-testid="suggestion-row" data-status={idea.status} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-white">{idea.title}</p>
                <p className="mt-1 text-[11px] text-zinc-500">You</p>
              </div>
              <StatusTag status={idea.status} />
            </div>
            {idea.detail ? <p className="mt-2 text-xs leading-relaxed text-zinc-400">{idea.detail}</p> : null}
          </li>
        ))}
      </ul>
      <form
        data-testid="suggestion-form"
        className="space-y-2 rounded-3xl border border-white/10 bg-white/[0.03] p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const ok = onAdd(title, detail);
          if (!ok) {
            setError("Need a new idea, at least 4 characters.");
            return;
          }
          setTitle("");
          setDetail("");
          setError("");
        }}
      >
        <p className="text-xs font-bold text-zinc-300">Add an idea</p>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="A night market date"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
        />
        <textarea
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          placeholder="What should the choice change?"
          rows={2}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
        />
        {error ? <p className="text-[11px] text-amber-200">{error}</p> : null}
        <button type="submit" className="rounded-full bg-pink-600 px-4 py-2 text-xs font-bold text-white">
          Save idea
        </button>
      </form>
    </div>
  );
}
