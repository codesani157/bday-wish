import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorldKey } from '../../../types/world';
import { resolveWorldTheme, ResolvedWorldTheme } from '../../../theme/worldThemes';
import { mockCelebrations } from '../../../data/mockData';
import { Celebration } from '../../../types/celebration';

interface DraftData {
  celebrationId?: string;
  name: string;
  email: string;
  birthdate: string;
  timezone: string;
  worldKey: WorldKey;
  headline: string;
  messageBody: string;
  musicUrl: string;
  memoryPrompt: string;
  memoryAnswer: string;
}

interface BuilderContextType {
  draft: DraftData;
  updateDraft: (data: Partial<DraftData>) => void;
  worldTheme: ResolvedWorldTheme;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children, initialCelebrationId }: { children: ReactNode; initialCelebrationId?: string }) {
  const existing = initialCelebrationId ? mockCelebrations.find((c: any) => c.id === initialCelebrationId) : null;
  
  const [draft, setDraft] = useState<DraftData>({
    celebrationId: initialCelebrationId,
    name: existing?.recipientName || '',
    email: '', // Not in mockData directly
    birthdate: '', 
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    worldKey: existing?.worldKey as WorldKey || 'starlight-loft',
    headline: '',
    messageBody: '',
    musicUrl: '',
    memoryPrompt: '',
    memoryAnswer: '',
  });

  const updateDraft = (data: Partial<DraftData>) => {
    setDraft(prev => ({ ...prev, ...data }));
  };

  const worldTheme = resolveWorldTheme(draft.worldKey);

  return (
    <BuilderContext.Provider value={{ draft, updateDraft, worldTheme }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilderContext() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilderContext must be used within a BuilderProvider');
  return ctx;
}
