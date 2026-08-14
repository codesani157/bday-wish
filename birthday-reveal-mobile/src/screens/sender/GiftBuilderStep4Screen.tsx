/**
 * GiftBuilderStep4Screen
 * Interactive Preview Run — sender preview mode with overlay controls.
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { GlassCard } from '../../components/primitives/GlassCard';
import { AppButton } from '../../components/primitives/AppButton';
import { AppText } from '../../components/primitives/AppText';
import { useBuilderContext } from '../../features/celebrations/context/BuilderContext';
import { spacing, radius } from '@/theme/spacing';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'GiftBuilderStep4'>;

export function GiftBuilderStep4Screen({ navigation, route }: Props) {
  const { draft, worldTheme } = useBuilderContext();
  return (
    <ScreenContainer worldTheme={worldTheme} scrollable={false}>
      <View style={styles.previewBar}>
        <GlassCard worldTheme={worldTheme} variant="subtle" noPadding style={styles.badge}>
          <AppText variant="uiLabelSmall" worldTheme={worldTheme} accent style={{ textAlign: 'center', padding: 8 }}>
            ✦ Sender Preview Mode
          </AppText>
        </GlassCard>
      </View>

      <View style={styles.previewArea}>
        {Platform.OS === 'web' ? (
          <iframe 
            src={`http://localhost:5173/?preview=true&celebrationId=${route.params.celebrationId}`}
            style={{ flex: 1, width: '100%', border: 'none', borderRadius: 24 }}
          />
        ) : (
          <WebView 
            source={{ uri: `http://localhost:5173/?preview=true&celebrationId=${route.params.celebrationId}` }}
            style={{ flex: 1, width: '100%', borderRadius: 24 }}
            scrollEnabled={false}
          />
        )}
      </View>

      <View style={styles.controls}>
        <AppButton title="Edit Gift" onPress={() => navigation.goBack()} variant="secondary" worldTheme={worldTheme} fullWidth style={{ marginBottom: 8 }} />
        <AppButton title="Proceed to Seal" onPress={() => navigation.navigate('GiftBuilderStep5', { celebrationId: route.params.celebrationId })} worldTheme={worldTheme} fullWidth />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  previewBar: { alignItems: 'center', paddingVertical: 12 },
  badge: { borderRadius: 999 },
  previewArea: { flex: 1, width: '100%', paddingHorizontal: 16, paddingBottom: 16, overflow: 'hidden' },
  controls: { paddingHorizontal: 20, paddingBottom: 32 },
});
