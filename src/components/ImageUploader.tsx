'use client';

import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, AlertCircle, Sparkles, Heart } from 'lucide-react';
import { CANDY_COMPANIONS } from '@/data/candyPresets';
import { CompanionPreset } from '@/types';

interface ImageUploaderProps {
  imageSrc: string | null;
  onImageSelected: (dataUrl: string, companionName?: string) => void;
  onClear: () => void;
  onSelectCompanionPrompt?: (prompt: string, aspect?: '9:16' | '16:9' | '1:1') => void;
}

export function ImageUploader({
  imageSrc,
  onImageSelected,
  onClear,
  onSelectCompanionPrompt,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setErrorMsg(null);

      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please upload a valid image (PNG, JPG, or WEBP).');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('File size exceeds 10MB limit. Please choose a smaller photo.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) onImageSelected(result);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleSelectCompanion = (comp: CompanionPreset) => {
    setErrorMsg(null);
    onImageSelected(comp.avatarUrl, comp.name);
    onSelectCompanionPrompt?.(comp.suggestedPrompt, comp.aspectRatio);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <ImageIcon className="h-4 w-4 text-pink-400" />
          <span>1. Upload Photo or Pick Companion</span>
        </label>
        {imageSrc && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-pink-400 transition cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        className="hidden"
      />

      {/* Upload Zone / Active Preview */}
      {!imageSrc ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition cursor-pointer ${
            isDragging
              ? 'border-pink-500 bg-pink-950/30'
              : 'border-white/10 bg-white/[0.02] hover:border-pink-500/40 hover:bg-pink-950/15'
          }`}
        >
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-950/60 to-purple-950/60 border border-pink-500/30 group-hover:scale-105 group-hover:border-pink-500/60 transition">
            <UploadCloud className="h-7 w-7 text-pink-400" />
          </div>
          <h3 className="text-sm font-bold text-white">
            Drop your photo here or <span className="text-pink-400 underline underline-offset-2">browse</span>
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Works with any portrait, full-body photo, or AI character art (PNG, JPG, WEBP)
          </p>
        </div>
      ) : (
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 p-2 shadow-2xl">
          <div className="relative aspect-[9/16] max-h-72 w-full overflow-hidden rounded-2xl bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Source preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-white hover:bg-black/90 transition cursor-pointer"
              >
                <RefreshCw className="h-3 w-3 text-pink-400" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={onClear}
                className="flex h-7 w-7 items-center justify-center rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Candy.ai Quick Preset Companions */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-pink-400" />
            <span>Or select a Candy.ai companion model:</span>
          </span>
          <span className="text-[10px] text-zinc-500">Click to load</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CANDY_COMPANIONS.map((comp) => (
            <button
              key={comp.id}
              type="button"
              onClick={() => handleSelectCompanion(comp)}
              className="group flex flex-col items-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2 text-center hover:border-pink-500/50 hover:bg-pink-950/20 transition cursor-pointer"
            >
              <div className="relative mb-1.5 h-12 w-12 rounded-xl overflow-hidden border border-white/10 group-hover:border-pink-400">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={comp.avatarUrl}
                  alt={comp.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition"
                />
              </div>
              <span className="text-xs font-bold text-white truncate max-w-full group-hover:text-pink-300">
                {comp.name}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                {comp.style}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
