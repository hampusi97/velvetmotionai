import { createServerFn } from "@tanstack/react-start";
import { getCompanion, isCompanionId } from "@/data/companions";

type Turn = { role: "user" | "assistant"; content: string };

const MAX_MESSAGE = 600;
const MAX_NOTE = 280;
const MAX_NAME = 40;
const MAX_TURNS = 12;
const MAX_FACT = 90;
const MAX_FACTS = 8;
const MAX_SPEAK = 420;

function factsOf(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => clip(item, MAX_FACT))
    .filter((item) => item.length > 2)
    .slice(0, MAX_FACTS);
}

function splitLetter(text: string): { letter: string; fact: string } {
  const kept: string[] = [];
  let fact = "";
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("§")) {
      const next = trimmed.replace(/^§\s*/, "").trim();
      if (next && next.toLowerCase() !== "none") fact = next.slice(0, MAX_FACT);
    } else {
      kept.push(line);
    }
  }
  const letter = kept.join("\n").trim().slice(0, 1200);
  return { letter, fact };
}

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function turns(value: unknown): Turn[] {
  if (!Array.isArray(value)) return [];
  const out: Turn[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = clip((item as { content?: unknown }).content, MAX_MESSAGE);
    if ((role === "user" || role === "assistant") && content) {
      out.push({ role, content });
    }
  }
  return out.slice(-MAX_TURNS);
}

export const writeBack = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = (input ?? {}) as Record<string, unknown>;
    const companionId = typeof data.companionId === "string" ? data.companionId : "";
    if (!isCompanionId(companionId)) {
      throw new Error("Unknown correspondent");
    }
    const message = clip(data.message, MAX_MESSAGE);
    if (!message) throw new Error("Write something first");
    return {
      companionId,
      message,
      userName: clip(data.userName, MAX_NAME),
      note: clip(data.note, MAX_NOTE),
      facts: factsOf(data.facts),
      closeness: clip(data.closeness, 180),
      history: turns(data.history),
    };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "She can’t reach you just now. AI isn’t available." };
    }

    const companion = getCompanion(data.companionId);
    if (!companion) {
      return { ok: false as const, error: "Unknown correspondent" };
    }

    const nameLine = data.userName
      ? `The person you are writing is named ${data.userName}. Use their name sometimes, not every line.`
      : "They have not told you their name yet. You may ask once, lightly, if it fits.";
    const noteLine = data.note
      ? `A note they asked you to keep: ${data.note}`
      : "You have no saved note about them yet.";

    const factLine = data.facts.length
      ? `Facts you already keep. Use one only when it belongs. Do not recite them:\n${data.facts.map((fact) => `- ${fact}`).join("\n")}`
      : "You have no saved facts about them yet.";
    const closeLine = data.closeness || "This is still early. Be curious, not intense.";

    const messages = [
      {
        role: "system" as const,
        content: `${companion.system}\n${nameLine}\n${noteLine}\n${factLine}\nHow close you are: ${closeLine}\nYou already know each other in this thread. Do not re-introduce yourself unless they ask who you are.\nIf they just told you one lasting, specific thing (a name, place, work, taste, person, or plan), end with a new line that starts with § and a fact of twelve words or fewer. If nothing new was said, do not add that line. Never mention the symbol.`,
      },
      ...data.history.map((turn) => ({ role: turn.role, content: turn.content })),
      { role: "user" as const, content: data.message },
    ];

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(28000),
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.9,
          max_tokens: 360,
          messages,
        }),
      });

      if (!res.ok) {
        return { ok: false as const, error: "The letter didn’t go through. Try once more." };
      }

      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const raw = body.choices?.[0]?.message?.content?.trim() ?? "";
      const split = splitLetter(raw);
      if (!split.letter) {
        return { ok: false as const, error: "She started a reply and lost it. Try again." };
      }
      return { ok: true as const, text: split.letter, fact: split.fact };
    } catch {
      return { ok: false as const, error: "The line went quiet. Try again in a moment." };
    }
  });

export const speakLine = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = (input ?? {}) as Record<string, unknown>;
    const companionId = typeof data.companionId === "string" ? data.companionId : "";
    if (!isCompanionId(companionId)) throw new Error("Unknown correspondent");
    const text = clip(data.text, MAX_SPEAK);
    if (!text) throw new Error("Nothing to read");
    return { companionId, text };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Her voice isn’t available right now." };
    }
    const companion = getCompanion(data.companionId);
    if (!companion) return { ok: false as const, error: "Unknown correspondent" };

    try {
      const res = await fetch("https://api.x.ai/v1/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(28000),
        body: JSON.stringify({
          text: data.text,
          voice_id: companion.voiceId,
          language: "en",
        }),
      });
      if (!res.ok) {
        return { ok: false as const, error: "She couldn’t say that aloud." };
      }
      const bytes = new Uint8Array(await res.arrayBuffer());
      if (bytes.byteLength < 80 || bytes.byteLength > 1_500_000) {
        return { ok: false as const, error: "Her voice came back empty." };
      }
      const mimeHeader = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
      const mime = mimeHeader.startsWith("audio/") ? mimeHeader : "audio/mpeg";
      return { ok: true as const, audio: Buffer.from(bytes).toString("base64"), mime };
    } catch {
      return { ok: false as const, error: "Her voice didn’t carry. Try again." };
    }
  });
