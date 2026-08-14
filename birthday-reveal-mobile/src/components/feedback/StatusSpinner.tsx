/**
 * StatusSpinner
 * Physics-inspired orbiting loading animation used in verification screens.
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, ViewStyle } from 'react-native';
import { defaultTheme } from '../../theme/worldThemes';
import type { ResolvedWorldTheme } from '../../theme/worldThemes';

interface StatusSpinnerProps {
  size?: number;
  worldTheme?: ResolvedWorldTheme;
  style?: ViewStyle;
}

export function StatusSpinner({
  size = 48,
  worldTheme = defaultTheme,
  style,
}: StatusSpinnerProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const rotateLoop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.15,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.8,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    rotateLoop.start();
    pulseLoop.start();

    return () => {
      rotateLoop.stop();
      pulseLoop.stop();
    };
  }, [rotation, pulse]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: worldTheme.accent,
            transform: [{ rotate: rotateInterpolate }, { scale: pulse }],
          },
        ]}
      />
      <View
        style={[
          styles.dot,
          {
            width: size * 0.2,
            height: size * 0.2,
            borderRadius: size * 0.1,
            backgroundColor: worldTheme.accent,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    borderWidth: 2.5,
    borderTopColor: 'transparent',
    position: 'absolute',
  },
  dot: {
    position: 'absolute',
  },
});
