import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface CenteredStageProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * A reusable layout for screens that display a centered glass card on a dark stage.
 * Examples: Auth, Loading, Sealing, Memory Gate.
 */
export function CenteredStage({ children, footer, style }: CenteredStageProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.centerContent}>
        {children}
      </View>
      {footer && (
        <View style={styles.footer}>
          {footer}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
  }
});
