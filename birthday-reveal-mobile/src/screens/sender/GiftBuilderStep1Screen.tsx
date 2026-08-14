/**
 * GiftBuilderStep1Screen
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
import { useCreateCelebration, useUpdateCelebration } from '../../hooks/useCelebrations';
import { defaultTheme } from '@/theme/worldThemes';
import { spacing } from '@/theme/spacing';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'GiftBuilderStep1'>;

export function GiftBuilderStep1Screen({ navigation, route }: Props) {
  const { draft, updateDraft, worldTheme } = useBuilderContext();
  const [autoSave, setAutoSave] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutateAsync: createDraft } = useCreateCelebration();
  const { mutateAsync: updateDraftMutation } = useUpdateCelebration(draft.celebrationId || '');

  const triggerAutoSave = useCallback(async () => {
    // Basic debounce / async state management for visual feedback
    setAutoSave('saving');
    try {
      if (draft.celebrationId) {
        await updateDraftMutation({
          recipientName: draft.name,
          recipientEmail: draft.email,
          recipientBirthdate: draft.birthdate,
          recipientTimezone: draft.timezone,
        });
      }
      setAutoSave('saved');
      setTimeout(() => setAutoSave('idle'), 2500);
    } catch (e) {
      setAutoSave('idle');
    }
  }, [draft, updateDraftMutation]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!draft.name.trim()) newErrors.name = 'Recipient name is required';
    if (!draft.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) newErrors.email = 'Invalid email format';
    if (!draft.birthdate.trim()) newErrors.birthdate = 'Birthdate is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    
    setAutoSave('saving');
    let cid = draft.celebrationId;

    try {
      if (!cid) {
        const res = await createDraft({
          recipientName: draft.name,
          recipientEmail: draft.email,
          recipientBirthdate: draft.birthdate,
          recipientTimezone: draft.timezone,
        });
        cid = res.id;
        updateDraft({ celebrationId: cid });
      } else {
        await triggerAutoSave();
      }
      
      navigation.navigate('GiftBuilderStep2', { celebrationId: cid });
    } catch (e) {
      // Handle error natively, for now just revert to idle
      setAutoSave('idle');
    }
  };

  return (
    <ScreenContainer
      worldTheme={worldTheme}
      footer={
        <AppButton
          title="Next: Choose World"
          onPress={handleNext}
          worldTheme={worldTheme}
          fullWidth
        />
      }
    >
      {__DEV__ && !draft.celebrationId && (
        <InlineAlert message="[DEV] Creates real drafts on the backend now." variant="info" />
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
          onChangeText={(text) => { updateDraft({ name: text }); }}
          onBlur={triggerAutoSave}
          error={errors.name}
          placeholder="Maya"
          worldTheme={worldTheme}
          required
        />

        <AppTextField
          label="Recipient Email"
          value={draft.email}
          onChangeText={(text) => { updateDraft({ email: text }); }}
          onBlur={triggerAutoSave}
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
          onChangeText={(text) => { updateDraft({ birthdate: text }); }}
          onBlur={triggerAutoSave}
          error={errors.birthdate}
          placeholder="YYYY-MM-DD"
          hint="Supports Feb 29 leap day birthdays"
          worldTheme={worldTheme}
          required
        />

        <AppTextField
          label="Timezone"
          value={draft.timezone}
          onChangeText={(text) => { updateDraft({ timezone: text }); }}
          onBlur={triggerAutoSave}
          placeholder="America/New_York"
          hint="Auto-detected from your device"
          worldTheme={worldTheme}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: spacing.base,
  },
});
