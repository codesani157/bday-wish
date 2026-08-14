/**
 * CelebrationApexScreen (Screen 4.20)
 * Emotional climax with confetti, name display, and replay sandbox.
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppText } from '../../components/primitives/AppText';
import { AppButton } from '../../components/primitives/AppButton';
import { defaultTheme } from '../../theme/worldThemes';
import { haptics } from '../../utils/haptics';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CelebrationApex'>;

const { width } = Dimensions.get('window');

const CONFETTI = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  emoji: ['🌟', '✨', '🎉', '🎊', '💫', '⭐'][i % 6],
  left: Math.random() * width,
  delay: Math.random() * 2000,
  duration: 2000 + Math.random() * 1500,
}));

export function CelebrationApexScreen({ navigation, route }: Props) {
  const confettiAnims = useRef(CONFETTI.map(() => new Animated.Value(0))).current;
  const titleScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    haptics.celebrate();

    Animated.spring(titleScale, { toValue: 1, useNativeDriver: true, speed: 6, bounciness: 12 }).start();

    confettiAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: CONFETTI[i].duration,
          delay: CONFETTI[i].delay,
          useNativeDriver: true,
        }),
      ).start();
    });
  }, [confettiAnims, titleScale]);

  return (
    <ScreenContainer worldTheme={defaultTheme} scrollable={false}>
      {/* Confetti Layer */}
      {CONFETTI.map((item, i) => {
        const translateY = confettiAnims[i].interpolate({ inputRange: [0, 1], outputRange: [-50, 800] });
        const rotate = confettiAnims[i].interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
        return (
          <Animated.Text
            key={item.id}
            style={[styles.confetti, { left: item.left, transform: [{ translateY }, { rotate }] }]}
          >
            {item.emoji}
          </Animated.Text>
        );
      })}

      {/* Main Content */}
      <View style={styles.centered}>
        <Animated.View style={{ transform: [{ scale: titleScale }] }}>
          <AppText variant="displayHero" worldTheme={defaultTheme} accent align="center">
            🎉 HAPPY BIRTHDAY{'\n'}MAYA! 🎉
          </AppText>
        </Animated.View>

        <View style={styles.actions}>
          <AppButton
            title="↺ Replay Experience"
            onPress={() => {
              haptics.tap();
              navigation.replace('CinematicEntry', { token: route.params.token });
            }}
            variant="secondary"
            worldTheme={defaultTheme}
            fullWidth
            style={{ marginBottom: 8 }}
          />
          <AppButton
            title="🔍 Explore World"
            onPress={() => haptics.shakeEgg()}
            variant="ghost"
            worldTheme={defaultTheme}
            fullWidth
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  actions: { marginTop: 48, width: '100%' },
  confetti: { position: 'absolute', fontSize: 24, zIndex: 10 },
});
