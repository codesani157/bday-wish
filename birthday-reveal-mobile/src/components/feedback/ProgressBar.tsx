import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ResolvedWorldTheme } from '../../theme/worldThemes';

interface ProgressBarProps {
  progress: number; // 0 to 1
  worldTheme: ResolvedWorldTheme;
}

export function ProgressBar({ progress, worldTheme }: ProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: progress,
      useNativeDriver: false, // width animation requires false
      bounciness: 0,
    }).start();
  }, [progress, animatedWidth]);

  return (
    <View style={[styles.track, { backgroundColor: worldTheme.colors.cardBorder }]}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: worldTheme.colors.primary,
            width: animatedWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
