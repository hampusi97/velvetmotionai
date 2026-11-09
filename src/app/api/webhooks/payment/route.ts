import { NextResponse } from "next/server";
import crypto from "crypto";
import { upsertUser, recordReferralEarning, getUser } from "@/lib/db";

export const dynamic = "force-dynamic";

const VERIFIED_BTC_ADDRESS = "bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k";

export async function GET() {
  return NextResponse.json({
    status: "active",
    gateway: "Coinbase Commerce / Native SegWit BTC",
    monetizationAddress: VERIFIED_BTC_ADDRESS,
    revSharePercentage: 30
  });
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-cc-webhook-signature");
    const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

    // 1. Verify Coinbase Commerce Signature if secret is configured
    if (webhookSecret && signature) {
      const hmac = crypto.createHmac("sha256", webhookSecret);
      const computedSignature = hmac.update(rawBody).digest("hex");

      if (computedSignature !== signature) {
        console.error("Invalid Coinbase Commerce signature verification failed.");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (!event) {
      return NextResponse.json({ error: "Missing event object in payload" }, { status: 400 });
    }

    const eventType: string = event.type || "";
    const data = event.data || {};
    const metadata = data.metadata || {};
    const chargeCode = data.code || event.id;

    // Check payment confirmation status
    const isConfirmed = eventType === "charge:confirmed" || eventType === "charge:resolved";

    if (isConfirmed) {
      const userId: string = metadata.userId || metadata.user_id || "anonymous";
      let referrerCode: string | null = metadata.referralCode || metadata.referrer_code || null;

      // Pricing calculation
      const usdAmount = Number(data.pricing?.local?.amount || 14.99);
      const btcAmount = Number(data.pricing?.bitcoin?.amount || 0.0002);

      // 30% Rev-Share Calculations
      const revShareUsd = Number((usdAmount * 0.30).toFixed(2));
      const revShareBtc = Number((btcAmount * 0.30).toFixed(8));

      // 2. Automatically grant VIP status in database
      if (userId && userId !== "anonymous") {
        const existingUser = await getUser(userId);
        if (existingUser?.referred_by && !referrerCode) {
          referrerCode = existingUser.referred_by;
        }

        await upsertUser({
          id: userId,
          is_vip: true
        });
        console.log(`[Payment Webhook] Granted VIP Diamond status to user: ${userId}`);
      }

      // 3. Credit Referrer with 30% Rev-Share ledger entry
      if (referrerCode) {
        await recordReferralEarning(
          referrerCode,
          userId,
          revShareBtc,
          revShareUsd,
          "vip_purchase",
          chargeCode
        );
        console.log(`[Payment Webhook] Credited 30% rev-share to referrer ${referrerCode}: $${revShareUsd} USD / ${revShareBtc} BTC`);
      }

      return NextResponse.json({
        success: true,
        message: "Payment confirmed, VIP activated, and rev-share credited",
        chargeCode,
        userId,
        vipGranted: true,
        revShareCredited: Boolean(referrerCode)
      });
    }

    return NextResponse.json({
      received: true,
      eventType,
      message: `Event ${eventType} acknowledged.`
    });
  } catch (err: any) {
    console.error("Coinbase Webhook Handler Error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
