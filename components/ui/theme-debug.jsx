"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeDebug() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-4 shadow-lg z-50">
      <div className="text-sm">
        <p>Current theme: <strong>{theme}</strong></p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setTheme("light")}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Dark
          </button>
          <button
            onClick={() => setTheme("system")}
            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
          >
            System
          </button>
        </div>
      </div>
    </div>
  );
}
