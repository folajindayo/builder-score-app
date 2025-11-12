"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/Switch";
import { useLocalStorage } from "@/lib/use-local-storage";

export function DarkModeToggle() {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("darkMode", false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
      <Switch
        checked={darkMode}
        onChange={setDarkMode}
        size="md"
      />
    </div>
  );
}

