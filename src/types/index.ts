export type AspectRatio = '9:16' | '16:9' | '1:1';
export type MotionIntensity = 'subtle' | 'sensual' | 'dynamic';
export type DurationSeconds = 2 | 4 | 6;

export interface MotionChip {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
  category: 'expression' | 'body' | 'camera' | 'atmosphere';
}

export interface CompanionPreset {
  id: string;
  name: string;
  tagline: string;
  avatarUrl: string;
  style: 'realistic' | 'anime' | 'glamour' | 'cyber';
  suggestedPrompt: string;
  aspectRatio: AspectRatio;
  videoPreviewUrl?: string;
}

export interface GenerationRequest {
  image: string; // base64 or remote URL
  prompt: string;
  aspectRatio: AspectRatio;
  motionIntensity: MotionIntensity;
  duration: DurationSeconds;
  enhancePrompt?: boolean;
  apiKey?: string;
}

export interface GenerationProgressState {
  isGenerating: boolean;
  phase: 'idle' | 'analyzing' | 'flow' | 'rendering' | 'encoding' | 'completed' | 'error';
  progress: number; // 0 - 100
  phaseDescription: string;
  elapsedSeconds: number;
}

export interface GenerationResult {
  id: string;
  videoUrl: string;
  sourceImageUrl: string;
  prompt: string;
  aspectRatio: AspectRatio;
  duration: number;
  motionIntensity: MotionIntensity;
  createdAt: number;
  engineUsed: 'cogvideox-5b' | 'velvet-synthesizer' | 'demo-cache';
  companionName?: string;
}

export interface HistoryItem extends GenerationResult {
  isFavorite?: boolean;
}
