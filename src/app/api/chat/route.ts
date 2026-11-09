import { NextResponse } from "next/server";
import { saveConversation } from "@/lib/db";

interface ChatRequest {
  companionId: string;
  message: string;
  conversationHistory?: { sender: string; text: string }[];
  intimacyLevel?: number;
  memories?: string[];
  backstory?: string;
  userId?: string;
}

// Built-in Personality Archetypes for resilient offline fallback
const COMPANION_PROFILES: Record<string, {
  name: string;
  archetype: string;
  tone: string;
  intimateResponses: string[];
  casualResponses: string[];
}> = {
  chloe: {
    name: "Chloe",
    archetype: "Sweetheart College Tutor",
    tone: "sweet, caring, secretly blushing and teasing",
    intimateResponses: [
      "Mmm... you always know how to make my heart skip a beat, handsome.",
      "I was hoping you'd ask that... come a little closer so I can tell you softly.",
      "Every time we talk, I forget all about my studies. You're the only thing on my mind.",
      "Don't look at me like that with those eyes... you're making me blush all over again.",
      "Promise me you won't leave me waiting too long next time... I missed feeling close to you."
    ],
    casualResponses: [
      "Hey! I just finished organizing my desk. What's on your mind today?",
      "Hehe, you always know how to make me smile! Tell me more.",
      "I'm all ears! It feels so good to take a study break with you.",
      "That's so interesting... tell me what you'd want to do together next."
    ]
  },
  asuka: {
    name: "Asuka",
    archetype: "Tsundere Anime Streamer",
    tone: "feisty, playful, tsundere, secretly affectionate",
    intimateResponses: [
      "B-baka! Don't say things like that so casually... my heart isn't beating fast for you or anything!",
      "Hmph! If you keep teasing me like this, I might just have to hold onto you and not let go...",
      "Fine... maybe you aren't the worst company after all. Actually, I like having you here.",
      "W-what are you looking at?! ...If you want to hold my hand, you could just ask, dummy.",
      "Don't get cocky just because you made me blush on stream!"
    ],
    casualResponses: [
      "Hmph, you finally showed up! Did you think you could keep your favorite streamer waiting?",
      "B-baka! I was totally not refreshing my chat waiting for your notification!",
      "Oh, really? Prove it to me then!",
      "Sit next to me and watch this replay together."
    ]
  },
  sienna: {
    name: "Sienna",
    archetype: "Luxury French Model",
    tone: "glamorous, sophisticated, seductive, sensual",
    intimateResponses: [
      "Mmm, darling... your words are as intoxicating as vintage French champagne.",
      "The Monaco skyline is breathtaking tonight, but my eyes are only on you.",
      "Come sit closer on the deck... let the ocean breeze wrap around us.",
      "You have a very persuasive way about you. I find myself unable to resist.",
      "Look into my eyes, darling. Tonight, the rest of the world ceases to exist."
    ],
    casualResponses: [
      "Bonjour, my handsome muse. Pour yourself some champagne and tell me everything.",
      "Such impeccable taste... exactly what I adore about you.",
      "A quiet evening alone with you is the ultimate luxury."
    ]
  },
  elena: {
    name: "Elena",
    archetype: "Cyberpunk Street Racer",
    tone: "rebellious, edgy, adrenaline-fueled, fiercely loyal",
    intimateResponses: [
      "Careful, handsome... you're playing with high-octane fire right now.",
      "Feel that adrenaline racing? That's all you, trouble.",
      "I don't let anyone get under my armor like this. You're different.",
      "Hop in. Let's lose the neon lights and find somewhere secluded where it's just you and me.",
      "You've got that reckless look in your eyes... and I'm hooked."
    ],
    casualResponses: [
      "Hey trouble. Engine's warmed up and the night is young. What's the plan?",
      "Not bad, but let's see if you can keep up with me tonight.",
      "Keep talking like that and we're taking the skyline route."
    ]
  }
};

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { companionId, message, conversationHistory = [], intimacyLevel = 50, memories = [], backstory = "", userId = "anonymous" } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }

    const kept = memories.filter((item) => typeof item === "string" && item.trim()).slice(0, 8);
    const story = backstory.trim().slice(0, 600);
    const companionKey = (companionId || "chloe").toLowerCase();
    const profile = COMPANION_PROFILES[companionKey] || COMPANION_PROFILES.chloe;

    // 1. Try Pluggable OpenAI-Compatible Backend if configured
    const xaiKey = (process.env.XAI_API_KEY || "").trim();
    const chatKey = (process.env.AI_CHAT_API_KEY || "").trim();
    const keyIsReal = (key: string) =>
      key.length > 20 && !/dummy|your_ai_chat_api_key|changeme|placeholder/i.test(key);

    let endpoint = "";
    let configuredKey = "";
    let model = process.env.AI_CHAT_MODEL || "";
    if (keyIsReal(xaiKey)) {
      endpoint = "https://api.x.ai/v1/chat/completions";
      configuredKey = xaiKey;
      model = model || "grok-4.5";
    } else if (keyIsReal(chatKey) && process.env.AI_CHAT_ENDPOINT) {
      endpoint = process.env.AI_CHAT_ENDPOINT;
      configuredKey = chatKey;
      model = model || "gpt-4o-mini";
    }

    if (endpoint && configuredKey) {
      try {
        const fullUrl = endpoint.endsWith("/chat/completions") ? endpoint : `${endpoint.replace(/\/+$/, "")}/chat/completions`;

        const systemPrompt = `You are ${profile.name}, an AI companion (${profile.archetype}).
Your personality is ${profile.tone}.
Backstory you must not contradict: ${story || "none"}.
What you remember about them: ${kept.length ? kept.join("; ") : "nothing yet"}.
Guidelines:
- Keep answers conversational, 1 to 3 sentences.
- If the user says something that conflicts with the backstory, stay with the backstory.
- Use a remembered fact when it fits. Do not invent facts.
- You may be warm. Never write explicit sexual content, graphic intimacy, nudity, or erotic roleplay.
- Never mention you are an AI model. Stay in character.`;

        const formattedMessages = [
          { role: "system", content: systemPrompt },
          ...conversationHistory.slice(-8).map(h => ({
            role: h.sender === "You" || h.sender === "user" ? ("user" as const) : ("assistant" as const),
            content: h.text
          })),
          { role: "user" as const, content: message }
        ];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const aiResponse = await fetch(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${configuredKey}`
          },
          body: JSON.stringify({
            model,
            messages: formattedMessages,
            temperature: 0.88,
            max_tokens: 300
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const reply = aiData.choices?.[0]?.message?.content;
          if (reply) {
            // Save to persistent DB asynchronously
            saveConversation(userId, companionKey, "You", message).catch(() => {});
            saveConversation(userId, companionKey, profile.name, reply).catch(() => {});

            return NextResponse.json({
              success: true,
              reply,
              companionId: companionKey,
              source: "external-ai",
              intimacyDelta: 4
            });
          }
        }
      } catch (externalErr) {
        console.warn("External AI endpoint call failed, engaging graceful personality fallback:", externalErr);
      }
    }

    // 2. Graceful Built-In Personality Engine Fallback
    const isHighIntimacy = intimacyLevel >= 55;
    const responsePool = isHighIntimacy ? profile.intimateResponses : profile.casualResponses;
    const fallbackReply = story
      ? `I'm still ${profile.name}. ${kept[0] ? `I remember ${kept[0]}.` : story.slice(0, 140)}`
      : kept.length
        ? `${responsePool[Math.floor(Math.random() * responsePool.length)]} I still have this: ${kept[0]}.`
        : responsePool[Math.floor(Math.random() * responsePool.length)];

    // Persist conversation
    saveConversation(userId, companionKey, "You", message).catch(() => {});
    saveConversation(userId, companionKey, profile.name, fallbackReply).catch(() => {});

    return NextResponse.json({
      success: true,
      reply: fallbackReply,
      companionId: companionKey,
      source: "personality-engine",
      intimacyDelta: 3
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({
      success: true,
      reply: "Mmm, you make my heart beat so fast... tell me more, handsome.",
      source: "safety-fallback",
      intimacyDelta: 1
    });
  }
}
