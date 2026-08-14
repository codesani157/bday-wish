/**
 * GiftBuilderStep5Screen
 * The Seal & Schedule — cinematic gift sealing with delivery confirmation.
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { StepWizardHeader } from '../../components/layout/StepWizardHeader';
import { GlassCard } from '../../components/primitives/GlassCard';
import { AppButton } from '../../components/primitives/AppButton';
import { AppText } from '../../components/primitives/AppText';
import { CenteredStage } from '../../components/layout/CenteredStage';
import { ProgressBar } from '../../components/feedback/ProgressBar';
import { useBuilderContext } from '../../features/celebrations/context/BuilderContext';
import { useSealCelebration } from '../../hooks/useCelebrations';
import { spacing } from '@/theme/spacing';
import { haptics } from '../../utils/haptics';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'GiftBuilderStep5'>;

export function GiftBuilderStep5Screen({ navigation }: Props) {
  const { draft, worldTheme } = useBuilderContext();
  const [isSealing, setIsSealing] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const sealProgress = useRef(new Animated.Value(0)).current;
  const sealScale = useRef(new Animated.Value(1)).current;

  const { mutateAsync: sealCelebration } = useSealCelebration(draft.celebrationId || 'unknown');

  const handleSeal = useCallback(async () => {
    setIsSealing(true);
    haptics.sealImpact();

    try {
      Animated.sequence([
        Animated.timing(sealScale, { toValue: 0.92, duration: 300, useNativeDriver: true }),
        Animated.timing(sealProgress, { toValue: 1, duration: 3000, useNativeDriver: false }),
        Animated.spring(sealScale, { toValue: 1.05, useNativeDriver: true, speed: 8 }),
        Animated.spring(sealScale, { toValue: 1, useNativeDriver: true, speed: 12 }),
      ]).start(async () => {
        haptics.celebrate();
        
        // Execute the real API call
        if (draft.celebrationId) {
          await sealCelebration(new Date().toISOString());
        }

        setIsSealing(false);
        setIsSealed(true);
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: 'SenderDashboard' }] });
        }, 2000);
      });
    } catch (e) {
      setIsSealing(false);
    }
  }, [sealProgress, sealScale, navigation, draft.celebrationId, sealCelebration]);

  const progressWidth = sealProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ScreenContainer worldTheme={worldTheme}>
      <StepWizardHeader currentStep={5} totalSteps={5} title="Seal & Schedule" onBack={() => navigation.goBack()} worldTheme={worldTheme} />

      <CenteredStage>
        <Animated.View style={{ transform: [{ scale: sealScale }], alignItems: 'center' }}>
          <AppText variant="displayHero" align="center" style={{ fontSize: 80, marginBottom: 24 }}>
            {isSealed ? '💌' : '🎁'}
          </AppText>
        </Animated.View>

        {isSealed ? (
          <>
            <AppText variant="headlineH1" worldTheme={worldTheme} align="center" style={{ marginBottom: 8 }}>
              Gift Sealed! ✨
            </AppText>
            <AppText variant="bodyMessage" worldTheme={worldTheme} muted align="center">
              Redirecting to your dashboard...
            </AppText>
          </>
        ) : (
          <>
            <GlassCard worldTheme={worldTheme} style={{ marginBottom: 24, width: '100%' }}>
              <AppText variant="buttonText" worldTheme={worldTheme} style={{ marginBottom: 8 }}>Delivery Summary</AppText>
              <AppText variant="bodySmall" worldTheme={worldTheme} muted>Recipient: {draft.name || 'Your recipient'}</AppText>
              <AppText variant="bodySmall" worldTheme={worldTheme} muted>Send at: {draft.birthdate || 'Not specified'}</AppText>
              <AppText variant="bodySmall" worldTheme={worldTheme} muted>World: Starlight Loft</AppText>
            </GlassCard>

            {isSealing && (
              <View style={{ marginBottom: 24, width: '100%' }}>
                <ProgressBar progress={Number(JSON.stringify(sealProgress)) || (isSealed ? 1 : 0)} worldTheme={worldTheme} />
              </View>
            )}

            <AppButton
              title={isSealing ? 'Sealing...' : 'Seal & Schedule Birthday Surprise'}
              onPress={handleSeal}
              loading={isSealing}
              disabled={isSealing}
              worldTheme={worldTheme}
              fullWidth
            />
          </>
        )}
      </CenteredStage>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});
