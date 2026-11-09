'use client';

import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Check, Trash2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}: ApiKeyModalProps) {
  const [val, setVal] = useState(apiKey);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(val.trim());
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setVal('');
    onSaveKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-pink-500/30 bg-[#0c0a12] p-6 shadow-2xl text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-pink-400" />
            <h3 className="text-base font-bold text-white">Hugging Face API Key (Optional)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          VelvetMotion AI generates videos 100% free with the built-in fast canvas synthesizer. You can optionally connect your Hugging Face Token to stream directly from cloud GPU models like <strong className="text-pink-300">CogVideoX-5B</strong>.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">
            Hugging Face Access Token (<code className="text-pink-400">hf_...</code>)
          </label>
          <input
            type="password"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxx"
            className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
          />
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-white/[0.02] border border-white/5 p-3 text-[11px] text-zinc-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Stored strictly in your local browser&apos;s <code className="text-zinc-300">localStorage</code>. Never sent to any third-party analytics.
          </span>
        </div>

        <a
          href="https://huggingface.co/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 underline underline-offset-2"
        >
          <span>Get a free token on Hugging Face</span>
          <ExternalLink className="h-3 w-3" />
        </a>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-600 py-2.5 text-xs font-bold text-white hover:brightness-110 transition cursor-pointer"
          >
            {savedToast ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Token</span>
            )}
          </button>

          {val && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
