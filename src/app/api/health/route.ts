import { NextResponse } from "next/server";

export async function GET() {
  const memoryUsage = process.memoryUsage();
  return NextResponse.json({
    status: "healthy",
    system: "VelvetMotion Self-Healing Cluster",
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
    },
    cluster: "Vercel Serverless Edge",
    timestamp: new Date().toISOString()
  });
}
