/**
 * SenderDashboardScreen
 * Active & past gift manager with metric summary badges,
 * urgency-pulsing celebration items, and empty zero-state.
 */

import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppText } from '../../components/primitives/AppText';
import { AppButton } from '../../components/primitives/AppButton';
import { GlassCard } from '../../components/primitives/GlassCard';
import { CelebrationListItem } from '../../components/cards/CelebrationListItem';
import { MetricSummaryBadge } from '../../components/cards/MetricSummaryBadge';
import { defaultTheme } from '@/theme/worldThemes';
import { spacing } from '@/theme/spacing';
import { useCelebrations } from '../../hooks/useCelebrations';
import type { RootStackParamList } from '../../types/navigation';
import type { CelebrationListItemData } from '../../types/celebration';

type Props = NativeStackScreenProps<RootStackParamList, 'SenderDashboard'>;

export function SenderDashboardScreen({ navigation }: Props) {
  const { data: celebrations = [], isLoading, error } = useCelebrations();

  const metrics = useMemo(() => {
    const counts = { scheduled: 0, sent: 0, opened: 0, completed: 0 };
    celebrations.forEach((c) => {
      if (c.status === 'sealed') counts.scheduled++;
      if (c.status === 'delivered') counts.sent++;
      if (c.status === 'opened') counts.opened++;
      if (c.status === 'completed') counts.completed++;
    });
    return counts;
  }, [celebrations]);

  const handleCelebrationPress = (id: string) => {
    navigation.navigate('CelebrationDetail', { celebrationId: id });
  };

  const handleNewGift = () => {
    navigation.navigate('GiftBuilderStep1', {});
  };

  if (isLoading) {
    return (
      <ScreenContainer worldTheme={defaultTheme}>
        <View style={styles.emptyContainer}>
          <AppText variant="bodyMessage" worldTheme={defaultTheme} muted>Loading dashboard...</AppText>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer worldTheme={defaultTheme}>
        <View style={styles.emptyContainer}>
          <AppText variant="headlineH1" worldTheme={defaultTheme}>Error</AppText>
          <AppText variant="bodyMessage" worldTheme={defaultTheme} muted>Failed to load celebrations.</AppText>
        </View>
      </ScreenContainer>
    );
  }

  // ─── Empty State ───
  if (celebrations.length === 0) {
    return (
      <ScreenContainer worldTheme={defaultTheme}>
        <View style={styles.emptyContainer}>
          <AppText variant="displayHero" worldTheme={defaultTheme} style={styles.emptyEmoji}>
            🎁
          </AppText>
          <AppText
            variant="headlineH1"
            worldTheme={defaultTheme}
            align="center"
            style={styles.emptyTitle}
          >
            No Birthday Surprises Yet
          </AppText>
          <AppText
            variant="bodyMessage"
            worldTheme={defaultTheme}
            muted
            align="center"
            style={styles.emptySubtitle}
          >
            Build an unforgettable world for someone special.
          </AppText>
          <AppButton
            title="Create Your First Gift"
            onPress={handleNewGift}
            worldTheme={defaultTheme}
            fullWidth
          />
        </View>
      </ScreenContainer>
    );
  }

  // ─── Populated Dashboard ───
  return (
    <ScreenContainer worldTheme={defaultTheme} scrollable={false} padded={false}>
      <View style={styles.header}>
        <AppText variant="headlineH1" worldTheme={defaultTheme}>
          Dashboard
        </AppText>
        <AppButton
          title="+ Build New Gift"
          onPress={handleNewGift}
          worldTheme={defaultTheme}
          style={styles.newGiftButton}
        />
      </View>

      {/* Metric Summary Strip */}
      <View style={styles.metricsRow}>
        <MetricSummaryBadge label="Scheduled" count={metrics.scheduled} isActive={metrics.scheduled > 0} />
        <MetricSummaryBadge label="Sent" count={metrics.sent} />
        <MetricSummaryBadge label="Opened" count={metrics.opened} />
        <MetricSummaryBadge label="Completed" count={metrics.completed} />
      </View>

      {/* Celebration List */}
      <AppText
        variant="sectionTitleH2"
        worldTheme={defaultTheme}
        style={styles.sectionTitle}
      >
        Birthday Surprises
      </AppText>

      <FlatList<CelebrationListItemData>
        data={celebrations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CelebrationListItem
            item={item}
            onPress={handleCelebrationPress}
            style={styles.listItem}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
  },
  newGiftButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.huge,
  },
  listItem: {
    marginBottom: spacing.md,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    marginBottom: spacing.md,
  },
  emptySubtitle: {
    marginBottom: spacing.xxl,
    maxWidth: 260,
  },
});
