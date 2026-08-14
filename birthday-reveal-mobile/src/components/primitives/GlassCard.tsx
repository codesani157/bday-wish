/**
 * GlassCard
 * Core glassmorphism container used across all screens.
 * Adapts to the active World theme via props.
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { radius, shadows } from '../../theme/spacing';
import { defaultTheme } from '../../theme/worldThemes';
import type { ResolvedWorldTheme } from '../../theme/worldThemes';

interface GlassCardProps {
  children: React.ReactNode;
  worldTheme?: ResolvedWorldTheme;
  style?: ViewStyle;
  variant?: 'standard' | 'elevated' | 'subtle';
  noPadding?: boolean;
}

export function GlassCard({
  children,
  worldTheme = defaultTheme,
  style,
  variant = 'standard',
  noPadding = false,
}: GlassCardProps) {
  const variantStyles: Record<string, ViewStyle> = {
    standard: {
      backgroundColor: worldTheme.glass.background,
      borderColor: worldTheme.glass.borderColor,
      borderWidth: 1,
      ...shadows.medium,
    },
    elevated: {
      backgroundColor: worldTheme.glass.background,
      borderColor: worldTheme.accent,
      borderWidth: 1.5,
      ...shadows.strong,
    },
    subtle: {
      backgroundColor: `${worldTheme.surface}40`,
      borderColor: 'transparent',
      borderWidth: 0,
      ...shadows.soft,
    },
  };

  return (
    <View
      style={[
        styles.card,
        variantStyles[variant],
        !noPadding && styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  padding: {
    padding: 20,
  },
});
