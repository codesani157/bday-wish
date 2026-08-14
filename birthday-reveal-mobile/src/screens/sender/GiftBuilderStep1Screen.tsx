/**
 * GiftBuilderStep1Screen (Screen 4.6)
 * Recipient Details — collect name, email, birthdate, timezone
 * with live auto-save feedback.
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { StepWizardHeader } from '../../components/layout/StepWizardHeader';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { AppTextField } from '../../components/primitives/AppTextField';
import { AppButton } from '../../components/primitives/AppButton';
import { useBuilderContext } from '../../features/celebrations/context/BuilderContext';
import { defaultTheme } from '../../theme/worldThemes';
import { spacing } from '../../theme/spacing';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'GiftBuilderStep1'>;

export function GiftBuilderStep1Screen({ navigation, route }: Props) {
  const { draft, updateDraft, worldTheme } = useBuilderContext();
  const [autoSave, setAutoSave] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const simulateAutoSave = useCallback(() => {
    setAutoSave('saving');
    setTimeout(() => setAutoSave('saved'), 800);
    setTimeout(() => setAutoSave('idle'), 2500);
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!draft.name.trim()) newErrors.name = 'Recipient name is required';
    if (!draft.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) newErrors.email = 'Invalid email format';
    if (!draft.birthdate.trim()) newErrors.birthdate = 'Birthdate is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    // In production: create or patch draft, then navigate
    navigation.navigate('GiftBuilderStep2', { celebrationId: route.params?.celebrationId ?? 'new-draft' });
  };

  return (
    <ScreenContainer worldTheme={worldTheme}>
      {__DEV__ && (
        <InlineAlert message="[DEV] API is mocked. Auto-save is simulated." variant="warning" />
      )}
      <StepWizardHeader
        currentStep={1}
        totalSteps={5}
        title="Recipient Details"
        onBack={() => navigation.goBack()}
        autoSaveStatus={autoSave}
        worldTheme={worldTheme}
      />

      <View style={styles.form}>
        <AppTextField
          label="Recipient Name"
          value={draft.name}
          onChangeText={(text) => { updateDraft({ name: text }); simulateAutoSave(); }}
          error={errors.name}
          placeholder="Maya"
          worldTheme={worldTheme}
          required
        />

        <AppTextField
          label="Recipient Email"
          value={draft.email}
          onChangeText={(text) => { updateDraft({ email: text }); simulateAutoSave(); }}
          error={errors.email}
          placeholder="maya@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          worldTheme={worldTheme}
          required
        />

        <AppTextField
          label="Birthdate"
          value={draft.birthdate}
          onChangeText={(text) => { updateDraft({ birthdate: text }); simulateAutoSave(); }}
          error={errors.birthdate}
          placeholder="YYYY-MM-DD"
          hint="Supports Feb 29 leap day birthdays"
          worldTheme={worldTheme}
          required
        />

        <AppTextField
          label="Timezone"
          value={draft.timezone}
          onChangeText={(text) => { updateDraft({ timezone: text }); simulateAutoSave(); }}
          placeholder="America/New_York"
          hint="Auto-detected from your device"
          worldTheme={worldTheme}
        />
      </View>

      <View style={styles.actions}>
        <AppButton
          title="Next: Choose World"
          onPress={handleNext}
          worldTheme={worldTheme}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: spacing.base,
  },
  actions: {
    marginTop: spacing.xxl,
    paddingBottom: spacing.huge,
  },
});
