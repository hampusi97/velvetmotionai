"use client";

import React, { useState, useRef, useEffect } from "react";
import { VIPModal, CryptoAdBanner } from "../components/Monetization";
import { Upload, Sparkles, Play, Download, Wand2, RefreshCw, Zap, Film, Eye, Volume2, Heart } from "lucide-react";

export default function Home() {
  // Intro Kiss Overlay State
  const [showIntro, setShowIntro] = useState(true);
  const [isVIPOpen, setIsVIPOpen] = useState(false);
  const [kissTriggered, setKissTriggered] = useState(false);
  const [kissImpact, setKissImpact] = useState(false);

  // App Studio State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [motionIntensity, setMotionIntensity] = useState(70);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetVibes = [
    "✨ Gentle Smile & Wink",
    "🌪️ Slow Motion Wind Blowing Hair",
    "🎥 360 Cinematic Orbit",
    "⚡ Cyberpunk Neon Reflections",
    "💋 Lips Parting & Soft Gaze",
    "🔥 Hyper-Realistic Camera Push-In"
  ];

  // Browser Sound Synthesizer (Smooch & Welcome Voice)
  const playKissAndWelcomeAudio = () => {
    try {
      // 1. Synthesize a cute kiss/pop sound via Web Audio API
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      }

      // 2. Synthesize AI voice: "Welcome to Velvet Motion"
      if ("speechSynthesis" in window) {
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance("Welcome to Velvet Motion");
          utterance.rate = 0.9;
          utterance.pitch = 1.2;
          const voices = window.speechSynthesis.getVoices();
          // Pick a gentle female voice if available
          const femaleVoice = voices.find(
            (v) => v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Google UK English Female")
          );
          if (femaleVoice) utterance.voice = femaleVoice;
          window.speechSynthesis.speak(utterance);
        }, 350);
      }
    } catch (e) {
      console.log("Audio autoplay bypassed", e);
    }
  };

  // Trigger the Kiss Animation Sequence
  const handleEnterExperience = () => {
    setKissTriggered(true);

    // Impact timing
    setTimeout(() => {
      setKissImpact(true);
      playKissAndWelcomeAudio();
    }, 450);

    // Fade out overlay into main dashboard
    setTimeout(() => {
      setShowIntro(false);
    }, 2400);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setVideoUrl(null);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a motion prompt or click a vibe chip!");
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);

    const steps = [
      "Analyzing facial vectors & lighting...",
      "Simulating prompt physics...",
      "Generating neural motion frames...",
      "Polishing 60fps MP4 video..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setStatusMessage(steps[i]);
      await new Promise((r) => setTimeout(r, 550));
    }

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      if (selectedFile) formData.append("file", selectedFile);

      const res = await fetch("/api/generate-video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      }
    } catch (err) {
      console.error(err);
      alert("Generation failed, please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090D] text-white relative overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* 💋 INTERACTIVE WELCOME KISS OVERLAY                            */}
      {/* ============================================================== */}
      {showIntro && (
        <div
          onClick={handleEnterExperience}
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-1000 select-none ${
            kissImpact ? "bg-black/85 backdrop-blur-3xl" : "bg-black/95 backdrop-blur-2xl"
          }`}
        >
          {/* Ambient Glows */}
          <div className="absolute h-96 w-96 rounded-full bg-neonPink/25 blur-[150px] pointer-events-none" />
          <div className="absolute h-96 w-96 rounded-full bg-neonPurple/20 blur-[160px] pointer-events-none" />

          {!kissTriggered ? (
            /* Tap to Enter Prompt */
            <div className="text-center z-10 px-6 animate-pulse flex flex-col items-center gap-5">
              <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-neonPink via-neonFuchsia to-neonPurple shadow-2xl shadow-neonPink/50">
                <div className="w-full h-full rounded-full bg-[#09090D] flex items-center justify-center">
                  <Heart className="w-10 h-10 text-neonPink animate-bounce" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  VELVET<span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-neonPurple">MOTION</span>
                </h2>
                <p className="text-sm text-zinc-400 mt-2 tracking-widest uppercase font-medium">
                  Tap anywhere to enter
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300">
                <Volume2 className="w-3.5 h-3.5 text-neonPink" />
                <span>Turn sound on for intro</span>
              </div>
            </div>
          ) : (
            /* The Kiss Sequence */
            <div className="relative flex flex-col items-center justify-center z-20">
              {/* Kiss Lip Mark Stamped on Glass */}
              <div
                className={`transition-all duration-300 transform flex flex-col items-center ${
                  kissImpact
                    ? "scale-100 opacity-100 rotate-[-8deg]"
                    : "scale-150 opacity-0 rotate-0"
                }`}
              >
                {/* SVG Glowing Lipstick Kiss Mark */}
                <svg
                  viewBox="0 0 100 70"
                  className="w-48 sm:w-60 h-auto filter drop-shadow-[0_0_35px_#FF007F] text-neonPink fill-current"
                >
                  <path d="M50 15 C40 5, 20 5, 10 20 C18 24, 30 22, 50 30 C70 22, 82 24, 90 20 C80 5, 60 5, 50 15 Z" />
                  <path d="M10 28 C25 35, 38 33, 50 38 C62 33, 75 35, 90 28 C75 55, 65 65, 50 60 C35 65, 25 55, 10 28 Z" />
                </svg>

                {/* Neon Shockwave Ripple */}
                <div className="absolute inset-0 rounded-full border-2 border-neonPink/60 animate-ping pointer-events-none" />

                {/* Subtitle Message */}
                <div className="mt-8 text-center animate-fade-in">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-neonPink via-neonFuchsia to-white">
                    "Welcome to VelvetMotion"
                  </p>
                  <p className="text-xs text-zinc-400 mt-2 uppercase tracking-widest">
                    Entering AI Studio...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 🚀 MAIN STUDIO NAVIGATION & DASHBOARD                          */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090D]/80 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-neonPink via-neonFuchsia to-neonPurple p-[2px] shadow-lg shadow-neonPink/30">
            <div className="h-full w-full bg-[#09090D] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-neonPink" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              VELVET<span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-neonPurple">MOTION</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">AI Motion Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* VIP Bitcoin Button */}
          <button
            onClick={() => setIsVIPOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-neonPink/20 border border-amber-500/40 text-xs text-amber-300 hover:scale-105 transition-all shadow-lg shadow-amber-500/10 font-bold"
          >
            <span>⚡</span> VIP / Tip (BTC)
          </button>

          {/* Replay Intro Button */}
          <button
            onClick={() => {
              setShowIntro(true);
              setKissTriggered(false);
              setKissImpact(false);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300 hover:border-neonPink transition-all"
          >
            <span>💋</span> Replay Kiss
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-neonPink font-bold">Free Access</span>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-5 py-2 rounded-full font-semibold text-xs tracking-wide bg-gradient-to-r from-neonPink via-neonFuchsia to-neonPurple hover:opacity-90 shadow-lg shadow-neonPink/25 transition-all"
          >
            Create
          </button>
        </div>
      </header>

      {/* Main Studio Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Controls */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 hover:border-neonPurple/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Film className="w-4 h-4 text-neonPink" /> 1. Upload Character or Photo
              </label>
              {imagePreview && (
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedFile(null);
                  }}
                  className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Remove
                </button>
              )}
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl cursor-pointer p-6 flex flex-col items-center justify-center transition-all ${
                imagePreview
                  ? "border-neonPink/50 bg-black/40"
                  : "border-white/15 hover:border-neonPink hover:bg-white/[0.02]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative group w-full flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="max-h-64 rounded-lg object-contain shadow-2xl border border-white/10"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-lg text-xs font-semibold text-white">
                    Click to replace photo
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-neonPurple/20 flex items-center justify-center text-neonFuchsia mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">Click or drag & drop photo here</p>
                  <p className="text-xs text-zinc-400">JPG, PNG, WEBP (Portraits recommended)</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 hover:border-neonPink/40 transition-all">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-3">
              <Wand2 className="w-4 h-4 text-neonPurple" /> 2. Motion Prompt
            </label>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the action... e.g. 'Slow camera tilt up, wind gently blows through hair, subject looks at the camera and smiles subtly.'"
              rows={3}
              className="w-full rounded-xl bg-black/40 border border-white/10 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-neonPink focus:ring-1 focus:ring-neonPink transition-all"
            />

            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Click inspiration vibe tags:
              </p>
              <div className="flex flex-wrap gap-2">
                {presetVibes.map((vibe, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt((prev) => (prev ? `${prev}, ${vibe}` : vibe))}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-zinc-300 hover:text-white hover:border-neonPink hover:bg-neonPink/10 transition-all active:scale-95"
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/10">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2 text-zinc-300">
                  <span>Motion Intensity</span>
                  <span className="text-neonPink">{motionIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={motionIntensity}
                  onChange={(e) => setMotionIntensity(Number(e.target.value))}
                  className="w-full accent-neonPink bg-zinc-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-zinc-300 block mb-2">Aspect Ratio</span>
                <div className="grid grid-cols-3 gap-2">
                  {["9:16", "16:9", "1:1"].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`text-xs py-1.5 rounded-lg border font-medium transition-all ${
                        aspectRatio === ratio
                          ? "bg-neonFuchsia/20 border-neonFuchsia text-white"
                          : "border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
                isGenerating
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-neonPink via-neonFuchsia to-neonPurple hover:opacity-95 shadow-neonPink/30 hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-neonPink" />
                  Generating Motion Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate Video
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Column (5 cols): Preview Studio */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 relative overflow-hidden flex flex-col min-h-[460px]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-neonFuchsia" /> Real-time Video Studio
            </h2>

            <div className="flex-1 rounded-xl bg-black/60 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden p-4">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-neonPink animate-spin" />
                    <Sparkles className="w-7 h-7 text-neonFuchsia absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{statusMessage}</p>
                    <p className="text-xs text-zinc-500 mt-1">Applying prompt motion vectors</p>
                  </div>
                </div>
              ) : videoUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-between">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full max-h-[380px] rounded-lg shadow-2xl object-cover border border-white/10"
                  />
                  <div className="w-full flex items-center justify-between gap-3 mt-4">
                    <a
                      href={videoUrl}
                      download="velvetmotion.mp4"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4 text-neonPink" /> Download MP4
                    </a>
                    <button
                      onClick={handleGenerate}
                      className="py-2.5 px-4 rounded-xl bg-neonPurple/20 hover:bg-neonPurple/30 border border-neonPurple/40 text-xs font-semibold text-neonPurple flex items-center justify-center gap-2 transition-all"
                    >
                      <RefreshCw className="w-4 h-4" /> Re-roll
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/10 mx-auto flex items-center justify-center text-zinc-500">
                    <Play className="w-6 h-6 ml-1 text-zinc-600" />
                  </div>
                  <p className="text-sm font-medium text-zinc-400">Ready to generate</p>
                  <p className="text-xs text-zinc-600 max-w-xs">
                    Upload an image, type how you want it to move, and click Generate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* A-Ads & BTC Support Banner */}
      <CryptoAdBanner />

      {/* VIP Bitcoin Modal */}
      <VIPModal isOpen={isVIPOpen} onClose={() => setIsVIPOpen(false)} />
    </div>
  );
}
