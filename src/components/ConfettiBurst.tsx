
import React, { useEffect } from "react";

export default function ConfettiBurst({ run }: { run: boolean }) {
  useEffect(() => {
    if (run) {
      (async () => {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.7 },
          angle: 90,
          scalar: 1.1,
          colors: ["#7C3AED", "#04B971", "#F1F5F9", "#E2E8F0"],
        });
      })();
    }
  }, [run]);
  return null;
}
