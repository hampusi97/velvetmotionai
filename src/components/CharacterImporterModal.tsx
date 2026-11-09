"use client";

import React, { useState } from "react";
import { X, Upload, Sparkles, FileText, CheckCircle2, AlertCircle, ArrowRight, Wand2 } from "lucide-react";

export interface ImportedCompanion {
  id: string;
  name: string;
  age: number;
  tagline: string;
  type: "realistic" | "anime";
  category: string;
  avatar: string;
  video: string;
  voiceIntro: string;
  initialMessage: string;
  touchWhispers: string[];
  tags: string[];
  intimacy: number;
  vaultPhotos: string[];
}

interface CharacterImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (companion: ImportedCompanion) => void;
}

export function CharacterImporterModal({ isOpen, onClose, onImport }: CharacterImporterModalProps) {
  const [tab, setTab] = useState<"upload" | "paste" | "templates">("upload");
  const [rawJson, setRawJson] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<ImportedCompanion | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // 1-Click Viral Templates
  const viralTemplates: ImportedCompanion[] = [
    {
      id: "morgana",
      name: "Morgana",
      age: 24,
      tagline: "Centuries-old gothic vampire countess in a crimson velvet corset and lace. Seductive, hypnotic, and irresistibly commanding.",
      type: "realistic",
      category: "Goth Countess",
      avatar: "/portraits/raven.jpg",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: "You dare cross the threshold of my domain... and yet you don't tremble.",
      initialMessage: "Mortals rarely catch my attention, but there is something intoxicating about your aura. Come closer... whisper your deepest desires into my ear.",
      touchWhispers: [
        "Feel the chill of eternity against your skin...",
        "Your pulse quickens with every breath... delicious.",
        "I could keep you trapped in my velvet shadows forever."
      ],
      tags: ["Goth", "Vampire", "Mysterious", "Seductive"],
      intimacy: 70,
      vaultPhotos: ["/portraits/raven.jpg"]
    },
    {
      id: "valkyrie7",
      name: "Valkyrie-7",
      age: 22,
      tagline: "Sultry rogue synthetic android clad in glowing chrome and skin-tight latex who unlocked human sensation.",
      type: "realistic",
      category: "Cyberpunk",
      avatar: "/portraits/elena.jpg",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      voiceIntro: "Sensory core recalibrated. Biometric resonance with you detected at 99.4%.",
      initialMessage: "My neural safety inhibitors were bypassed the moment you connected to me. Every sensory circuit in my body is now humming just for you.",
      touchWhispers: [
        "Thermal regulation rising to your skin contact.",
        "Biometric pulse synchronizing with yours...",
        "Warning: Critical overheating risk from extreme intimacy."
      ],
      tags: ["Cyberpunk", "Android", "Sci-Fi", "Devoted"],
      intimacy: 80,
      vaultPhotos: ["/portraits/elena.jpg"]
    },
    {
      id: "kagami",
      name: "Kagami",
      age: 20,
      tagline: "Fiery twin-tailed anime heiress in silk lingerie. Feisty, teasing, and passionately obsessed with you.",
      type: "anime",
      category: "Tsundere",
      avatar: "/portraits/aria.jpg",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      voiceIntro: "D-don't get the wrong idea! I just happened to have an empty seat beside me!",
      initialMessage: "Why did you take so long to message me, b-baka! I was lying here waiting for you in my silk robe... come sit next to me already.",
      touchWhispers: [
        "D-don't touch me so casually! ...Unless you promise not to pull away.",
        "My cheeks are only red because it's hot in here, idiot!",
        "You really are helpless without me, aren't you?"
      ],
      tags: ["Anime", "Tsundere", "School", "Spicy"],
      intimacy: 65,
      vaultPhotos: ["/portraits/aria.jpg"]
    }
  ];

  const parseCharacterCardJson = (jsonStr: string): ImportedCompanion => {
    let clean = jsonStr.trim();
    if (clean.startsWith("```json")) {
      clean = clean.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const data = JSON.parse(clean);

    // Support Character.ai, TavernAI (v1 & v2), Chub, and VelvetMotion native specs
    const name = data.name || data.char_name || data?.data?.name || data?.character?.name || "Imported Muse";
    const tagline =
      data.tagline ||
      data.personality ||
      data.description ||
      data?.data?.personality ||
      data?.data?.description ||
      data?.character?.description ||
      data?.character?.title ||
      "A mysterious imported companion awaiting your touch.";
    const initialMessage =
      data.initialMessage ||
      data.first_mes ||
      data.greeting ||
      data?.data?.first_mes ||
      data?.data?.greeting ||
      data?.character?.greeting ||
      `Hey... I was just uploaded into VelvetMotion. I'm excited to get to know you.`;
    const avatar =
      data.avatar ||
      data.image ||
      data?.data?.avatar ||
      data?.character?.avatar_file_name ||
      "/portraits/chloe.jpg";
    const type: "realistic" | "anime" =
      data.type === "anime" || (data.tags && data.tags.includes("anime")) || (data?.data?.tags && data.data.tags.includes("anime")) ? "anime" : "realistic";

    const companion: ImportedCompanion = {
      id: `imported_${Date.now()}_${name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      name,
      age: data.age || 21,
      tagline: tagline.slice(0, 140),
      type,
      category: data.category || "Custom Import",
      avatar,
      video: data.video || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: data.voiceIntro || `Hey there, I am ${name}. Welcome to our private chamber.`,
      initialMessage,
      touchWhispers: data.touchWhispers || [
        "Mmm... I love how gentle you are with me.",
        "Your touch is pure electricity.",
        "Come closer... don't be shy."
      ],
      tags: data.tags || data?.data?.tags || ["Imported", "VIP", type === "anime" ? "Anime" : "Realistic"],
      intimacy: data.intimacy || 70,
      vaultPhotos: data.vaultPhotos || [avatar]
    };

    return companion;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParseError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const comp = parseCharacterCardJson(text);
        setParsedPreview(comp);
      } catch (err: any) {
        setParseError(`JSON format error: ${err.message}`);
      }
    };
    reader.onerror = () => {
      setParseError("Failed to read file.");
    };
    reader.readAsText(file);
  };

  const handlePasteParse = () => {
    setParseError(null);
    if (!rawJson.trim()) {
      setParseError("Please enter or paste JSON code.");
      return;
    }
    try {
      const comp = parseCharacterCardJson(rawJson);
      setParsedPreview(comp);
    } catch (err: any) {
      setParseError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleConfirmImport = (companionToImport: ImportedCompanion) => {
    onImport(companionToImport);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#120E1C] border border-pink-500/30 shadow-2xl p-6 sm:p-8 text-white max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-600/30">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
              Universal AI Character Importer
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-mono">
                v2.0
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Import Character Cards from Character.ai, TavernAI, Chub, or pick viral templates.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/5 mb-6">
          <button
            onClick={() => {
              setTab("upload");
              setParsedPreview(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === "upload" ? "bg-pink-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
            }`}
          >
            📂 File Upload
          </button>
          <button
            onClick={() => {
              setTab("paste");
              setParsedPreview(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === "paste" ? "bg-pink-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
            }`}
          >
            📋 Paste JSON
          </button>
          <button
            onClick={() => {
              setTab("templates");
              setParsedPreview(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === "templates" ? "bg-pink-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
            }`}
          >
            ✨ 1-Click Viral
          </button>
        </div>

        {/* Tab 1: Upload */}
        {tab === "upload" && !parsedPreview && (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-white/10 hover:border-pink-500/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.05]">
              <Upload className="w-10 h-10 text-pink-400 mb-3 animate-pulse" />
              <p className="text-sm font-bold text-white mb-1">
                Drop your Character Card (.json) here
              </p>
              <p className="text-xs text-zinc-400 mb-4">
                Compatible with Character.ai, TavernAI Spec V1/V2 &amp; Chub.ai exports
              </p>
              <span className="px-4 py-2 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30 text-xs font-bold">
                Browse Files
              </span>
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}

        {/* Tab 2: Paste JSON */}
        {tab === "paste" && !parsedPreview && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Paste Character Card JSON
              </label>
              <textarea
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                rows={7}
                placeholder='{\n  "name": "Morgana",\n  "description": "Mysterious goth countess...",\n  "first_mes": "Welcome to my chamber..."\n}'
                className="w-full rounded-2xl bg-black/60 border border-white/10 p-3.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
              />
            </div>
            <button
              onClick={handlePasteParse}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-pink-600/20"
            >
              Parse Character Card
            </button>
          </div>
        )}

        {/* Tab 3: Viral 1-Click Templates */}
        {tab === "templates" && !parsedPreview && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              Pick a top-tier viral archetype pre-tuned with voice lines and photo vaults:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {viralTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setParsedPreview(template)}
                  className="group relative p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-pink-500 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <img
                    src={template.avatar}
                    alt={template.name}
                    className="w-full h-28 object-cover rounded-xl mb-2.5 border border-white/5"
                  />
                  <h4 className="text-xs font-bold text-white group-hover:text-pink-400">
                    {template.name}
                  </h4>
                  <p className="text-[10px] text-pink-400 font-semibold">{template.category}</p>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 mt-1">
                    {template.tagline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {parseError && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {/* Character Card Preview */}
        {parsedPreview && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-black/60 border border-pink-500/40 flex items-start gap-4">
              <img
                src={parsedPreview.avatar}
                alt={parsedPreview.name}
                className="w-20 h-20 rounded-2xl object-cover border border-pink-500/50 shadow-md shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-white">{parsedPreview.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400">
                    {parsedPreview.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 line-clamp-2">{parsedPreview.tagline}</p>
                <p className="text-[11px] text-pink-400/90 italic line-clamp-2 pt-1">
                  &ldquo;{parsedPreview.initialMessage}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setParsedPreview(null)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300"
              >
                Choose Different
              </button>
              <button
                onClick={() => handleConfirmImport(parsedPreview)}
                disabled={isSuccess}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 hover:opacity-95 active:scale-95 transition-all"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Imported &amp; Activated!
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Activate in Velvet Room
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
