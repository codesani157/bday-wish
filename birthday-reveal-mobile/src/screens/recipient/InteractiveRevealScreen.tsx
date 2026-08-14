/**
 * InteractiveRevealScreen (Screen 4.19)
 * Multi-layer gesture-driven unboxing — 2D representation of the 3D reveal.
 */

import React, { useState, useRef } from 'react';
import { View, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { GlassCard } from '../../components/primitives/GlassCard';
import { AppText } from '../../components/primitives/AppText';
import { AppButton } from '../../components/primitives/AppButton';
import { defaultTheme } from '../../theme/worldThemes';
import { haptics } from '../../utils/haptics';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'InteractiveReveal'>;

type RevealLayer = 'wrapped' | 'greeting' | 'photos' | 'complete';

export function InteractiveRevealScreen({ navigation, route }: Props) {
  const [layer, setLayer] = useState<RevealLayer>('wrapped');
  const transitionAnim = useRef(new Animated.Value(1)).current;

  const advanceLayer = (next: RevealLayer) => {
    haptics.swipe();
    Animated.sequence([
      Animated.timing(transitionAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(transitionAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setLayer(next), 300);
  };

  return (
    <ScreenContainer worldTheme={defaultTheme} scrollable={false}>
      <Animated.View style={[styles.stage, { opacity: transitionAnim }]}>
        {layer === 'wrapped' && (
          <View style={styles.layerCenter}>
            <AppText style={{ fontSize: 100 }}>🎁</AppText>
            <AppText variant="sectionTitleH2" worldTheme={defaultTheme} align="center" style={{ marginTop: 24 }}>
              Tap to unwrap your gift
            </AppText>
            <AppButton title="Unwrap ✨" onPress={() => advanceLayer('greeting')} worldTheme={defaultTheme} style={{ marginTop: 24 }} />
          </View>
        )}

        {layer === 'greeting' && (
          <View style={styles.layerCenter}>
            <GlassCard worldTheme={defaultTheme} variant="elevated" style={{ maxWidth: 340 }}>
              <AppText variant="headlineH1" worldTheme={defaultTheme} align="center" style={{ marginBottom: 16 }}>
                Happy Birthday Maya! 🎂
              </AppText>
              <AppText variant="bodyMessage" worldTheme={defaultTheme} align="center">
                You are the most incredible person I know. Every moment with you is a gift, and today the world celebrates YOU. Here's to another year of magic, laughter, and unforgettable memories together. ✨
              </AppText>
            </GlassCard>
            <AppButton title="See Your Memories →" onPress={() => advanceLayer('photos')} worldTheme={defaultTheme} style={{ marginTop: 24 }} />
          </View>
        )}

        {layer === 'photos' && (
          <View style={styles.layerCenter}>
            <View style={styles.photoScatter}>
              {['📷', '📸', '🖼️', '📷'].map((emoji, i) => (
                <Pressable key={i} onPress={() => haptics.select()} style={[styles.scatteredPhoto, { transform: [{ rotate: `${(i - 2) * 8}deg` }] }]}>
                  <AppText style={{ fontSize: 48 }}>{emoji}</AppText>
                </Pressable>
              ))}
            </View>
            <AppText variant="sectionTitleH2" worldTheme={defaultTheme} align="center" style={{ marginTop: 16 }}>
              Your Memories
            </AppText>
            <AppText variant="bodySmall" worldTheme={defaultTheme} muted align="center">
              Tap photos to zoom in
            </AppText>
            <AppButton title="Continue to Celebration 🎉" onPress={() => navigation.replace('CelebrationApex', { token: route.params.token })} worldTheme={defaultTheme} style={{ marginTop: 24 }} />
          </View>
        )}
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, justifyContent: 'center' },
  layerCenter: { alignItems: 'center', paddingHorizontal: 20 },
  photoScatter: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  scatteredPhoto: { width: 90, height: 90, backgroundColor: 'rgba(247,208,112,0.08)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
