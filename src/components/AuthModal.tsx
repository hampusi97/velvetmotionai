"use client";

import React, { useState } from "react";
import { User, Lock, Mail, Check, X, ShieldCheck, Sparkles, LogIn, UserPlus } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userName = name || email.split("@")[0] || "User";
      const user = { name: userName, email };
      const userId = "u_" + (email.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 15) || Math.random().toString(36).substring(2, 9));

      if (typeof window !== "undefined") {
        localStorage.setItem("velvet_user", JSON.stringify(user));
        localStorage.setItem("velvet_user_id", userId);
      }

      // Sync user profile to backend database
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          wallet_address: null
        })
      }).catch(() => {});

      onLoginSuccess(user);
      onClose();
    } catch (err) {
      console.warn("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-[#120E1C] border border-pink-500/40 p-6 sm:p-8 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 mx-auto flex items-center justify-center mb-3">
          <User className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
          {isSignUp ? "Create Your Account" : "Welcome Back"}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Sync chat memories, companion unlocks, and VIP status across all your devices.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5 my-5 text-left">
          {isSignUp && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white shadow-xl transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? "Syncing..." : isSignUp ? "Create Account & Sync" : "Log In & Sync Devices"}
          </button>
        </form>

        <p className="text-xs text-zinc-400">
          {isSignUp ? "Already have an account?" : "New to VelvetMotion?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-pink-400 font-bold hover:underline ml-1"
          >
            {isSignUp ? "Log In" : "Sign Up Free"}
          </button>
        </p>
      </div>
    </div>
  );
}
