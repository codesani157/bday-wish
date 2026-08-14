/**
 * CelebrationListItem
 * Rich list item for the Sender Dashboard.
 * Features recipient name, world theme preview, delivery date, status, and urgency glow.
 */

import React, { useEffect, useRef } from 'react';
import { View, Pressable, Animated, StyleSheet, ViewStyle } from 'react-native';
import { GlassCard } from '../primitives/GlassCard';
import { AppText } from '../primitives/AppText';
import { StatusBadge } from '../primitives/StatusBadge';
import { spacing } from '../../theme/spacing';
import { resolveWorldTheme } from '../../theme/worldThemes';
import { worldIcons } from '../../theme/worldMeta';
import { haptics } from '../../utils/haptics';
import type { CelebrationListItem as CelebrationListItemType } from '../../types/celebration';
import type { WorldKey } from '../../types/world';

interface CelebrationListItemProps {
  item: CelebrationListItemType;
  onPress: (id: string) => void;
  style?: ViewStyle;
}



export const CelebrationListItem = React.memo(function CelebrationListItem({ item, onPress, style }: CelebrationListItemProps) {
  const worldTheme = resolveWorldTheme(item.worldKey as WorldKey);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const isUrgent = item.status === 'sealed' && isWithin24Hours(item.scheduledSendAtUtc);

  useEffect(() => {
    if (!isUrgent) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isUrgent, glowAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const handlePress = () => {
    haptics.tap();
    onPress(item.id);
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={style}>
        {/* Urgency glow ring */}
        {isUrgent && (
          <Animated.View
            style={[
              styles.urgencyGlow,
              {
                borderColor: worldTheme.accent,
                opacity: glowOpacity,
              },
            ]}
          />
        )}

        <GlassCard worldTheme={worldTheme}>
          <View style={styles.header}>
            <AppText variant="bodySmall" worldTheme={worldTheme} style={styles.emoji}>
              {worldIcons[item.worldKey as WorldKey] ?? '🎁'}
            </AppText>
            <View style={styles.nameContainer}>
              <AppText variant="sectionTitleH2" worldTheme={worldTheme} numberOfLines={1}>
                {item.recipientName}'s Birthday
              </AppText>
              <AppText variant="uiLabelSmall" worldTheme={worldTheme} muted>
                {item.worldDisplayName}
              </AppText>
            </View>
            <StatusBadge status={item.status} />
          </View>

          <View style={styles.footer}>
            <AppText variant="uiLabelSmall" worldTheme={worldTheme} muted>
              {formatScheduleInfo(item)}
            </AppText>
            <AppText variant="uiLabelSmall" worldTheme={worldTheme} muted>
              {item.mediaCount} photos • {item.hiddenSurpriseCount} surprises
            </AppText>
          </View>
        </GlassCard>
      </View>
    </Pressable>
  );
});

function isWithin24Hours(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 24 * 60 * 60 * 1000;
}

function formatScheduleInfo(item: CelebrationListItemType): string {
  if (item.completedAt) return `Completed ${formatDate(item.completedAt)}`;
  if (item.firstOpenedAt) return `Opened ${formatDate(item.firstOpenedAt)}`;
  if (item.sentAt) return `Delivered ${formatDate(item.sentAt)}`;
  if (item.scheduledSendAtUtc) return `Scheduled ${formatDate(item.scheduledSendAtUtc)}`;
  return 'Draft';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  emoji: {
    fontSize: 28,
  },
  nameContainer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  urgencyGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 2,
  },
});
