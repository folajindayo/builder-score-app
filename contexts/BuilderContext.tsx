/**
 * Builder Context
 */

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Builder } from '../lib/types/builder.types';

interface BuilderContextType {
  currentBuilder: Builder | null;
  setCurrentBuilder: (builder: Builder | null) => void;
  searchResults: Builder[];
  setSearchResults: (results: Builder[]) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [currentBuilder, setCurrentBuilder] = useState<Builder | null>(null);
  const [searchResults, setSearchResults] = useState<Builder[]>([]);

  const value = {
    currentBuilder,
    setCurrentBuilder,
    searchResults,
    setSearchResults,
  };

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilderContext() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilderContext must be used within BuilderProvider');
  }
  return context;
}

