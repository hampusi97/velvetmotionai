'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Download,
  Share2,
  Check,
  Columns,
  Sparkles,
  Copy,
  Heart,
  Film,
} from 'lucide-react';
import { GenerationResult } from '@/types';
import confetti from 'canvas-confetti';

interface VideoPlayerProps {
  result: GenerationResult;
  onNewGeneration?: () => void;
}

export function VideoPlayer({ result, onNewGeneration }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#d946ef', '#a855f7', '#fbbf24'],
      });
    } catch {}
  }, []);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = result.videoUrl;
    a.download = `velvetmotion-${result.companionName || 'clip'}-${result.id.slice(-6)}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const aspectClass =
    result.aspectRatio === '9:16'
      ? 'aspect-[9/16] max-h-[540px]'
      : result.aspectRatio === '1:1'
      ? 'aspect-square max-h-[480px]'
      : 'aspect-video max-h-[440px]';

  return (
    <div className="rounded-3xl border border-pink-500/20 bg-zinc-950/90 p-4 sm:p-6 shadow-2xl space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-500/20 border border-pink-500/40">
            <Sparkles className="h-4 w-4 text-pink-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {result.companionName ? `${result.companionName}'s Motion Clip` : 'AI Companion Motion Clip'}
              <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-300">
                {result.aspectRatio} • {result.duration}s
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Engine: <span className="text-pink-300 font-semibold capitalize">{result.engineUsed}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              showComparison
                ? 'border-pink-500 bg-pink-500/20 text-white'
                : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white'
            }`}
          >
            <Columns className="h-3.5 w-3.5 text-pink-400" />
            <span>{showComparison ? 'Video Only' : 'Compare Still'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport / Comparison Split */}
      <div className="relative overflow-hidden rounded-2xl bg-black border border-white/10 flex items-center justify-center">
        {showComparison ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-2 p-2 bg-zinc-950">
            <div className="flex flex-col items-center justify-center rounded-xl bg-black p-2 border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Original Still Photo
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.sourceImageUrl}
                alt="Source photo"
                className={`w-full object-contain rounded-lg ${aspectClass}`}
              />
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl bg-black p-2 border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 mb-1">
                VelvetMotion Video
              </span>
              <video
                ref={videoRef}
                src={result.videoUrl}
                autoPlay
                playsInline
                loop={isLooping}
                controls
                className={`w-full object-contain rounded-lg ${aspectClass}`}
              />
            </div>
          </div>
        ) : (
          <div className="relative w-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={result.videoUrl}
              autoPlay
              playsInline
              loop={isLooping}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className={`w-full object-contain ${aspectClass}`}
            />
          </div>
        )}
      </div>

      {/* Prompt Caption Box */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Motion Prompt
        </div>
        <p className="text-xs text-zinc-200 leading-relaxed italic">
          &ldquo;{result.prompt}&rdquo;
        </p>
      </div>

      {/* Primary Actions: Download & Create Another */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-pink-950/60 hover:brightness-110 transition cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Download Video (.mp4)</span>
        </button>

        {onNewGeneration && (
          <button
            type="button"
            onClick={onNewGeneration}
            className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-zinc-300 hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
          >
            Animate Another
          </button>
        )}
      </div>
    </div>
  );
}
