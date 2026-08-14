/**
 * AppTextField
 * Input with floating label, active glow border, and validation states.
 * Adapts to World theme accent color for focus glow.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  Animated,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { typography } from '../../theme/typography';
import { palette } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { defaultTheme } from '../../theme/worldThemes';
import type { ResolvedWorldTheme } from '../../theme/worldThemes';

interface AppTextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  hint?: string;
  worldTheme?: ResolvedWorldTheme;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export function AppTextField({
  label,
  value,
  onChangeText,
  error,
  hint,
  worldTheme = defaultTheme,
  containerStyle,
  required = false,
  ...textInputProps
}: AppTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [labelAnim, glowAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    Animated.timing(glowAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, labelAnim, glowAnim]);

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -8],
  });

  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const borderColor = error
    ? palette.error
    : isFocused
    ? worldTheme.accent
    : `${worldTheme.textMuted}40`;

  const glowShadow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            shadowColor: error ? palette.error : worldTheme.accent,
            shadowRadius: glowShadow as unknown as number,
            shadowOpacity: isFocused ? 0.3 : 0,
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.label,
            {
              top: labelTop as unknown as number,
              fontSize: labelFontSize as unknown as number,
              color: error
                ? palette.error
                : isFocused
                ? worldTheme.accent
                : worldTheme.textMuted,
            },
          ]}
        >
          {label}
          {required && ' *'}
        </Animated.Text>
        <TextInput
          style={[
            styles.input,
            { color: worldTheme.textMain },
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={`${worldTheme.textMuted}60`}
          selectionColor={worldTheme.accent}
          {...textInputProps}
        />
      </Animated.View>
      {error && (
        <Text style={[styles.errorText, { color: palette.error }]}>
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text style={[styles.hintText, { color: worldTheme.textMuted }]}>
          {hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    position: 'relative',
    minHeight: 56,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  simpleInputWrapper: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    justifyContent: 'center',
    minHeight: 48,
  },
  label: {
    position: 'absolute',
    left: spacing.base,
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    ...typography.uiLabelSmall,
    textTransform: 'none',
  },
  simpleLabel: {
    ...typography.uiLabelSmall,
    marginBottom: spacing.xs,
    textTransform: 'none',
  },
  input: {
    ...typography.bodySmall,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    fontSize: 16,
  },
  errorText: {
    ...typography.uiLabelSmall,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
    textTransform: 'none',
  },
  hintText: {
    ...typography.uiLabelSmall,
    textTransform: 'none',
  },
});

export function AppTextFieldSimple({
  label,
  value,
  onChangeText,
  error,
  hint,
  worldTheme = defaultTheme,
  containerStyle,
  required = false,
  ...textInputProps
}: AppTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? palette.error
    : isFocused
    ? worldTheme.accent
    : `${worldTheme.textMuted}40`;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.simpleLabel, { color: error ? palette.error : isFocused ? worldTheme.accent : worldTheme.textMuted }]}>
        {label}{required && ' *'}
      </Text>
      <View
        style={[
          styles.simpleInputWrapper,
          {
            borderColor,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: worldTheme.textMain }]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={`${worldTheme.textMuted}60`}
          selectionColor={worldTheme.accent}
          {...textInputProps}
        />
      </View>
      {error && (
        <Text style={[styles.errorText, { color: palette.error }]}>
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text style={[styles.hintText, { color: worldTheme.textMuted }]}>
          {hint}
        </Text>
      )}
    </View>
  );
}

AppTextField.Simple = AppTextFieldSimple;
