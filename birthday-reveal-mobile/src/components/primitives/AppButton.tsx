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
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  }, [scale]);

  const handlePress = useCallback(() => {
    if (loading || disabled) return;
    haptics.tap();
    onPress();
  }, [loading, disabled, onPress]);

  const resolvedStyles = getVariantStyles(variant, worldTheme, disabled);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.base,
          resolvedStyles.container,
          fullWidth && styles.fullWidth,
          style,
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
    </Animated.View>
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
