"use client";

import { useEffect, useState } from "react";
import {
  addReaderSuggestion,
  loadActiveMap,
  loadAllProgress,
  loadReaderSuggestions,
  saveActiveStory,
  saveProgress,
  subscribeStoryStore,
} from "./story-storage";
import type { ReaderSuggestion } from "./suggestions";

export function useStoryProgress() {
  const [all, setAll] = useState<Record<string, unknown>>({});
  const [active, setActive] = useState<Record<string, string>>({});
  const [ideas, setIdeas] = useState<ReaderSuggestion[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      setAll(loadAllProgress());
      setActive(loadActiveMap());
      setIdeas(loadReaderSuggestions());
    };
    read();
    setReady(true);
    return subscribeStoryStore(read);
  }, []);

  return {
    all,
    active,
    ideas,
    ready,
    commit(state: { storyId: string }) {
      saveProgress(state);
    },
    focus(companionId: string, storyId: string) {
      saveActiveStory(companionId, storyId);
    },
    suggest(title: string, detail: string) {
      return addReaderSuggestion(title, detail);
    },
  };
}
