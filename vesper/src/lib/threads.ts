import type { CompanionId } from "@/data/companions";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  at: number;
};

export type ThreadState = {
  userName: string;
  note: string;
  facts: string[];
  messages: ChatMessage[];
  startedAt: number;
};

const KEY = "vesper.threads.v1";

type Store = Partial<Record<CompanionId, ThreadState>>;

function emptyStore(): Store {
  return {};
}

export function readStore(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Store;
    return parsed && typeof parsed === "object" ? parsed : emptyStore();
  } catch {
    return emptyStore();
  }
}

export function writeStore(store: Store) {
  window.localStorage.setItem(KEY, JSON.stringify(store));
}

export function readThread(id: CompanionId): ThreadState | null {
  const thread = readStore()[id];
  if (!thread) return null;
  return { ...thread, facts: Array.isArray(thread.facts) ? thread.facts.slice(0, 8) : [] };
}

export function writeThread(id: CompanionId, thread: ThreadState) {
  const store = readStore();
  store[id] = thread;
  writeStore(store);
}

export function clearThread(id: CompanionId) {
  const store = readStore();
  delete store[id];
  writeStore(store);
}

export function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
