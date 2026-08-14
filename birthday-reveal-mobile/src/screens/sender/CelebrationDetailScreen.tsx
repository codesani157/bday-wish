/**
 * CelebrationDetailScreen (Screen 4.11)
 * Live status, engagement timeline, and management actions.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { GlassCard } from '../../components/primitives/GlassCard';
import { AppButton } from '../../components/primitives/AppButton';
import { AppText } from '../../components/primitives/AppText';
import { StatusBadge } from '../../components/primitives/StatusBadge';
import { defaultTheme } from '../../theme/worldThemes';
import { spacing } from '../../theme/spacing';
import type { RootStackParamList } from '../../types/navigation';
import { mockCelebrations } from '../../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'CelebrationDetail'>;

const MOCK_TIMELINE = [
  { event: 'Gift Sealed', time: 'Aug 14, 2026 — 01:30 AM', icon: '🔒' },
  { event: 'Email Delivered', time: 'Aug 18, 2026 — 00:01 AM', icon: '📧' },
  { event: 'Link Opened', time: 'Aug 18, 2026 — 08:15 AM', icon: '🔗' },
  { event: 'Hidden Note Found', time: 'Aug 18, 2026 — 08:19 AM', icon: '🗒️' },
  { event: 'Celebration Completed', time: 'Aug 18, 2026 — 08:22 AM', icon: '🎉' },
];

export function CelebrationDetailScreen({ route, navigation }: Props) {
  const { celebrationId } = route.params;
  const celebration = mockCelebrations.find((c) => c.id === celebrationId) || mockCelebrations[0];

  return (
    <ScreenContainer worldTheme={defaultTheme}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="headlineH1" worldTheme={defaultTheme}>{celebration.recipientName}'s Birthday</AppText>
        <View style={styles.headerMeta}>
          <AppText variant="uiLabelSmall" worldTheme={defaultTheme} muted>{celebration.worldDisplayName}</AppText>
          <StatusBadge status={celebration.status} />
        </View>
      </View>

      {/* Timeline */}
      <GlassCard worldTheme={defaultTheme} style={styles.section}>
        <AppText variant="buttonText" worldTheme={defaultTheme} style={{ marginBottom: 16 }}>Activity Timeline</AppText>
        {MOCK_TIMELINE.map((item, i) => (
          <View key={i} style={styles.timelineItem}>
            <AppText variant="bodySmall" style={{ fontSize: 20, marginRight: 12 }}>{item.icon}</AppText>
            <View style={{ flex: 1 }}>
              <AppText variant="bodySmall" worldTheme={defaultTheme}>{item.event}</AppText>
              <AppText variant="uiLabelSmall" worldTheme={defaultTheme} muted>{item.time}</AppText>
            </View>
          </View>
        ))}
      </GlassCard>

      {/* Content Summary */}
      <GlassCard worldTheme={defaultTheme} variant="subtle" style={styles.section}>
        <AppText variant="buttonText" worldTheme={defaultTheme} style={{ marginBottom: 12 }}>Content Summary</AppText>
        <AppText variant="bodySmall" worldTheme={defaultTheme} muted>5 photos • 3 hidden surprises</AppText>
        <AppText variant="bodySmall" worldTheme={defaultTheme} muted>Music: Spotify link attached</AppText>
        <AppText variant="bodySmall" worldTheme={defaultTheme} muted>Memory Gate: Enabled</AppText>
      </GlassCard>

      {/* Actions */}
      <View style={styles.actions}>
        <AppButton title="Duplicate Gift" onPress={() => {}} variant="secondary" worldTheme={defaultTheme} fullWidth style={{ marginBottom: 8 }} />
        <AppButton title="Back to Dashboard" onPress={() => navigation.goBack()} variant="ghost" worldTheme={defaultTheme} fullWidth />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 24 },
  headerMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  section: { marginBottom: 20 },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  actions: { paddingBottom: 48 },
});
