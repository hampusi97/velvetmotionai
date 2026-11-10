"use client";

import React from "react";
import { isStoryUnlocked, normalize, storiesFor, storyLockHint, type CompanionRef } from "../lib/story-engine";
import { useStoryProgress } from "../lib/use-story-progress";
import { ScenePlayer } from "./story-ui";

export function SceneChoices({
  companion,
  onSpeak,
  onOpenStudio,
}: {
  companion: CompanionRef & { avatar?: string };
  onSpeak?: (line: string) => void;
  onOpenStudio: () => void;
}) {
  const progress = useStoryProgress();
  const stories = storiesFor(companion);
  if (!stories.length) return null;
  if (!progress.ready) {
    return <p className="mb-2 text-[11px] text-zinc-500">Loading her scene…</p>;
  }

  const open = stories.filter((story) => isStoryUnlocked(story, progress.all));
  const preferred = progress.active[companion.id];
  const story = open.find((item) => item.id === preferred) ?? open[0];
  if (!story) {
    return (
      <div className="mb-2 rounded-2xl border border-white/10 bg-black/40 px-3 py-2">
        <p className="text-xs font-bold text-white">Her next story is locked</p>
        <p className="mt-1 text-[11px] text-zinc-400">{stories.map((item) => storyLockHint(item)).filter(Boolean).join(" ")}</p>
      </div>
    );
  }
  const state = normalize(story, progress.all[story.id]);

  return (
    <div className="mb-2 max-h-[40vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#120E1C]/90 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        {stories.length > 1 ? (
          <label className="min-w-0 flex-1 text-[11px] text-zinc-400">
            <span className="sr-only">Story</span>
            <select
              value={story.id}
              onChange={(event) => progress.focus(companion.id, event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-2 py-1 text-xs text-white"
            >
              {stories.map((item) => {
                const unlocked = isStoryUnlocked(item, progress.all);
                return (
                  <option key={item.id} value={item.id} disabled={!unlocked}>
                    {item.title}{unlocked ? "" : " (locked)"}
                  </option>
                );
              })}
            </select>
          </label>
        ) : (
          <p className="text-[11px] font-bold uppercase tracking-widest text-pink-300">Scene</p>
        )}
        <button type="button" onClick={onOpenStudio} className="shrink-0 text-[11px] font-bold text-pink-300">
          Unlocks & ideas
        </button>
      </div>
      <ScenePlayer
        compact
        companion={companion}
        story={story}
        state={state}
        onSpeak={onSpeak}
        onChange={(next) => {
          progress.commit(next);
          progress.focus(companion.id, story.id);
        }}
      />
    </div>
  );
}
