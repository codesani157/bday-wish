/**
 * System Screens (Screens 4.22 + 4.23)
 * Generic error and 404 fallbacks.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { GlassCard } from '../../components/primitives/GlassCard';
import { AppText } from '../../components/primitives/AppText';
import { AppButton } from '../../components/primitives/AppButton';
import { defaultTheme } from '../../theme/worldThemes';
import type { RootStackParamList } from '../../types/navigation';

type ErrorProps = NativeStackScreenProps<RootStackParamList, 'GenericError'>;
type NotFoundProps = NativeStackScreenProps<RootStackParamList, 'NotFound'>;

export function GenericErrorScreen({ navigation, route }: ErrorProps) {
  return (
    <ScreenContainer worldTheme={defaultTheme} scrollable={false}>
      <View style={styles.centered}>
        <GlassCard worldTheme={defaultTheme}>
          <AppText style={styles.icon}>⚠️</AppText>
          <AppText variant="sectionTitleH2" worldTheme={defaultTheme} align="center" style={{ marginBottom: 12 }}>
            Something went wrong
          </AppText>
          <AppText variant="bodySmall" worldTheme={defaultTheme} muted align="center" style={{ marginBottom: 20 }}>
            {route.params?.message ?? 'An unexpected error occurred. Please try again.'}
          </AppText>
          <AppButton title="Return Home" onPress={() => navigation.navigate('Landing')} worldTheme={defaultTheme} fullWidth />
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

export function NotFoundScreen({ navigation }: NotFoundProps) {
  return (
    <ScreenContainer worldTheme={defaultTheme} scrollable={false}>
      <View style={styles.centered}>
        <GlassCard worldTheme={defaultTheme}>
          <AppText style={styles.icon}>🔍</AppText>
          <AppText variant="sectionTitleH2" worldTheme={defaultTheme} align="center" style={{ marginBottom: 12 }}>
            Page Not Found
          </AppText>
          <AppText variant="bodySmall" worldTheme={defaultTheme} muted align="center" style={{ marginBottom: 20 }}>
            The page you're looking for doesn't exist or has been moved.
          </AppText>
          <AppButton title="Return Home" onPress={() => navigation.navigate('Landing')} worldTheme={defaultTheme} fullWidth />
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  icon: { fontSize: 48, textAlign: 'center', marginBottom: 16 },
});
