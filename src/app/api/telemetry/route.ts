import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface TelemetryPayload {
  errorMessage: string;
  stackTrace?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
}

export async function POST(req: Request) {
  try {
    const body: TelemetryPayload = await req.json();
    const { errorMessage, stackTrace, url, userAgent, userId } = body;

    if (!errorMessage) {
      return NextResponse.json({ error: "errorMessage is required" }, { status: 400 });
    }

    console.warn(`[Sentry Telemetry Error Captured]:`, { errorMessage, url, userId });

    let githubIssueUrl: string | null = null;
    const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY || "hampusi97/velvetmotionai";

    // Autonomous Sentry Loop: [User Hits Bug] ➔ [Sentry Logs Error] ➔ [GitHub Issue Auto-Created]
    if (githubToken) {
      try {
        const issueTitle = `[Auto-Guardian Bug]: ${errorMessage.slice(0, 75)}`;
        const issueBody = `### 🐛 Autonomous Error Report
**Error Message:**
\`\`\`
${errorMessage}
\`\`\`

**Stack Trace:**
\`\`\`
${stackTrace || "No client stack trace available."}
\`\`\`

**Context:**
- **URL:** \`${url || "N/A"}\`
- **User Agent:** \`${userAgent || "N/A"}\`
- **User ID:** \`${userId || "anonymous"}\`
- **Timestamp:** \`${new Date().toISOString()}\`

---
*Auto-created by VelvetMotion Autonomous Sentry Guardian.*
*Triggers: [AI Pull Request] ➔ [Vercel Auto-Deploy]*`;

        const ghRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${githubToken}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: issueTitle,
            body: issueBody,
            labels: ["bug", "autonomous-heal"]
          })
        });

        if (ghRes.ok) {
          const issueData = await ghRes.json();
          githubIssueUrl = issueData.html_url;
          console.log(`[Autonomous Guardian] Created GitHub Issue: ${githubIssueUrl}`);
        }
      } catch (ghErr) {
        console.warn("Failed to auto-create GitHub issue:", ghErr);
      }
    }

    return NextResponse.json({
      success: true,
      status: "logged",
      githubIssueUrl,
      pipelineStep: githubIssueUrl ? "GitHub Issue Created" : "Telemetry Logged"
    });
  } catch (err: any) {
    console.error("Telemetry API error:", err);
    return NextResponse.json({ error: err.message || "Failed to log telemetry" }, { status: 500 });
  }
}
