/**
 * StatusBadge
 * Color-coded pill for celebration status indicators.
 * Used in Dashboard list items and Celebration Detail headers.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { palette } from '../../theme/colors';
import type { CelebrationStatus } from '../../types/celebration';

interface StatusBadgeProps {
  status: CelebrationStatus;
  style?: ViewStyle;
}

const statusConfig: Record<CelebrationStatus, { label: string; bg: string; text: string }> = {
  draft: { label: 'Draft', bg: 'rgba(247, 208, 112, 0.15)', text: '#F7D070' },
  sealed: { label: 'Sealed', bg: 'rgba(78, 250, 175, 0.15)', text: '#4EFAAF' },
  sending: { label: 'Sending', bg: 'rgba(78, 250, 175, 0.15)', text: '#4EFAAF' },
  delivered: { label: 'Delivered', bg: 'rgba(78, 250, 175, 0.20)', text: '#4EFAAF' },
  opened: { label: 'Opened', bg: 'rgba(0, 240, 255, 0.15)', text: '#00F0FF' },
  completed: { label: 'Completed', bg: 'rgba(78, 250, 175, 0.25)', text: '#4EFAAF' },
  delivery_failed: { label: 'Failed', bg: 'rgba(255, 76, 76, 0.15)', text: '#FF4C4C' },
  cancelled: { label: 'Cancelled', bg: 'rgba(255, 255, 255, 0.08)', text: 'rgba(255,255,255,0.4)' },
};

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, style]}>
      <Text style={[styles.text, { color: config.text }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.uiLabelSmall,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
