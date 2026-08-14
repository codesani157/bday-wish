/**
 * StepWizardHeader
 * Step progress indicator used across all Gift Builder steps (1-5).
 * Shows step number, title, back navigation, and auto-save status.
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from '../primitives/AppText';
import { spacing, radius } from '../../theme/spacing';
import { ProgressBar } from '../feedback/ProgressBar';
import { defaultTheme } from '../../theme/worldThemes';
import type { ResolvedWorldTheme } from '../../theme/worldThemes';

interface StepWizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  onBack?: () => void;
  autoSaveStatus?: 'idle' | 'saving' | 'saved';
  worldTheme?: ResolvedWorldTheme;
}

export function StepWizardHeader({
  currentStep,
  totalSteps,
  title,
  onBack,
  autoSaveStatus = 'idle',
  worldTheme = defaultTheme,
}: StepWizardHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Top row: Back + Step indicator + Auto-save */}
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton}>
            <AppText variant="uiLabel" worldTheme={worldTheme}>
              ← Back
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.backButton} />
        )}

        <AppText variant="uiLabelSmall" worldTheme={worldTheme} muted>
          Step {currentStep} of {totalSteps}
        </AppText>

        {autoSaveStatus !== 'idle' && (
          <AppText variant="uiLabelSmall" worldTheme={worldTheme} accent>
            {autoSaveStatus === 'saving' ? '● Saving...' : '✓ Saved'}
          </AppText>
        )}
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrackWrapper}>
        <ProgressBar progress={currentStep / totalSteps} worldTheme={worldTheme} />
      </View>

      {/* Title */}
      <AppText
        variant="sectionTitleH2"
        worldTheme={worldTheme}
        style={styles.title}
      >
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    minWidth: 60,
  },
  progressTrackWrapper: {
    marginBottom: spacing.base,
  },
  title: {
    marginTop: spacing.xs,
  },
});
