/**
 * GiftBuilderStep3Screen
 * Assembly Canvas — headline, message, photo uploads,
 * hidden surprises bucket, music link, and memory gate config.
 */

import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { StepWizardHeader } from '../../components/layout/StepWizardHeader';
import { GlassCard } from '../../components/primitives/GlassCard';
import { AppTextField } from '../../components/primitives/AppTextField';
import { AppButton } from '../../components/primitives/AppButton';
import { AppCheckbox } from '../../components/primitives/AppCheckbox';
import { AppText } from '../../components/primitives/AppText';
import { useBuilderContext } from '../../features/celebrations/context/BuilderContext';
import { celebrationService } from '../../services/celebration.service';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { spacing, radius } from '@/theme/spacing';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'GiftBuilderStep3'>;

export function GiftBuilderStep3Screen({ navigation, route }: Props) {
  const { draft, updateDraft, worldTheme } = useBuilderContext();
  const [enableMemoryGate, setEnableMemoryGate] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [hiddenNotes, setHiddenNotes] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera roll permissions are required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const filename = asset.fileName || `photo_${Date.now()}.jpg`;
      const mimeType = asset.mimeType || 'image/jpeg';
      
      setIsUploading(true);
      try {
        const { uploadUrl } = await celebrationService.getUploadUrl(route.params.celebrationId, {
          filename,
          mimeType
        });
        
        await FileSystem.uploadAsync(uploadUrl, asset.uri, {
          httpMethod: 'PUT',
          headers: { 'Content-Type': mimeType }
        });
        
        setPhotos((prev) => [...prev, asset.uri]);
      } catch (err) {
        console.error('Upload failed', err);
        alert('Upload failed. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddNote = () => {
    setHiddenNotes((prev) => [...prev, '']);
  };

  const handleNext = () => {
    navigation.navigate('GiftBuilderStep4', { celebrationId: route.params.celebrationId });
  };

  return (
    <ScreenContainer 
      worldTheme={worldTheme}
      footer={
        <AppButton
          title="Next: Preview Gift"
          onPress={handleNext}
          worldTheme={worldTheme}
          fullWidth
        />
      }
    >
      <StepWizardHeader
        currentStep={3}
        totalSteps={5}
        title="Assemble Your Gift"
        onBack={() => navigation.goBack()}
        worldTheme={worldTheme}
      />

      {/* ─── Headline ─── */}
      <AppTextField.Simple
        label="Headline"
        value={draft.headline}
        onChangeText={(text) => updateDraft({ headline: text })}
        placeholder="Happy Birthday Maya!"
        worldTheme={worldTheme}
      />

      {/* ─── Personal Message ─── */}
      <AppTextField.Simple
        label="Personal Message"
        value={draft.messageBody}
        onChangeText={(text) => updateDraft({ messageBody: text })}
        placeholder="Write your heartfelt message..."
        multiline
        numberOfLines={5}
        worldTheme={worldTheme}
        containerStyle={styles.messageField}
      />

      {/* ─── Photo Deck ─── */}
      <GlassCard worldTheme={worldTheme} variant="subtle" style={styles.section}>
        <AppText variant="buttonText" worldTheme={worldTheme} style={styles.sectionLabel}>
          Core Memories
        </AppText>
        <View style={styles.photoGrid}>
          <Pressable onPress={handleAddPhoto} style={styles.photoSlot}>
            <AppText variant="sectionTitleH2" worldTheme={worldTheme} accent align="center">
              +
            </AppText>
            <AppText variant="uiLabelSmall" worldTheme={worldTheme} muted align="center">
              {isUploading ? 'Uploading...' : 'Add Photo'}
            </AppText>
          </Pressable>
          {photos.map((photo, i) => (
            <View key={i} style={[styles.photoSlot, styles.photoFilled]}>
              <AppText variant="uiLabelSmall" worldTheme={worldTheme} muted numberOfLines={1}>
                📷 Image {i + 1}
              </AppText>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* ─── Hidden Surprises Bucket ─── */}
      <GlassCard worldTheme={worldTheme} variant="subtle" style={styles.section}>
        <AppText variant="buttonText" worldTheme={worldTheme} style={styles.sectionLabel}>
          ✦ Hidden Surprises
        </AppText>
        <AppText variant="bodySmall" worldTheme={worldTheme} muted style={styles.bucketHint}>
          Drop secret photos or inside joke notes here — we'll hide them in the world!
        </AppText>
        <View style={styles.bucketActions}>
          <AppButton
            title="+ Add Extra Photo"
            onPress={handleAddPhoto}
            variant="secondary"
            worldTheme={worldTheme}
            style={styles.bucketButton}
          />
          <AppButton
            title="+ Add Note"
            onPress={handleAddNote}
            variant="secondary"
            worldTheme={worldTheme}
            style={styles.bucketButton}
          />
        </View>
        {hiddenNotes.map((_, i) => (
          <AppTextField.Simple
            key={i}
            label={`Secret Note ${i + 1}`}
            value={hiddenNotes[i]}
            onChangeText={(text) => {
              const updated = [...hiddenNotes];
              updated[i] = text;
              setHiddenNotes(updated);
            }}
            placeholder="Remember Paris 2024?"
            hint="Up to 140 characters"
            maxLength={140}
            worldTheme={worldTheme}
          />
        ))}
      </GlassCard>

      {/* ─── Music Layer ─── */}
      <AppTextField.Simple
        label="Music Link"
        value={draft.musicUrl}
        onChangeText={(text) => updateDraft({ musicUrl: text })}
        placeholder="Spotify or YouTube URL"
        keyboardType="url"
        autoCapitalize="none"
        worldTheme={worldTheme}
        containerStyle={styles.section}
      />

      {/* ─── Memory Gate ─── */}
      <GlassCard worldTheme={worldTheme} variant="subtle" style={styles.section}>
        <AppCheckbox
          label="Enable Memory Gate Prompt"
          checked={enableMemoryGate}
          onChange={setEnableMemoryGate}
          worldTheme={worldTheme}
        />

        {enableMemoryGate && (
          <View style={styles.memoryGateFields}>
            <AppTextField.Simple
              label="Question"
              value={draft.memoryPrompt}
              onChangeText={(text) => updateDraft({ memoryPrompt: text })}
              placeholder="Where did we first meet?"
              worldTheme={worldTheme}
            />
            <AppTextField.Simple
              label="Answer"
              value={draft.memoryAnswer}
              onChangeText={(text) => updateDraft({ memoryAnswer: text })}
              placeholder="Paris"
              hint="Answer is case-insensitive"
              worldTheme={worldTheme}
            />
          </View>
        )}
      </GlassCard>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  messageField: {
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    marginBottom: spacing.md,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoSlot: {
    width: 90,
    height: 90,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(247, 208, 112, 0.20)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoFilled: {
    borderStyle: 'solid',
    backgroundColor: 'rgba(247, 208, 112, 0.06)',
  },
  bucketHint: {
    marginBottom: spacing.md,
  },
  bucketActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  bucketButton: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  memoryGateFields: {
    marginTop: spacing.base,
  },
});
