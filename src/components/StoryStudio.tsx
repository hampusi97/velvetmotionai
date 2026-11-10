"use client";

import React, { useEffect, useState } from "react";
import { isStoryUnlocked, normalize, storiesFor, storyLockHint, type CompanionRef } from "../lib/story-engine";
import { useStoryProgress } from "../lib/use-story-progress";
import { ScenePlayer, StatusTag, SuggestionBoard } from "./story-ui";

export interface StoryCompanion extends CompanionRef {
  avatar: string;
  category?: string;
}

export function StoryStudio({
  companions,
  focusId,
  onOpenChat,
}: {
  companions: StoryCompanion[];
  focusId: string;
  onOpenChat: (id: string) => void;
}) {
  const progress = useStoryProgress();
  const [panel, setPanel] = useState<"stories" | "ideas">("stories");
  const [filterId, setFilterId] = useState(focusId);
  const [readingId, setReadingId] = useState<string | null>(null);

  useEffect(() => {
    setFilterId(focusId);
  }, [focusId]);

  const catalog = companions.flatMap((companion) =>
    storiesFor(companion).map((story) => ({ companion, story })),
  );
  const focus = companions.find((companion) => companion.id === focusId) ?? companions[0];

  useEffect(() => {
    if (!progress.ready || !focus) return;
    const stories = storiesFor(focus);
    const preferred = progress.active[focus.id];
    const pick =
      stories.find((story) => story.id === preferred && isStoryUnlocked(story, progress.all)) ??
      stories.find((story) => isStoryUnlocked(story, progress.all));
    setReadingId(pick?.id ?? null);
  }, [focusId, progress.ready]);

  const visible = catalog.filter((entry) => filterId === "all" || entry.companion.id === filterId);
  const reading = catalog.find((entry) => entry.story.id === readingId) ?? null;
  const readingState = reading ? normalize(reading.story, progress.all[reading.story.id]) : null;

  return (
    <main className="flex-1 overflow-y-auto bg-[#0B0912]/80 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-5 pb-16">
        <div className="rounded-3xl border border-pink-500/20 bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-black/60 p-6 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-pink-300">Fictional adults, 18 and over</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">Stories</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
            Pick a scene, then pick what happens next. Affection and the choices you already made stay with you on this phone. Locked scenes, outfits, and endings say what they are waiting on.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setPanel("stories")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold ${panel === "stories" ? "bg-pink-600 text-white" : "border border-white/10 text-zinc-300"}`}
            >
              Stories
            </button>
            <button
              type="button"
              onClick={() => setPanel("ideas")}
              data-testid="ideas-tab"
              className={`rounded-full px-4 py-1.5 text-xs font-bold ${panel === "ideas" ? "bg-pink-600 text-white" : "border border-white/10 text-zinc-300"}`}
            >
              Ideas
            </button>
          </div>
        </div>

        {panel === "ideas" ? (
          <SuggestionBoard
            ideas={progress.ideas}
            onAdd={(title, detail) => Boolean(progress.suggest(title, detail))}
          />
        ) : (
          <div className="grid items-start gap-4 lg:grid-cols-[320px_1fr]">
            <div className="space-y-3">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                <FilterChip active={filterId === "all"} onClick={() => setFilterId("all")} label="All" />
                {companions.filter((companion) => storiesFor(companion).length > 0).map((companion) => (
                  <FilterChip
                    key={companion.id}
                    active={filterId === companion.id}
                    onClick={() => setFilterId(companion.id)}
                    label={companion.name}
                  />
                ))}
              </div>
              {visible.length === 0 ? (
                <p className="rounded-2xl border border-white/10 px-3 py-4 text-xs text-zinc-400">
                  Stories stay off for anyone under 18.
                </p>
              ) : null}
              {visible.map(({ companion, story }) => {
                const unlocked = progress.ready && isStoryUnlocked(story, progress.all);
                const state = normalize(story, progress.all[story.id]);
                const current = story.scenes.find((scene) => scene.id === state.sceneId);
                const selected = reading?.story.id === story.id;
                return (
                  <button
                    key={story.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => {
                      setReadingId(story.id);
                      progress.focus(companion.id, story.id);
                    }}
                    className={`w-full rounded-2xl border p-3 text-left ${
                      selected ? "border-pink-500 bg-pink-600/10" : "border-white/10 bg-black/30"
                    } ${unlocked ? "" : "opacity-70"}`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={companion.avatar} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-bold text-white">{story.title}</p>
                          <StatusTag status={unlocked ? "unlocked" : "locked"} />
                        </div>
                        <p className="text-[11px] text-zinc-500">{companion.name}, {companion.age}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                      {unlocked ? story.blurb : storyLockHint(story)}
                    </p>
                    {unlocked && progress.ready ? (
                      <p className="mt-2 text-[11px] text-pink-200">
                        {state.history.length === 0 ? "Not started" : current?.title} · {state.endings.length} endings · affection {state.affection}/10
                      </p>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div>
              {!progress.ready ? (
                <p className="rounded-3xl border border-white/10 px-4 py-8 text-sm text-zinc-400">Loading stories…</p>
              ) : reading && readingState ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={reading.companion.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-bold text-white">{reading.companion.name}, {reading.companion.age}</p>
                        <p className="text-[11px] text-zinc-500">{reading.story.blurb}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenChat(reading.companion.id)}
                      className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black"
                    >
                      Message
                    </button>
                  </div>
                  <ScenePlayer
                    companion={reading.companion}
                    story={reading.story}
                    state={readingState}
                    onChange={(next) => progress.commit(next)}
                  />
                </div>
              ) : (
                <p className="rounded-3xl border border-white/10 px-4 py-8 text-sm text-zinc-400">Choose a story to start the scene.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${active ? "bg-pink-600 text-white" : "border border-white/10 text-zinc-400"}`}
    >
      {label}
    </button>
  );
}

export function CompanionBond({
  companion,
  onOpenStudio,
}: {
  companion: CompanionRef;
  onOpenStudio: () => void;
}) {
  const progress = useStoryProgress();
  const stories = storiesFor(companion);
  if (!stories.length) return null;
  const states = stories.map((story) => normalize(story, progress.all[story.id]));
  const peak = states.reduce((best, state) => Math.max(best, state.peakAffection), 0);
  const unlocked = states.reduce((sum, state) => sum + state.unlocked.length, 0);
  const total = stories.reduce((sum, story) => sum + story.unlocks.length, 0);
  const endings = states.reduce((sum, state) => sum + state.endings.length, 0);
  return (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-zinc-300">Story bond</p>
        <span className="text-[10px] font-bold text-pink-300">{progress.ready ? `Best ${peak}/10` : ""}</span>
      </div>
      <p className="text-[11px] text-zinc-400">{unlocked} of {total} unlocks · {endings} endings</p>
      <button type="button" onClick={onOpenStudio} className="text-[11px] font-bold text-pink-300">
        Open her stories
      </button>
    </div>
  );
}
