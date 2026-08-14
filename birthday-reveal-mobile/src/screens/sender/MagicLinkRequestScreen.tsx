/**
 * MagicLinkRequestScreen (Screen 4.2)
 * Passwordless email authentication with floating label input,
 * glow validation, and 3D card flip to confirmation state.
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { GlassCard } from '../../components/primitives/GlassCard';
import { AppTextField } from '../../components/primitives/AppTextField';
import { AppButton } from '../../components/primitives/AppButton';
import { AppText } from '../../components/primitives/AppText';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { defaultTheme } from '../../theme/worldThemes';
import { spacing } from '../../theme/spacing';
import { config } from '../../config/env';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MagicLinkRequest'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MagicLinkRequestScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const flipAnim = React.useRef(new Animated.Value(0)).current;

  const validateEmail = useCallback((text: string) => {
    setEmail(text);
    if (error && EMAIL_REGEX.test(text)) {
      setError('');
    }
  }, [error]);

  const handleSubmit = useCallback(async () => {
    if (!EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Simulate API call (no backend logic)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    // Flip card to confirmation
    Animated.spring(flipAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 8,
      bounciness: 4,
    }).start();

    setIsSent(true);
    startCountdown();
  }, [email, flipAnim]);

  const startCountdown = () => {
    setCountdown(config.MAGIC_LINK_RESEND_COOLDOWN_SEC);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const frontScale = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.95, 0.9],
  });

  const backScale = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.9, 0.95, 1],
  });

  return (
    <ScreenContainer worldTheme={defaultTheme}>
      <View style={styles.centered}>
        {/* Request Form (Front) */}
        <Animated.View
          style={[
            styles.cardWrapper,
            { opacity: frontOpacity, transform: [{ scale: frontScale }] },
            isSent && styles.hidden,
          ]}
        >
          <GlassCard worldTheme={defaultTheme} variant="elevated">
            <AppText variant="displayHero" worldTheme={defaultTheme} style={styles.cardIcon}>
              ✉️
            </AppText>
            {__DEV__ && (
              <InlineAlert message="[DEV] Flow is currently mocked. No email will be sent." variant="warning" />
            )}
            <AppText
              variant="headlineH1"
              worldTheme={defaultTheme}
              align="center"
              style={styles.cardTitle}
            >
              Start Your Gift
            </AppText>
            <AppText
              variant="bodySmall"
              worldTheme={defaultTheme}
              muted
              align="center"
              style={styles.cardHelper}
            >
              Enter your email and we'll send a magic link to sign you in instantly.
            </AppText>

            <AppTextField
              label="Email"
              value={email}
              onChangeText={validateEmail}
              error={error}
              placeholder="alex@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              worldTheme={defaultTheme}
              required
            />

            <AppButton
              title="Send Magic Link"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={!email.trim()}
              worldTheme={defaultTheme}
              fullWidth
              style={styles.submitButton}
            />

            <AppButton
              title="Return Home"
              onPress={() => navigation.goBack()}
              variant="ghost"
              worldTheme={defaultTheme}
              fullWidth
            />
          </GlassCard>
        </Animated.View>

        {/* Confirmation (Back) */}
        {isSent && (
          <Animated.View
            style={[
              styles.cardWrapper,
              { opacity: backOpacity, transform: [{ scale: backScale }] },
            ]}
          >
            <GlassCard worldTheme={defaultTheme} variant="elevated">
              <AppText variant="displayHero" worldTheme={defaultTheme} style={styles.cardIcon}>
                📬
              </AppText>
              <AppText
                variant="headlineH1"
                worldTheme={defaultTheme}
                align="center"
                style={styles.cardTitle}
              >
                Check Your Inbox
              </AppText>
              <AppText
                variant="bodySmall"
                worldTheme={defaultTheme}
                muted
                align="center"
                style={styles.cardHelper}
              >
                We sent a magic link to{'\n'}
                <AppText variant="bodySmall" worldTheme={defaultTheme} accent>
                  {email}
                </AppText>
              </AppText>

              <InlineAlert
                message="The link will expire in 15 minutes."
                variant="info"
              />

              <AppButton
                title={countdown > 0 ? `Resend in ${countdown}s` : 'Resend Magic Link'}
                onPress={handleSubmit}
                variant="secondary"
                disabled={countdown > 0}
                worldTheme={defaultTheme}
                fullWidth
                style={styles.resendButton}
              />
            </GlassCard>
          </Animated.View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  cardWrapper: {
    width: '100%',
  },
  hidden: {
    position: 'absolute',
    width: '100%',
  },
  cardIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.sm,
  },
  cardHelper: {
    marginBottom: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  resendButton: {
    marginTop: spacing.base,
  },
});
