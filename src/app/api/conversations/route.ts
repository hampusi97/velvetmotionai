import { NextResponse } from "next/server";
import { getConversations, saveConversation } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const companionId = searchParams.get("companionId");

    if (!userId || !companionId) {
      return NextResponse.json({ error: "userId and companionId are required" }, { status: 400 });
    }

    const conversations = await getConversations(userId, companionId);
    return NextResponse.json({ success: true, conversations });
  } catch (err: any) {
    console.error("Conversations API GET Error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, companionId, sender, message } = body;

    if (!userId || !companionId || !sender || !message) {
      return NextResponse.json({ error: "Missing required conversation fields" }, { status: 400 });
    }

    const saved = await saveConversation(userId, companionId, sender, message);
    return NextResponse.json({ success: true, conversation: saved });
  } catch (err: any) {
    console.error("Conversations API POST Error:", err);
    return NextResponse.json({ error: err.message || "Failed to save conversation" }, { status: 500 });
  }
}
