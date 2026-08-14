/**
 * AppButton
 * Primary interaction button with spring-scale press animation,
 * loading state particle spinner, and world-aware accent theming.
 */

import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { defaultTheme } from '../../theme/worldThemes';
import { haptics } from '../../utils/haptics';
import type { ResolvedWorldTheme } from '../../theme/worldThemes';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  worldTheme?: ResolvedWorldTheme;
  style?: ViewStyle;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  worldTheme = defaultTheme,
  style,
  fullWidth = false,
  icon,
}: AppButtonProps) {
  const handlePress = useCallback(() => {
    if (loading || disabled) return;
    haptics.tap();
    onPress();
  }, [loading, disabled, onPress]);

  const resolvedStyles = getVariantStyles(variant, worldTheme, disabled);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        resolvedStyles.container,
        fullWidth && styles.fullWidth,
        style,
        { transform: [{ scale: pressed && !disabled && !loading ? 0.96 : 1 }] }
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={resolvedStyles.textColor}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              typography.buttonText,
              { color: resolvedStyles.textColor },
              icon ? { marginLeft: spacing.sm } : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

function getVariantStyles(
  variant: ButtonVariant,
  theme: ResolvedWorldTheme,
  disabled: boolean,
): { container: ViewStyle; textColor: string } {
  const opacity = disabled ? 0.4 : 1;

  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: theme.accent,
          opacity,
        },
        textColor: '#0B132B',
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.accent,
          opacity,
        },
        textColor: theme.accent,
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
          opacity,
        },
        textColor: theme.textMuted,
      };
    case 'danger':
      return {
        container: {
          backgroundColor: '#FF4C4C',
          opacity,
        },
        textColor: '#FFFFFF',
      };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
});
