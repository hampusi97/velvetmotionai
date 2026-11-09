'use client';

import React from 'react';
import {
  Sparkles,
  Sliders,
  Ratio,
  Clock,
  Compass,
  Wand2,
  Smartphone,
  Tv,
  Square,
  Flame,
} from 'lucide-react';
import { AspectRatio, MotionIntensity, DurationSeconds } from '@/types';
import { CANDY_MOTION_CHIPS } from '@/data/candyPresets';

interface MotionPromptControlsProps {
  prompt: string;
  onChangePrompt: (val: string) => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (val: AspectRatio) => void;
  intensity: MotionIntensity;
  onChangeIntensity: (val: MotionIntensity) => void;
  duration: DurationSeconds;
  onChangeDuration: (val: DurationSeconds) => void;
  enhancePrompt: boolean;
  onToggleEnhance: () => void;
  disabled?: boolean;
}

export function MotionPromptControls({
  prompt,
  onChangePrompt,
  aspectRatio,
  onChangeAspectRatio,
  intensity,
  onChangeIntensity,
  duration,
  onChangeDuration,
  enhancePrompt,
  onToggleEnhance,
  disabled = false,
}: MotionPromptControlsProps) {
  const handleSelectChip = (chipPrompt: string) => {
    if (disabled) return;
    if (!prompt.trim()) {
      onChangePrompt(chipPrompt);
    } else {
      onChangePrompt(`${prompt.trim()}, ${chipPrompt}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* 2. Motion Prompt Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-pink-400" />
            <span>2. Describe Motion & Actions</span>
          </label>
          <span className="text-[11px] text-zinc-500">{prompt.length} chars</span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          disabled={disabled}
          placeholder="Describe how your companion should move, smile, turn, or breathe… (e.g., Soft seductive smile, eyes looking gently into camera, hair moves with breeze, sensual 60fps cinematic)"
          rows={3}
          className="w-full resize-none rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-pink-500/60 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:opacity-50 transition"
        />

        {/* Quick Candy.ai Style Chips */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-pink-400" />
              <span>Motion Inspiration Chips:</span>
            </span>
            <span className="text-[10px] text-zinc-500">Tap to append</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CANDY_MOTION_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleSelectChip(chip.prompt)}
                disabled={disabled}
                className="group flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium text-zinc-300 hover:border-pink-500/50 hover:bg-pink-950/30 hover:text-pink-200 transition disabled:opacity-50 cursor-pointer"
              >
                <span>{chip.emoji}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Candy.ai Controls: Format, Intensity, Duration */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <Sliders className="h-4 w-4 text-fuchsia-400" />
          <span>3. Video Dimensions & Dynamics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Aspect Ratio */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 flex items-center gap-1">
              <Ratio className="h-3.5 w-3.5 text-pink-400" />
              Format
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-black/40 p-1 border border-white/5">
              <button
                type="button"
                onClick={() => onChangeAspectRatio('9:16')}
                disabled={disabled}
                className={`flex flex-col items-center justify-center rounded-lg py-1.5 text-[10px] font-bold transition cursor-pointer ${
                  aspectRatio === '9:16'
                    ? 'bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5 mb-0.5" />
                <span>9:16 Reel</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeAspectRatio('16:9')}
                disabled={disabled}
                className={`flex flex-col items-center justify-center rounded-lg py-1.5 text-[10px] font-bold transition cursor-pointer ${
                  aspectRatio === '16:9'
                    ? 'bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Tv className="h-3.5 w-3.5 mb-0.5" />
                <span>16:9 Wide</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeAspectRatio('1:1')}
                disabled={disabled}
                className={`flex flex-col items-center justify-center rounded-lg py-1.5 text-[10px] font-bold transition cursor-pointer ${
                  aspectRatio === '1:1'
                    ? 'bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Square className="h-3.5 w-3.5 mb-0.5" />
                <span>1:1 Post</span>
              </button>
            </div>
          </div>

          {/* Intensity */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
              Dynamics Flow
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-black/40 p-1 border border-white/5">
              {(['subtle', 'sensual', 'dynamic'] as MotionIntensity[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => onChangeIntensity(level)}
                  disabled={disabled}
                  className={`rounded-lg py-2 text-[10px] font-bold capitalize transition cursor-pointer ${
                    intensity === level
                      ? 'bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-pink-400" />
              Duration
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-black/40 p-1 border border-white/5">
              {([2, 4, 6] as DurationSeconds[]).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onChangeDuration(sec)}
                  disabled={disabled}
                  className={`rounded-lg py-2 text-[10px] font-bold transition cursor-pointer ${
                    duration === sec
                      ? 'bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {sec}s Loop
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Auto-enrich toggle */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={enhancePrompt}
              onChange={onToggleEnhance}
              disabled={disabled}
              className="rounded border-zinc-700 bg-zinc-800 text-pink-500 focus:ring-pink-500/30"
            />
            <span className="flex items-center gap-1">
              <Wand2 className="h-3.5 w-3.5 text-pink-400" />
              <span>Auto-Enrich Motion Prompt (Cinematic Lighting & Depth Keywords)</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
