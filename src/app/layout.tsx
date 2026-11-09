import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VelvetMotion AI - Turn Photos into Cinematic Videos",
  description: "Prompt-driven AI image-to-video studio with high-end aesthetic motion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-midnight min-h-screen text-slate-100 selection:bg-neonPink selection:text-white">
        <div className="fixed top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-neonPurple/15 blur-[120px] pointer-events-none" />
        <div className="fixed top-1/3 right-10 -z-10 h-96 w-96 rounded-full bg-neonPink/15 blur-[130px] pointer-events-none" />
        <div className="fixed bottom-0 left-1/3 -z-10 h-96 w-96 rounded-full bg-neonFuchsia/10 blur-[140px] pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
