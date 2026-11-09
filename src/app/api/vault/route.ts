import { NextResponse } from "next/server";
import { getVaultUnlocks, unlockVaultPhoto } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const companionId = searchParams.get("companionId");

    if (!userId || !companionId) {
      return NextResponse.json({ error: "userId and companionId are required" }, { status: 400 });
    }

    const unlocks = await getVaultUnlocks(userId, companionId);
    return NextResponse.json({ success: true, unlocks });
  } catch (err: any) {
    console.error("Vault API GET Error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch vault unlocks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, companionId, photoUrl } = body;

    if (!userId || !companionId || !photoUrl) {
      return NextResponse.json({ error: "Missing required vault fields" }, { status: 400 });
    }

    await unlockVaultPhoto(userId, companionId, photoUrl);
    return NextResponse.json({ success: true, unlocked: photoUrl });
  } catch (err: any) {
    console.error("Vault API POST Error:", err);
    return NextResponse.json({ error: err.message || "Failed to unlock photo" }, { status: 500 });
  }
}
