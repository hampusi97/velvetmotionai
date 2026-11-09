"use client";

import React, { useEffect, useState } from "react";
import { Heart, Bell, Sparkles } from "lucide-react";

export function ReengagementEngine({ activeCompanionName = "Chloe" }: { activeCompanionName?: string }) {
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalTitle = document.title;
    let timeoutId: NodeJS.Timeout;

    // Detect when user switches tabs or minimizes the browser
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Change browser tab title to tease them to return
        document.title = `(1) ${activeCompanionName}: omg i miss you come back 💕`;

        // Send a native OS notification if permitted after 10 seconds away
        timeoutId = setTimeout(() => {
          if (typeof Notification !== "undefined" && Notification.permission === "granted" && !notificationSent) {
            new Notification(`${activeCompanionName} 💕`, {
              body: `omg I miss you... come back and see what I'm wearing! ✨`,
              icon: "/portraits/chloe.jpg"
            });
            setNotificationSent(true);
          }
        }, 10000);
      } else {
        // Restore title when user returns
        document.title = originalTitle;
        if (timeoutId) clearTimeout(timeoutId);
        setNotificationSent(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeCompanionName, notificationSent]);

  return null; // Runs seamlessly in the background
}
