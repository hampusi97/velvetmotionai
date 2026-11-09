"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Camera, Mic, Bell, HardDrive, Check, X, 
  Download, Upload, AlertCircle, Sparkles, FolderLock 
} from "lucide-react";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportMemories: (data: any) => void;
  currentMemories: any;
}

export function PermissionsModal({ isOpen, onClose, onImportMemories, currentMemories }: PermissionsModalProps) {
  const [micGranted, setMicGranted] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);
  const [galleryGranted, setGalleryGranted] = useState(true);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        setNotifGranted(true);
      }
    }
  }, []);

  if (!isOpen) return null;

  // Request Microphone Access
  const requestMic = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicGranted(true);
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (e) {
      alert("Microphone permission was denied in your browser settings.");
    }
  };

  // Request Push Notifications Access
  const requestNotifs = async () => {
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          setNotifGranted(true);
          new Notification("VelvetMotion Connected!", {
            body: "Your companions will now send you check-ins.",
            icon: "/manifest.json"
          });
        }
      }
    } catch (e) {}
  };

  // Export Full Chat Memory & Gallery to JSON File
  const handleExportFile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentMemories, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `velvetmotion_memories_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  // Import Chat Memory File from Computer / Phone
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          onImportMemories(parsed);
          alert("🎉 Memories successfully imported! Companions remember everything.");
          onClose();
        } catch (err) {
          alert("Invalid memory file format. Please upload a valid .json file.");
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#120E1C] border border-pink-500/40 p-6 sm:p-8 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 mx-auto flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
          Device Permissions &amp; Memory Files
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Enable permissions to send photos from your gallery, use voice calls, and backup memories to files.
        </p>

        {/* Permissions Toggles List */}
        <div className="my-5 space-y-2.5 text-left">
          
          {/* Gallery Permission */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Gallery &amp; Photos Access</p>
                <p className="text-[10px] text-zinc-400">Send photos from your camera roll into the chat.</p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> Enabled
            </span>
          </div>

          {/* Microphone Permission */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Microphone Voice Input</p>
                <p className="text-[10px] text-zinc-400">Talk to companions out loud during calls.</p>
              </div>
            </div>
            {micGranted ? (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Enabled
              </span>
            ) : (
              <button
                onClick={requestMic}
                className="text-[11px] px-3 py-1 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold"
              >
                Allow
              </button>
            )}
          </div>

          {/* Push Notifications */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Push Notifications</p>
                <p className="text-[10px] text-zinc-400">Get messages when companions wake up.</p>
              </div>
            </div>
            {notifGranted ? (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Enabled
              </span>
            ) : (
              <button
                onClick={requestNotifs}
                className="text-[11px] px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-black font-bold"
              >
                Enable
              </button>
            )}
          </div>
        </div>

        {/* File Memory Backup & Restore Section */}
        <div className="pt-4 border-t border-white/10 text-left space-y-3">
          <p className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-pink-400" /> Backup or Restore Chat Memory Files
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Export File Button */}
            <button
              onClick={handleExportFile}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-pink-500" />
              {exportSuccess ? "Exported!" : "Export File (.json)"}
            </button>

            {/* Import File Button */}
            <label className="py-2.5 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-xs font-bold text-pink-400 flex items-center justify-center gap-2 cursor-pointer transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Import File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-[10px] text-zinc-500">
            Exporting downloads a file with all your conversations and unlocked photos so you never lose them.
          </p>
        </div>

      </div>
    </div>
  );
}
