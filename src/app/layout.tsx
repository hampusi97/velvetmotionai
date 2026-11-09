import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VelvetMotion AI - Turn Photos into Cinematic Videos",
  description: "Ultra-luxury companion studio with HD voice calls, motion video, and photo vaults.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VelvetMotion"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#FF007F" />
        <link rel="apple-touch-icon" href="/manifest.json" />
      </head>
      <body className="bg-midnight min-h-screen text-slate-100 selection:bg-neonPink selection:text-white">
        <div className="fixed top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-neonPurple/15 blur-[120px] pointer-events-none" />
        <div className="fixed top-1/3 right-10 -z-10 h-96 w-96 rounded-full bg-neonPink/15 blur-[130px] pointer-events-none" />
        <div className="fixed bottom-0 left-1/3 -z-10 h-96 w-96 rounded-full bg-neonFuchsia/10 blur-[140px] pointer-events-none" />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
