"use client";

import React, { ReactNode } from "react";
import { ScoreProvider } from "@/contexts/ScoreContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <ScoreProvider>
        {children}
      </ScoreProvider>
    </ThemeProvider>
  );
}

