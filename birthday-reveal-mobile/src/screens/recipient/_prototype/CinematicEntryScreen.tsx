/**
 * CinematicEntryScreen (Screen 4.17)
 * Camera swoop arrival with 3D name reveal — simplified 2D version.
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppText } from '../../components/primitives/AppText';
import { defaultTheme } from '../../theme/worldThemes';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CinematicEntry'>;

export function CinematicEntryScreen({ navigation, route }: Props) {
  const swoopAnim = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const giftScale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(swoopAnim, { toValue: 1, duration: 2000, easing: Easing.bezier(0.25, 1, 0.5, 1), useNativeDriver: true }),
      Animated.timing(nameOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(giftScale, { toValue: 1, useNativeDriver: true, speed: 8, bounciness: 10 }),
    ]).start(() => {
      setTimeout(() => navigation.replace('InteractiveReveal', { token: route.params.token }), 1500);
    });
  }, [swoopAnim, nameOpacity, giftScale, navigation, route.params.token]);

  const translateY = swoopAnim.interpolate({ inputRange: [0, 1], outputRange: [-200, 0] });
  const scale = swoopAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <ScreenContainer worldTheme={defaultTheme} scrollable={false}>
      <View style={styles.centered}>
        <Animated.View style={{ transform: [{ translateY }, { scale }], opacity: swoopAnim }}>
          <Animated.View style={{ opacity: nameOpacity }}>
            <AppText variant="displayHero" worldTheme={defaultTheme} accent align="center" style={{ marginBottom: 24 }}>
              HAPPY BIRTHDAY{'\n'}MAYA
            </AppText>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: giftScale }], alignItems: 'center' }}>
            <AppText style={{ fontSize: 80 }}>🎁</AppText>
          </Animated.View>
        </Animated.View>

        <AppText variant="uiLabel" worldTheme={defaultTheme} muted align="center" style={{ position: 'absolute', bottom: 80 }}>
          Swipe Up to Unwrap ▲
        </AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
