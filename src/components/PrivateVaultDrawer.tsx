'use client';

import React from 'react';
import { X, Play, Download, Trash2, Lock, Film, Sparkles, Heart } from 'lucide-react';
import { HistoryItem } from '@/types';

interface PrivateVaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vaultItems: HistoryItem[];
  onSelectVideo: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export function PrivateVaultDrawer({
  isOpen,
  onClose,
  vaultItems,
  onSelectVideo,
  onDeleteItem,
  onClearAll,
}: PrivateVaultDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0c0a12] p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-pink-400" />
            <h3 className="text-base font-bold text-white">
              Private Motion Vault ({vaultItems.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {vaultItems.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-zinc-500 hover:text-rose-400 transition cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Vault List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {vaultItems.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Lock className="mx-auto h-8 w-8 text-zinc-700" />
              <p className="text-sm font-semibold text-zinc-400">Vault is empty</p>
              <p className="text-xs text-zinc-600 max-w-xs mx-auto">
                Generate motion video clips of your companions to build your local private collection!
              </p>
            </div>
          ) : (
            vaultItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 hover:border-pink-500/40 hover:bg-pink-950/15 transition space-y-2.5"
              >
                <div className="flex gap-3">
                  <div
                    onClick={() => {
                      onSelectVideo(item);
                      onClose();
                    }}
                    className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-black border border-white/10 cursor-pointer group-hover:scale-105 transition"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.sourceImageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-600 text-white shadow">
                        <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    {item.companionName && (
                      <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">
                        {item.companionName}
                      </span>
                    )}
                    <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed">
                      &ldquo;{item.prompt}&rdquo;
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-semibold text-pink-300">
                        {item.aspectRatio}
                      </span>
                      <span>•</span>
                      <span>{item.duration}s</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                  <span className="text-[10px] text-zinc-500">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={item.videoUrl}
                      download={`velvetmotion-${item.id.slice(-6)}.mp4`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-zinc-400 hover:text-white transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Download</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="rounded-lg p-1 text-zinc-500 hover:text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
