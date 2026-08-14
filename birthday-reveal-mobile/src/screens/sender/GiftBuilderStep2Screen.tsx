/**
 * GiftBuilderStep2Screen
 * World Selection — choose spatial environment with animated cards.
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { StepWizardHeader } from '../../components/layout/StepWizardHeader';
import { WorldCard } from '../../components/cards/WorldCard';
import { AppButton } from '../../components/primitives/AppButton';
import { defaultTheme } from '@/theme/worldThemes';
import { spacing } from '@/theme/spacing';
import { mockWorlds } from '../../data/mockData';
import { useBuilderContext } from '../../features/celebrations/context/BuilderContext';
import type { WorldKey } from '../../types/world';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'GiftBuilderStep2'>;

export function GiftBuilderStep2Screen({ navigation, route }: Props) {
  const { draft, updateDraft, worldTheme } = useBuilderContext();

  const handleNext = () => {
    navigation.navigate('GiftBuilderStep3', { celebrationId: route.params.celebrationId });
  };

  return (
    <ScreenContainer
      worldTheme={worldTheme}
      scrollable={false}
      footer={
        <AppButton
          title="Next: Assemble Gift"
          onPress={handleNext}
          worldTheme={worldTheme}
          fullWidth
        />
      }
    >
      <StepWizardHeader
        currentStep={2}
        totalSteps={5}
        title="Choose a World"
        onBack={() => navigation.goBack()}
        worldTheme={worldTheme}
      />

      <ScrollView
        style={styles.worldList}
        showsVerticalScrollIndicator={false}
      >
        {mockWorlds.map((world) => (
          <WorldCard
            key={world.key}
            worldKey={world.key}
            displayName={world.displayName}
            description={world.description}
            isSelected={draft.worldKey === world.key}
            onSelect={(key) => updateDraft({ worldKey: key })}
            style={styles.worldCard}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  worldList: {
    flex: 1,
    marginTop: spacing.md,
  },
  worldCard: {
    marginBottom: spacing.base,
  },
});
