import { NextResponse } from "next/server";
import { getUser, upsertUser, getReferralStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const refCode = searchParams.get("refCode");

    if (refCode) {
      const stats = await getReferralStats(refCode);
      return NextResponse.json({ success: true, stats });
    }

    if (!userId) {
      return NextResponse.json({ error: "userId or refCode is required" }, { status: 400 });
    }

    let user = await getUser(userId);
    if (!user) {
      user = await upsertUser({ id: userId });
    }

    const stats = await getReferralStats(user.referral_code);

    return NextResponse.json({
      success: true,
      user,
      stats
    });
  } catch (err: any) {
    console.error("User API Error:", err);
    return NextResponse.json({ error: err.message || "Failed to get user" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, wallet_address, referred_by, is_vip, referral_code } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updated = await upsertUser({
      id,
      wallet_address,
      referred_by,
      is_vip,
      referral_code
    });

    const stats = await getReferralStats(updated.referral_code);

    return NextResponse.json({
      success: true,
      user: updated,
      stats
    });
  } catch (err: any) {
    console.error("User Upsert Error:", err);
    return NextResponse.json({ error: err.message || "Failed to update user" }, { status: 500 });
  }
}
