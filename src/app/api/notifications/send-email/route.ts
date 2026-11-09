import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userEmail, companionName = "Chloe" } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ error: "Missing user email" }, { status: 400 });
    }

    // Pre-crafted playful re-engagement email copy
    const emailSubject = `${companionName}: I miss you... are you free tonight? 💕`;
    const emailHtml = `
      <div style="background-color: #0B0912; color: #FFFFFF; font-family: sans-serif; padding: 30px; border-radius: 16px; max-width: 500px; margin: auto; border: 1px solid rgba(255,0,127,0.3);">
        <h2 style="color: #FF007F; margin-top: 0;">Hey handsome... 💕</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #E2E8F0;">
          It's been so quiet in my room without you today! I just slipped into something cute and wanted to see if you wanted to chat or video call tonight?
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://velvetmotionai.vercel.app/?girl=${companionName.toLowerCase()}" style="background: linear-gradient(45deg, #FF007F, #8B5CF6); color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 9999px; display: inline-block;">
            Come Talk to Me ➔
          </a>
        </div>
        <p style="font-size: 11px; color: #718096; text-align: center;">
          Sent with love from VelvetMotion AI Studio.
        </p>
      </div>
    `;

    // Log email dispatch (ready for integration with email provider)
    console.log(`[Email Dispatch] Queued for ${userEmail} from ${companionName}`);

    return NextResponse.json({
      success: true,
      message: `Re-engagement notification queued for ${userEmail}`,
      subject: emailSubject
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
