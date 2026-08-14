/**
 * AppCheckbox
 * A reusable checkbox primitive that respects worldThemes.
 */

import React from 'react';
import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { defaultTheme } from '../../theme/worldThemes';
import { spacing, radius } from '../../theme/spacing';
import { haptics } from '../../utils/haptics';
import type { ResolvedWorldTheme } from '../../theme/worldThemes';

interface AppCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  worldTheme?: ResolvedWorldTheme;
  style?: ViewStyle;
}

export function AppCheckbox({
  label,
  checked,
  onChange,
  worldTheme = defaultTheme,
  style,
}: AppCheckboxProps) {
  const handlePress = () => {
    haptics.select();
    onChange(!checked);
  };

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={handlePress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? worldTheme.accent : worldTheme.glass.borderColor,
            backgroundColor: checked ? worldTheme.accent : 'transparent',
          },
        ]}
      >
        {checked && <AppText style={styles.checkmark}>✓</AppText>}
      </View>
      <AppText variant="buttonText" worldTheme={worldTheme}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
