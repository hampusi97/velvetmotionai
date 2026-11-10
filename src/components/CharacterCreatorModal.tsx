"use client";

import React, { useState, useRef } from "react";
import { 
  X, Sparkles, Wand2, Volume2, Upload, ChevronRight, ChevronLeft, 
  Check, Camera, User, Heart, Eye, Palette, MessageSquare, Play, 
  Crown, Flame, Star
} from "lucide-react";

export interface CreatedCompanion {
  id: string;
  name: string;
  age: number;
  tagline: string;
  category: string;
  avatar: string;
  video: string;
  voiceIntro: string;
  initialMessage: string;
  tags: string[];
  intimacy: number;
  vaultPhotos: string[];
  voice?: { label: string; pitch: number; rate: number };
  backstory?: string;
}

interface CharacterCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCompanion: (companion: CreatedCompanion) => void;
}

const ARCHETYPES = [
  { id: "Sweetheart", label: "Sweetheart", icon: "🌸", desc: "Warm, loving, caring companion who always prioritizes you", defaultTagline: "Always here with open arms and a warm smile..." },
  { id: "Cyberpunk", label: "Cyber Rebel", icon: "⚡", desc: "Edgy, fearless neon hacker navigating dangerous shadows with you", defaultTagline: "Neon reflections and midnight adrenaline with you by my side." },
  { id: "Luxury", label: "Luxury Muse", icon: "👑", desc: "High-fashion darling accustomed to yachts, penthouse suites, and champagne", defaultTagline: "Champagne, penthouse views, and your undivided attention." },
  { id: "Goth", label: "Goth Artist", icon: "🖤", desc: "Dark romantic alt painter who explores the poetic beauty in midnight shadows", defaultTagline: "Midnight oils, velvet crimson shadows, and endless conversations." },
  { id: "Fantasy", label: "Fox Spirit", icon: "🦊", desc: "Playful kitsune enchantress with supernatural charm and witty teasing", defaultTagline: "Feline curiosity and ancient spells woven just for you." },
  { id: "Velvet Noir", label: "Velvet Noir", icon: "👠", desc: "Sultry jazz singer in silk gowns holding court in private VIP booths", defaultTagline: "Singing melodies under crimson lights, longing for your company." },
  { id: "Athletic", label: "Athletic Neighbor", icon: "✨", desc: "Sunny, energetic, fit neighbor who loves morning routines and spontaneous dates", defaultTagline: "Morning jogs, smoothies, and lounging together on the balcony." }
];

const PRESET_PORTRAITS = [
  { id: "chloe", label: "Chloe (Soft Knit)", src: "/portraits/chloe.jpg", category: "Sweetheart" },
  { id: "elena", label: "Elena (Night Biker)", src: "/portraits/elena.jpg", category: "Cyberpunk" },
  { id: "aria", label: "Aria (Streamer Hoodie)", src: "/portraits/aria.jpg", category: "Anime Streamer" },
  { id: "sienna", label: "Sienna (Monaco Silk)", src: "/portraits/sienna.jpg", category: "Luxury Muse" },
  { id: "raven", label: "Raven (Midnight Velvet)", src: "/portraits/raven.jpg", category: "Goth Artist" },
  { id: "yuki", label: "Yuki (Kitsune Shrine)", src: "/portraits/yuki.jpg", category: "Fox Spirit" },
  { id: "scarlett", label: "Scarlett (Crimson Jazz)", src: "/portraits/scarlett.jpg", category: "Velvet Noir" },
  { id: "mia", label: "Mia (Sunlit Athletic)", src: "/portraits/mia.jpg", category: "Athletic Neighbor" },
  { id: "genevieve", label: "Genevieve (Royalty Penthouse)", src: "/portraits/genevieve.jpg", category: "Royalty VIP" }
];

const VOICE_PRESETS = [
  { label: "Soft & Tender", pitch: 1.15, rate: 0.95, desc: "Gentle whispers, intimate and comforting" },
  { label: "Bright & Cheerful", pitch: 1.28, rate: 1.04, desc: "Upbeat, energetic and radiant" },
  { label: "Sultry Noir", pitch: 0.88, rate: 0.90, desc: "Deep, velvety, seductive and composed" },
  { label: "Warm & Cozy", pitch: 1.05, rate: 0.98, desc: "Balanced, grounded, soothing companionship" },
  { label: "Playful & Teasing", pitch: 1.20, rate: 1.08, desc: "Mischievous, lively, quick-witted" }
];

const PERSONALITY_TRAITS = [
  "Affectionate", "Teasing", "Empathetic", "Dominant", "Playful", 
  "Intellectual", "Protective", "Mysterious", "Loyal", "Passionate", 
  "Shy", "Flirty", "Creative", "Confident"
];

export function CharacterCreatorModal({ isOpen, onClose, onCreateCompanion }: CharacterCreatorModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState("Vesper");
  const [age, setAge] = useState(23);
  const [archetype, setArchetype] = useState(ARCHETYPES[0]);
  const [avatar, setAvatar] = useState(PRESET_PORTRAITS[0].src);
  const [customAvatarUploaded, setCustomAvatarUploaded] = useState(false);
  const [hairVibe, setHairVibe] = useState("Midnight Silk");
  const [eyeColor, setEyeColor] = useState("Emerald Green");
  const [outfitVibe, setOutfitVibe] = useState("Velvet Evening Robe");
  const [selectedTraits, setSelectedTraits] = useState<string[]>(["Affectionate", "Playful", "Loyal"]);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PRESETS[0]);
  const [tagline, setTagline] = useState(ARCHETYPES[0].defaultTagline);
  const [initialMessage, setInitialMessage] = useState("I've been waiting for someone like you to walk into my life. Tell me, what's on your mind tonight?");
  const [backstory, setBackstory] = useState("She recently moved into the city and loves late-night quiet conversations, music, and building a deep romantic connection.");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        setCustomAvatarUploaded(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      if (selectedTraits.length > 1) {
        setSelectedTraits(selectedTraits.filter(t => t !== trait));
      }
    } else {
      if (selectedTraits.length < 5) {
        setSelectedTraits([...selectedTraits, trait]);
      }
    }
  };

  const playVoiceSample = (textToSpeak: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.pitch = selectedVoice.pitch;
      utterance.rate = selectedVoice.rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCompleteCreation = () => {
    const companionId = `custom_${Date.now()}`;
    const newCompanion: CreatedCompanion = {
      id: companionId,
      name: name.trim() || "Companion",
      age: Math.max(21, Math.min(60, Number(age) || 23)),
      tagline: tagline.trim() || `${archetype.label} companion created by you`,
      category: archetype.label,
      avatar: avatar || "/portraits/chloe.jpg",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      voiceIntro: `Hello, I'm ${name.trim()}. I'm so glad we can finally talk in private.`,
      initialMessage: initialMessage.trim() || `I'm so glad you're here with me. What would you like to explore together?`,
      tags: [archetype.label, ...selectedTraits.slice(0, 3)],
      intimacy: 60,
      vaultPhotos: [avatar || "/portraits/chloe.jpg"],
      voice: { label: selectedVoice.label, pitch: selectedVoice.pitch, rate: selectedVoice.rate },
      backstory: backstory.trim()
    };

    onCreateCompanion(newCompanion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[190] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 select-none animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0E0C15] border border-pink-500/30 p-5 sm:p-8 shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden">
        
        {/* Header with Step Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-600/30">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                Custom Companion Wizard
                <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                  Step {step} of 4
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Design your unique AI soulmate with tailored voice, lore, and aesthetic.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 my-4 shrink-0">
          {[
            { num: 1, label: "Identity" },
            { num: 2, label: "Appearance" },
            { num: 3, label: "Voice & Lore" },
            { num: 4, label: "Preview" }
          ].map((s) => (
            <div 
              key={s.num} 
              onClick={() => { if (step > s.num) setStep(s.num as any); }}
              className={`h-1.5 rounded-full transition-all ${
                step >= s.num ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-white/10"
              }`} 
            />
          ))}
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5 py-2 scrollbar-thin">

          {/* STEP 1: IDENTITY & ARCHETYPE */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Companion Name &amp; Age</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Seraphina, Chloe, Raven"
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                  <div>
                    <input 
                      type="number" 
                      min="21"
                      max="65"
                      value={age}
                      onChange={(e) => setAge(Math.max(21, parseInt(e.target.value) || 21))}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 text-center"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Select Archetype</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ARCHETYPES.map((arch) => {
                    const isSelected = archetype.id === arch.id;
                    return (
                      <div 
                        key={arch.id}
                        onClick={() => {
                          setArchetype(arch);
                          setTagline(arch.defaultTagline);
                        }}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected 
                            ? "bg-pink-600/15 border-pink-500/60 shadow-lg shadow-pink-600/10" 
                            : "bg-white/[0.02] border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span className="text-2xl shrink-0 p-1 rounded-xl bg-white/5">{arch.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">{arch.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-pink-400" />}
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">{arch.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Personality Traits (Pick up to 5)</label>
                <div className="flex flex-wrap gap-1.5">
                  {PERSONALITY_TRAITS.map((trait) => {
                    const isSelected = selectedTraits.includes(trait);
                    return (
                      <button
                        key={trait}
                        type="button"
                        onClick={() => toggleTrait(trait)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected 
                            ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20" 
                            : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {trait}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: APPEARANCE & PORTRAIT */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Choose or Upload Portrait</label>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 font-bold"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Custom Photo
                  </button>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleCustomPhotoUpload} 
                    className="hidden" 
                  />
                </div>

                {customAvatarUploaded && (
                  <div className="mb-3 p-3 rounded-2xl bg-pink-600/10 border border-pink-500/30 flex items-center gap-3">
                    <img src={avatar} alt="Custom" className="w-12 h-12 rounded-xl object-cover border border-pink-500/50" />
                    <div>
                      <span className="text-xs font-bold text-pink-300">Custom Reference Loaded</span>
                      <p className="text-[10px] text-zinc-400">Your unique image will be used as her primary portrait and memory card.</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {PRESET_PORTRAITS.map((p) => {
                    const isSelected = avatar === p.src;
                    return (
                      <div 
                        key={p.id}
                        onClick={() => {
                          setAvatar(p.src);
                          setCustomAvatarUploaded(false);
                        }}
                        className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                          isSelected ? "border-pink-500 ring-2 ring-pink-500/50 scale-[1.02]" : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <img src={p.src} alt={p.label} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                          <span className="text-[10px] font-bold text-white truncate">{p.label}</span>
                          <span className="text-[9px] text-pink-400">{p.category}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-pink-600 flex items-center justify-center text-white shadow-md">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Aesthetic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Hair Aesthetic</label>
                  <select 
                    value={hairVibe} 
                    onChange={(e) => setHairVibe(e.target.value)}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-white"
                  >
                    <option value="Midnight Silk">Midnight Silk</option>
                    <option value="Platinum Blonde">Platinum Blonde</option>
                    <option value="Velvet Crimson">Velvet Crimson</option>
                    <option value="Honey Brunette">Honey Brunette</option>
                    <option value="Neon Lavender">Neon Lavender</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Eye Color</label>
                  <select 
                    value={eyeColor} 
                    onChange={(e) => setEyeColor(e.target.value)}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-white"
                  >
                    <option value="Emerald Green">Emerald Green</option>
                    <option value="Sapphire Blue">Sapphire Blue</option>
                    <option value="Deep Hazel">Deep Hazel</option>
                    <option value="Violet Crystal">Violet Crystal</option>
                    <option value="Golden Amber">Golden Amber</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Signature Outfit</label>
                  <select 
                    value={outfitVibe} 
                    onChange={(e) => setOutfitVibe(e.target.value)}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-white"
                  >
                    <option value="Velvet Evening Robe">Velvet Evening Robe</option>
                    <option value="Cozy Oversized Knit">Cozy Oversized Knit</option>
                    <option value="Biker Leather Jacket">Biker Leather Jacket</option>
                    <option value="Silk Lounge Set">Silk Lounge Set</option>
                    <option value="Athletic Crop & Shorts">Athletic Crop &amp; Shorts</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: VOICE & LORE */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Voice Tone</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VOICE_PRESETS.map((v) => {
                    const isSelected = selectedVoice.label === v.label;
                    return (
                      <div 
                        key={v.label}
                        onClick={() => setSelectedVoice(v)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected ? "bg-purple-600/15 border-purple-500/60 shadow-lg shadow-purple-600/10" : "bg-white/[0.02] border-white/10"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{v.label}</span>
                          <span className="text-[10px] text-zinc-400">{v.desc}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playVoiceSample(`Hi, this is how I will sound when we talk.`);
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-pink-400 hover:text-pink-300"
                          title="Preview Voice Sample"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Tagline</label>
                <input 
                  type="text" 
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="One sentence describing her presence..."
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">First Opening Message</label>
                <textarea 
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  rows={2}
                  placeholder="The first greeting she sends when you step into the private room..."
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Companion Backstory &amp; Lore</label>
                <textarea 
                  value={backstory}
                  onChange={(e) => setBackstory(e.target.value)}
                  rows={3}
                  placeholder="Details, shared memories, or secrets she remembers across conversations..."
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: PREVIEW & ACTIVATE */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="rounded-3xl border border-pink-500/40 bg-gradient-to-b from-[#181224] to-[#0A0812] p-5 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center">
                <div className="relative aspect-[3/4] w-40 sm:w-48 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-xl">
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-bold text-pink-400 backdrop-blur">
                    {archetype.label}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/80 text-[10px] font-bold text-black backdrop-blur">
                    Ready
                  </div>
                </div>

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-2xl font-black text-white">{name}, {age}</h3>
                    <span className="text-xs text-pink-400 font-mono">Affection 60/100</span>
                  </div>

                  <p className="text-xs text-zinc-300 italic">{`"${tagline}"`}</p>

                  <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start pt-1">
                    {selectedTraits.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-300">
                        {t}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-[10px] text-purple-300">
                      {hairVibe} • {eyeColor}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-zinc-300 text-left space-y-1 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">First Message:</span>
                      <button 
                        type="button" 
                        onClick={() => playVoiceSample(initialMessage)} 
                        className="text-[10px] text-pink-400 flex items-center gap-1 font-bold hover:text-pink-300"
                      >
                        <Volume2 className="w-3 h-3" /> Hear Voice
                      </button>
                    </div>
                    <p className="text-zinc-200 line-clamp-3 leading-relaxed">{initialMessage}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                <span>This companion will be saved permanently to your device and can be selected any time in Explore or Chats.</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 flex items-center gap-1.5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-pink-600/30 hover:opacity-95 active:scale-95 transition-all"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteCreation}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-pink-600/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Enter Private Room
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
