'use client';

import React from 'react';
import { Loader2, Sparkles, CheckCircle2, Clock, XCircle, Heart } from 'lucide-react';
import { GenerationProgressState } from '@/types';

interface GenerationProgressProps {
  progressState: GenerationProgressState;
  onCancel?: () => void;
}

const PHASES = [
  { id: 'analyzing', label: '1. Facial Depth & Geometry', minPct: 0, maxPct: 25 },
  { id: 'flow', label: '2. Soft Motion & Fluid Vectors', minPct: 25, maxPct: 55 },
  { id: 'rendering', label: '3. 60fps Frame Synthesis', minPct: 55, maxPct: 85 },
  { id: 'encoding', label: '4. Finalizing HD MP4', minPct: 85, maxPct: 100 },
];

export function GenerationProgress({
  progressState,
  onCancel,
}: GenerationProgressProps) {
  const { progress, phaseDescription, elapsedSeconds } = progressState;

  return (
    <div className="rounded-3xl border border-pink-500/30 bg-gradient-to-b from-pink-950/20 via-zinc-950 to-black p-6 shadow-2xl shadow-pink-950/40 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/20 border border-pink-500/40">
            <Loader2 className="h-5 w-5 text-pink-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Synthesizing Companion Motion…
              <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-300">
                {progress}%
              </span>
            </h3>
            <p className="text-xs text-zinc-400">{phaseDescription}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-400">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span>{elapsedSeconds}s</span>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-zinc-500 hover:text-pink-400 transition cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Glowing Neon Candy.ai Progress Bar */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-zinc-900 border border-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-400 transition-all duration-300 shadow-lg shadow-pink-500/50"
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>

      {/* Multi-Phase Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PHASES.map((p, idx) => {
          const isDone = progress >= p.maxPct;
          const isCurrent = progress >= p.minPct && progress < p.maxPct;

          return (
            <div
              key={p.id}
              className={`rounded-xl border p-2.5 text-left transition ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : isCurrent
                  ? 'border-pink-500/50 bg-pink-500/15 text-pink-200 shadow-sm'
                  : 'border-white/5 bg-white/[0.02] text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Phase {idx + 1}
                </span>
                {isDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="h-3.5 w-3.5 text-pink-400 animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                )}
              </div>
              <div className="text-xs font-semibold truncate">{p.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
