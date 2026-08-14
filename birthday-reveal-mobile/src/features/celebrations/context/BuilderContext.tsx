import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { WorldKey } from '../../../types/world';
import { resolveWorldTheme, ResolvedWorldTheme } from '../../../theme/worldThemes';
import { useCelebration, useUpdateCelebration } from '../../../hooks/useCelebrations';

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
  isSaving: boolean;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children, initialCelebrationId }: { children: ReactNode; initialCelebrationId?: string }) {
  const { data: existingCelebration } = useCelebration(initialCelebrationId || '');
  const updateMutation = useUpdateCelebration(initialCelebrationId || '');
  
  const [draft, setDraft] = useState<DraftData>({
    celebrationId: initialCelebrationId,
    name: '',
    email: '',
    birthdate: '', 
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    worldKey: 'starlight-loft',
    headline: '',
    messageBody: '',
    musicUrl: '',
    memoryPrompt: '',
    memoryAnswer: '',
  });

  // Sync draft with existing celebration when it loads
  useEffect(() => {
    if (existingCelebration) {
      setDraft(prev => ({
        ...prev,
        celebrationId: existingCelebration.id,
        name: existingCelebration.recipientName || prev.name,
        email: existingCelebration.recipientEmail || prev.email,
        headline: existingCelebration.headline || prev.headline,
        messageBody: existingCelebration.messageBody || prev.messageBody,
        musicUrl: existingCelebration.musicUrl || prev.musicUrl,
        worldKey: (existingCelebration as any).worldKey as WorldKey || prev.worldKey,
      }));
    }
  }, [existingCelebration]);

  const updateDraft = (data: Partial<DraftData>) => {
    setDraft(prev => ({ ...prev, ...data }));
  };

  // Debounced Auto-save for Step 2+ fields
  const debouncedDraft = useRef(draft);
  useEffect(() => {
    debouncedDraft.current = draft;
  }, [draft]);

  useEffect(() => {
    if (!initialCelebrationId) return; // Only auto-save if the celebration is already created
    const handler = setTimeout(() => {
      const current = debouncedDraft.current;
      updateMutation.mutate({
        headline: current.headline,
        messageBody: current.messageBody,
      });
    }, 1500);

    return () => clearTimeout(handler);
  }, [draft.headline, draft.messageBody, initialCelebrationId]);

  const worldTheme = resolveWorldTheme(draft.worldKey);

  return (
    <BuilderContext.Provider value={{ draft, updateDraft, worldTheme, isSaving: updateMutation.isPending }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilderContext() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilderContext must be used within a BuilderProvider');
  return ctx;
}
