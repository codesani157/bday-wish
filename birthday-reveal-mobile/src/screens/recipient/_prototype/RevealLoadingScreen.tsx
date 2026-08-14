/**
 * RevealLoadingScreen (Screen 4.15)
 * Pre-load boot sequence with atmospheric curtain and progress bar.
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppText } from '../../components/primitives/AppText';
import { StatusSpinner } from '../../components/feedback/StatusSpinner';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { defaultTheme } from '../../theme/worldThemes';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RevealLoading'>;

export function RevealLoadingScreen({ navigation, route }: Props) {
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 15, 100);
        Animated.timing(progressAnim, { toValue: next / 100, duration: 300, useNativeDriver: false }).start();
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => navigation.replace('CinematicEntry', { token: route.params.token }), 800);
        }
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [navigation, route.params.token, progressAnim]);

  const width = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <ScreenContainer worldTheme={defaultTheme} scrollable={false}>
      {__DEV__ && (
        <InlineAlert message="[DEV] API is mocked. Simulating asset preload." variant="warning" />
      )}
      <View style={styles.centered}>
        <StatusSpinner size={48} worldTheme={defaultTheme} style={{ marginBottom: 32 }} />
        <AppText variant="sectionTitleH2" worldTheme={defaultTheme} align="center" style={{ marginBottom: 8 }}>
          Building your world...
        </AppText>
        <AppText variant="bodySmall" worldTheme={defaultTheme} accent align="center" style={{ marginBottom: 24 }}>
          {Math.round(progress)}%
        </AppText>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: width as any }]} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  track: { width: '100%', height: 3, backgroundColor: 'rgba(247,208,112,0.12)', borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#F7D070', borderRadius: 999 },
});
