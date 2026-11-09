"use client";

import React, { useState, useEffect } from "react";
import { Smartphone, Monitor, Download, Share, PlusSquare, Check, X, Apple } from "lucide-react";

export function InstallAppModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [device, setDevice] = useState<"ios" | "android" | "desktop">("desktop");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      if (/iPhone|iPad|iPod/i.test(ua)) {
        setDevice("ios");
      } else if (/Android/i.test(ua)) {
        setDevice("android");
      } else {
        setDevice("desktop");
      }

      window.addEventListener("beforeinstallprompt", (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      });
    }
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
        onClose();
      }
    } else {
      alert("Follow the on-screen steps below to add VelvetMotion to your home screen or desktop!");
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-[#120E1C] border border-pink-500/40 p-6 sm:p-8 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30">
          <Smartphone className="w-7 h-7 text-white" />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
          Install VelvetMotion App
        </h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
          Get the full-screen native experience on your iPhone, iPad, Mac, or Android device.
        </p>

        {/* Device Switcher */}
        <div className="grid grid-cols-3 gap-2 my-5 p-1 rounded-xl bg-black/50 border border-white/10">
          <button
            onClick={() => setDevice("ios")}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              device === "ios" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            iPhone / iPad
          </button>
          <button
            onClick={() => setDevice("android")}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              device === "android" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Android
          </button>
          <button
            onClick={() => setDevice("desktop")}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              device === "desktop" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Mac / PC
          </button>
        </div>

        {/* Instructions by Device */}
        {device === "ios" && (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-3">
            <p className="text-xs font-bold text-pink-400">How to install on iOS Safari:</p>
            <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside">
              <li>Tap the <strong className="text-white">Share</strong> icon at the bottom of Safari.</li>
              <li>Scroll down and select <strong className="text-white">Add to Home Screen</strong>.</li>
              <li>Tap <strong className="text-white">Add</strong> in the top-right corner.</li>
            </ol>
            <p className="text-[10px] text-zinc-400 italic">Launches as a standalone app with no browser URL bar!</p>
          </div>
        )}

        {device === "android" && (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-3">
            <p className="text-xs font-bold text-emerald-400">Instant Android Installation:</p>
            <p className="text-xs text-zinc-300">
              Click the button below to install VelvetMotion as an APK-equivalent PWA directly onto your Android device.
            </p>
            <button
              onClick={handleNativeInstall}
              className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase shadow-lg flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Install on Android
            </button>
          </div>
        )}

        {device === "desktop" && (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-3">
            <p className="text-xs font-bold text-purple-400">Desktop (Mac &amp; Windows):</p>
            <p className="text-xs text-zinc-300">
              In Chrome, Edge, or Safari, click the <strong className="text-white">Install</strong> icon in the address bar to add VelvetMotion to your Applications folder or Dock.
            </p>
            <button
              onClick={handleNativeInstall}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs uppercase shadow-lg flex items-center justify-center gap-2"
            >
              <Monitor className="w-4 h-4" /> Add to Desktop / Dock
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
