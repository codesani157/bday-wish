/**
 * InlineAlert
 * Dynamic status message strip for auth flows, upload feedback, and errors.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from '../primitives/AppText';
import { palette } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface InlineAlertProps {
  message: string;
  variant?: AlertVariant;
  style?: ViewStyle;
}

const variantStyles: Record<AlertVariant, { bg: string; text: string; icon: string }> = {
  info: { bg: 'rgba(0, 240, 255, 0.08)', text: '#00F0FF', icon: 'ℹ️' },
  success: { bg: palette.successSoft, text: palette.success, icon: '✓' },
  warning: { bg: palette.warningSoft, text: palette.warning, icon: '⚠️' },
  error: { bg: palette.errorSoft, text: palette.error, icon: '✕' },
};

export function InlineAlert({ message, variant = 'info', style }: InlineAlertProps) {
  const config = variantStyles[variant];

  return (
    <View style={[styles.container, { backgroundColor: config.bg }, style]}>
      <AppText variant="uiLabelSmall" color={config.text} style={styles.icon}>
        {config.icon}
      </AppText>
      <AppText variant="bodySmall" color={config.text} style={styles.message}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginVertical: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
  },
});
