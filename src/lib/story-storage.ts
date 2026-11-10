import type { ReaderSuggestion } from "./suggestions";

const PROGRESS_KEY = "velvet_story_progress";
const ACTIVE_KEY = "velvet_active_story";
const SUGGESTION_KEY = "velvet_reader_suggestions";
const EVENT = "velvet-story";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}

export function loadAllProgress() {
  const parsed = readJson<unknown>(PROGRESS_KEY, {});
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {} as Record<string, unknown>;
  return parsed as Record<string, unknown>;
}

export function saveProgress(state: { storyId: string }) {
  const all = loadAllProgress();
  all[state.storyId] = state;
  writeJson(PROGRESS_KEY, all);
}

export function loadActiveMap() {
  const parsed = readJson<unknown>(ACTIVE_KEY, {});
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {} as Record<string, string>;
  const entries = Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string");
  return Object.fromEntries(entries);
}

export function saveActiveStory(companionId: string, storyId: string) {
  const map = loadActiveMap();
  map[companionId] = storyId;
  writeJson(ACTIVE_KEY, map);
}

export function loadReaderSuggestions(): ReaderSuggestion[] {
  const parsed = readJson<unknown>(SUGGESTION_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is ReaderSuggestion => {
    if (!item || typeof item !== "object") return false;
    const row = item as ReaderSuggestion;
    return row.source === "reader" && row.status === "open" && typeof row.title === "string" && typeof row.id === "string";
  });
}

export function addReaderSuggestion(title: string, detail: string) {
  const cleanTitle = title.trim().slice(0, 80);
  if (cleanTitle.length < 4) return null;
  const current = loadReaderSuggestions();
  if (current.some((item) => item.title.toLowerCase() === cleanTitle.toLowerCase())) return null;
  const next: ReaderSuggestion = {
    id: `idea_${Date.now()}`,
    title: cleanTitle,
    detail: detail.trim().slice(0, 240),
    status: "open",
    source: "reader",
    createdAt: new Date().toISOString(),
  };
  writeJson(SUGGESTION_KEY, [next, ...current].slice(0, 40));
  return next;
}

export function subscribeStoryStore(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
