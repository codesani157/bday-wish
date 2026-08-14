/**
 * WorldCard
 * Selection card for the World Selection step (Step 2).
 * Shows thumbnail, physics tags, and active selection glow border.
 */

import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, Animated } from 'react-native';
import { GlassCard } from '../primitives/GlassCard';
import { AppText } from '../primitives/AppText';
import { spacing, radius, shadows } from '../../theme/spacing';
import { resolveWorldTheme } from '../../theme/worldThemes';
import { worldIcons, physicsTags } from '../../theme/worldMeta';
import { haptics } from '../../utils/haptics';
import type { WorldKey } from '../../types/world';

interface WorldCardProps {
  worldKey: WorldKey;
  displayName: string;
  description: string;
  isSelected: boolean;
  onSelect: (key: WorldKey) => void;
  style?: ViewStyle;
}



export const WorldCard = React.memo(function WorldCard({
  worldKey,
  displayName,
  description,
  isSelected,
  onSelect,
  style,
}: WorldCardProps) {
  const theme = resolveWorldTheme(worldKey);
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    haptics.select();
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }),
    ]).start();
    onSelect(worldKey);
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={handlePress}>
        <GlassCard
          worldTheme={theme}
          variant={isSelected ? 'elevated' : 'standard'}
          style={isSelected ? { borderWidth: 2, borderColor: theme.accent, shadowColor: theme.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 6 } : undefined}
        >
          {/* World icon + name */}
          <View style={styles.header}>
            <AppText variant="displayHero" worldTheme={theme} style={styles.icon}>
              {worldIcons[worldKey]}
            </AppText>
            <View style={styles.titleBlock}>
              <AppText variant="sectionTitleH2" worldTheme={theme}>
                {displayName}
              </AppText>
              {isSelected && (
                <AppText variant="uiLabelSmall" worldTheme={theme} accent>
                  ✦ Selected
                </AppText>
              )}
            </View>
          </View>

          {/* Description */}
          <AppText
            variant="bodySmall"
            worldTheme={theme}
            muted
            style={styles.description}
          >
            {description}
          </AppText>

          {/* Physics tags */}
          <View style={styles.tags}>
            {physicsTags[worldKey].map((tag) => (
              <View
                key={tag}
                style={[styles.tag, { backgroundColor: `${theme.accent}18` }]}
              >
                <AppText variant="uiLabelSmall" color={theme.accent}>
                  {tag}
                </AppText>
              </View>
            ))}
          </View>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 40,
  },
  titleBlock: {
    flex: 1,
  },
  description: {
    marginBottom: spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  selectedBorder: {
    borderWidth: 2,
  },
});
