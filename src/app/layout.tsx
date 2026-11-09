import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VelvetMotion AI — Turn Photos into Cinematic Videos (Candy.ai Style)",
  description:
    "Transform any still portrait or photo into realistic, sensual, and cinematic AI motion videos guided by text prompts. Candy.ai aesthetic, 100% free with instant MP4 export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#08070c] text-slate-100 selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
