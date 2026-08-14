/**
 * InvalidLinkScreen (Screen 4.21)
 * Privacy-safe fallback for expired/invalid reveal links.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { GlassCard } from '../../components/primitives/GlassCard';
import { AppText } from '../../components/primitives/AppText';
import { defaultTheme } from '../../theme/worldThemes';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'InvalidLink'>;

export function InvalidLinkScreen({}: Props) {
  return (
    <ScreenContainer worldTheme={defaultTheme} scrollable={false}>
      <View style={styles.centered}>
        <GlassCard worldTheme={defaultTheme}>
          <AppText style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🔗</AppText>
          <AppText variant="sectionTitleH2" worldTheme={defaultTheme} align="center" style={{ marginBottom: 12 }}>
            This reveal link is no longer active
          </AppText>
          <AppText variant="bodySmall" worldTheme={defaultTheme} muted align="center">
            It may have expired or the URL may be invalid. Contact the person who sent this gift for a new link.
          </AppText>
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
});
