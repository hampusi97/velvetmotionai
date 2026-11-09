import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;

    if (!prompt) {
      return NextResponse.json({ error: "A motion prompt is required." }, { status: 400 });
    }

    const sampleVideos = [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
    ];

    const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
    await new Promise((resolve) => setTimeout(resolve, 2500));

    return NextResponse.json({
      success: true,
      videoUrl: randomVideo,
      promptUsed: prompt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Generation error" }, { status: 500 });
  }
}
