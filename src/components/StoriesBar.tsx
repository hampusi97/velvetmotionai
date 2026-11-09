'use client';

import React, { useState } from 'react';
import { CANDY_COMPANIONS } from '@/data/candyPresets';
import { CompanionPreset } from '@/types';
import { Play, Sparkles, X, Heart } from 'lucide-react';

interface StoriesBarProps {
  onSelectCompanion: (comp: CompanionPreset) => void;
  activeCompanionId?: string;
}

export function StoriesBar({ onSelectCompanion, activeCompanionId }: StoriesBarProps) {
  const [activeStory, setActiveStory] = useState<CompanionPreset | null>(null);

  return (
    <>
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-pink-400" />
            <span>Featured Companion Stories</span>
          </span>
          <span className="text-[11px] text-zinc-500">Tap to preview motion look</span>
        </div>

        {/* Stories Horizontal Strip */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {CANDY_COMPANIONS.map((comp) => {
            const isSelected = activeCompanionId === comp.id;

            return (
              <button
                key={comp.id}
                type="button"
                onClick={() => setActiveStory(comp)}
                className="group flex flex-col items-center gap-1.5 shrink-0 cursor-pointer focus:outline-none"
              >
                {/* Glowing Candy.ai Neon Ring */}
                <div
                  className={`relative p-0.5 rounded-full transition-transform duration-300 group-hover:scale-105 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-amber-400 shadow-lg shadow-pink-500/40 ring-2 ring-pink-400/50'
                      : 'bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-violet-600 hover:shadow-md hover:shadow-pink-500/30'
                  }`}
                >
                  <div className="p-0.5 bg-[#08070c] rounded-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={comp.avatarUrl}
                      alt={comp.name}
                      className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover"
                    />
                  </div>

                  {/* Play badge */}
                  <div className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-white shadow">
                    <Play className="h-2.5 w-2.5 fill-white ml-0.5" />
                  </div>
                </div>

                <div className="text-center">
                  <div className={`text-xs font-bold truncate max-w-[70px] ${isSelected ? 'text-pink-300' : 'text-zinc-200'}`}>
                    {comp.name}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500">
                    {comp.style}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Story Video Preview Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-pink-500/30 bg-zinc-950 p-4 shadow-2xl text-white space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeStory.avatarUrl}
                  alt={activeStory.name}
                  className="h-8 w-8 rounded-full object-cover border border-pink-500"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{activeStory.name}</h4>
                  <p className="text-[10px] text-pink-300">{activeStory.tagline}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="rounded-lg p-1 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player in Story Modal */}
            <div className="relative aspect-[9/16] max-h-[440px] w-full overflow-hidden rounded-2xl bg-black border border-white/10 flex items-center justify-center">
              <video
                src={activeStory.videoPreviewUrl}
                autoPlay
                playsInline
                loop
                controls
                className="h-full w-full object-cover"
              />
            </div>

            {/* Prompt description */}
            <p className="text-xs text-zinc-300 italic bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
              &ldquo;{activeStory.suggestedPrompt}&rdquo;
            </p>

            {/* Use look button */}
            <button
              type="button"
              onClick={() => {
                onSelectCompanion(activeStory);
                setActiveStory(null);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 py-3 text-xs font-bold text-white shadow-xl shadow-pink-900/40 hover:brightness-110 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Use {activeStory.name}&apos;s Look & Motion Prompt</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
