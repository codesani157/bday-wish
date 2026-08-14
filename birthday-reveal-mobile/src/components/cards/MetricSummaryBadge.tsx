/**
 * MetricSummaryBadge
 * Counter pill for the dashboard summary strip.
 * Shows count + label with world-themed background tint.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from '../primitives/AppText';
import { spacing, radius } from '../../theme/spacing';
import { defaultTheme } from '../../theme/worldThemes';
import type { ResolvedWorldTheme } from '../../theme/worldThemes';

interface MetricSummaryBadgeProps {
  label: string;
  count: number;
  worldTheme?: ResolvedWorldTheme;
  isActive?: boolean;
  style?: ViewStyle;
}

export function MetricSummaryBadge({
  label,
  count,
  worldTheme = defaultTheme,
  isActive = false,
  style,
}: MetricSummaryBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isActive ? `${worldTheme.accent}20` : `${worldTheme.textMuted}10`,
          borderColor: isActive ? `${worldTheme.accent}40` : 'transparent',
        },
        style,
      ]}
    >
      <AppText
        variant="sectionTitleH2"
        worldTheme={worldTheme}
        accent={isActive}
        style={styles.count}
      >
        {count}
      </AppText>
      <AppText
        variant="uiLabelSmall"
        worldTheme={worldTheme}
        muted={!isActive}
        accent={isActive}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
  },
  count: {
    marginBottom: spacing.xxs,
  },
});
