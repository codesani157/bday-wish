/**
 * PreBirthdayCountdownScreen (Screen 4.16)
 * Early open state with bouncy sealed gift and countdown clock.
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppText } from '../../components/primitives/AppText';
import { defaultTheme } from '../../theme/worldThemes';
import { haptics } from '../../utils/haptics';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PreBirthdayCountdown'>;

export function PreBirthdayCountdownScreen({ route }: Props) {
  const { countdownTo } = route.params;
  const [remaining, setRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(countdownTo).getTime() - Date.now());
      setRemaining({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [countdownTo]);

  const handleTapGift = () => {
    haptics.tap();
    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: 1.15, useNativeDriver: true, speed: 40 }),
      Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }),
    ]).start();
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <ScreenContainer worldTheme={defaultTheme} scrollable={false}>
      <View style={styles.centered}>
        <Pressable onPress={handleTapGift}>
          <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
            <AppText variant="displayHero" align="center" style={{ fontSize: 100 }}>🎁</AppText>
          </Animated.View>
        </Pressable>

        <AppText variant="headlineH1" worldTheme={defaultTheme} align="center" style={{ marginTop: 32, marginBottom: 16 }}>
          Your surprise is locked{'\n'}until your birthday!
        </AppText>

        <View style={styles.countdownRow}>
          {[
            { val: pad(remaining.hours), label: 'Hours' },
            { val: pad(remaining.minutes), label: 'Min' },
            { val: pad(remaining.seconds), label: 'Sec' },
          ].map((item) => (
            <View key={item.label} style={styles.countdownBlock}>
              <AppText variant="displayHero" worldTheme={defaultTheme} accent align="center">{item.val}</AppText>
              <AppText variant="uiLabelSmall" worldTheme={defaultTheme} muted align="center">{item.label}</AppText>
            </View>
          ))}
        </View>

        <AppText variant="bodySmall" worldTheme={defaultTheme} muted align="center" style={{ marginTop: 24 }}>
          Tap the gift to make it bounce! 🎉
        </AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  countdownRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  countdownBlock: { alignItems: 'center', minWidth: 70 },
});
