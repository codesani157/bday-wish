/**
 * LandingScreen
 * Interactive hero gateway with 3D gift box placeholder,
 * glassmorphism navbar, and feature step cards.
 */

import React, { useRef, useEffect } from 'react';
import { View, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { GlassCard } from '../../components/primitives/GlassCard';
import { AppButton } from '../../components/primitives/AppButton';
import { AppText } from '../../components/primitives/AppText';
import { defaultTheme } from '@/theme/worldThemes';
import { spacing, radius, shadows } from '@/theme/spacing';
import { palette } from '@/theme/colors';
import { haptics } from '../../utils/haptics';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const { width } = Dimensions.get('window');

const FEATURE_STEPS = [
  { step: '01', title: 'Choose a World', desc: 'Pick a spatial environment with unique physics' },
  { step: '02', title: 'Assemble the Gift', desc: 'Drop photos, messages, and hidden surprises' },
  { step: '03', title: 'They Unwrap It', desc: 'A physics-powered 3D birthday experience' },
];

export function LandingScreen({ navigation }: Props) {
  const giftFloat = useRef(new Animated.Value(0)).current;
  const giftRotate = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gift box floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(giftFloat, { toValue: -12, duration: 2000, useNativeDriver: true }),
        Animated.timing(giftFloat, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ]),
    ).start();

    // Gentle rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(giftRotate, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(giftRotate, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ]),
    ).start();

    // Content fade in
    Animated.timing(fadeIn, { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }).start();
  }, [giftFloat, giftRotate, fadeIn]);

  const rotateInterpolate = giftRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });

  const handleBuildPress = () => {
    haptics.tap();
    navigation.navigate('MagicLinkRequest');
  };

  return (
    <ScreenContainer worldTheme={defaultTheme}>
      {/* ─── Glass Navbar ─── */}
      <View style={styles.navbar}>
        <AppText variant="buttonText" worldTheme={defaultTheme}>
          🎁 Birthday Reveal
        </AppText>
        <Pressable onPress={() => navigation.navigate('MagicLinkRequest')}>
          <AppText variant="uiLabel" worldTheme={defaultTheme} accent>
            Sign In
          </AppText>
        </Pressable>
      </View>

      {/* ─── Hero Canvas Area ─── */}
      <Animated.View style={[styles.heroArea, { opacity: fadeIn }]}>
        <Animated.View
          style={[
            styles.giftBox,
            {
              transform: [
                { translateY: giftFloat },
                { rotate: rotateInterpolate },
              ],
            },
          ]}
        >
          <View style={styles.giftVisual}>
            <AppText variant="displayHero" align="center" style={styles.giftEmoji}>
              🎁
            </AppText>
          </View>
        </Animated.View>

        {/* ─── Hero Copy ─── */}
        <AppText
          variant="headlineH1"
          worldTheme={defaultTheme}
          align="center"
          style={styles.heroTitle}
        >
          A World Built for{'\n'}One Person
        </AppText>

        <AppText
          variant="bodyMessage"
          worldTheme={defaultTheme}
          muted
          align="center"
          style={styles.heroSubtitle}
        >
          Unwrap a spatially simulated birthday universe.
        </AppText>

        {/* ─── CTA ─── */}
        <AppButton
          title="Build a Birthday Surprise"
          onPress={handleBuildPress}
          worldTheme={defaultTheme}
          fullWidth
          style={styles.ctaButton}
        />
      </Animated.View>

      {/* ─── Feature Steps ─── */}
      <View style={styles.stepsContainer}>
        {FEATURE_STEPS.map((item, index) => (
          <GlassCard
            key={item.step}
            worldTheme={defaultTheme}
            variant="subtle"
            style={styles.stepCard}
          >
            <AppText variant="uiLabel" worldTheme={defaultTheme} accent>
              {item.step}
            </AppText>
            <AppText
              variant="buttonText"
              worldTheme={defaultTheme}
              style={styles.stepTitle}
            >
              {item.title}
            </AppText>
            <AppText variant="bodySmall" worldTheme={defaultTheme} muted>
              {item.desc}
            </AppText>
          </GlassCard>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
  },
  heroArea: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  giftBox: {
    marginBottom: spacing.xxl,
  },
  giftVisual: {
    width: 120,
    height: 120,
    borderRadius: radius.xxl,
    backgroundColor: 'rgba(247, 208, 112, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow(palette.loft.accentAmber),
  },
  giftEmoji: {
    fontSize: 64,
  },
  heroTitle: {
    marginBottom: spacing.md,
  },
  heroSubtitle: {
    marginBottom: spacing.xxl,
    maxWidth: 280,
  },
  ctaButton: {
    maxWidth: 320,
  },
  stepsContainer: {
    gap: spacing.md,
    marginTop: spacing.xl,
    paddingBottom: spacing.huge,
  },
  stepCard: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
  },
  stepTitle: {
    marginVertical: spacing.xs,
  },
});
