/**
 * ScreenContainer
 * Base layout wrapper for all screens.
 * Provides safe area insets, world-themed background, and scroll control.
 */

import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { defaultTheme } from '../../theme/worldThemes';
import { layout } from '../../theme/spacing';
import type { ResolvedWorldTheme } from '../../theme/worldThemes';

interface ScreenContainerProps {
  children: React.ReactNode;
  worldTheme?: ResolvedWorldTheme;
  scrollable?: boolean;
  padded?: boolean;
  footer?: React.ReactNode;
  style?: ViewStyle;
  statusBarStyle?: 'light' | 'dark';
}

export function ScreenContainer({
  children,
  worldTheme = defaultTheme,
  scrollable = true,
  padded = true,
  footer,
  style,
  statusBarStyle = 'light',
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: worldTheme.bgPrimary,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };

  const contentStyle: ViewStyle = padded
    ? { paddingHorizontal: layout.screenPaddingH }
    : {};

  if (scrollable) {
    return (
      <View style={[containerStyle, style]}>
        <StatusBar style={statusBarStyle} />
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {footer && <View style={[styles.footer, contentStyle]}>{footer}</View>}
      </View>
    );
  }

  return (
    <View style={[containerStyle, contentStyle, style]}>
      <StatusBar style={statusBarStyle} />
      {children}
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 16,
  },
});
