/**
 * MagicLinkVerificationScreen
 * Session verification with orbiting spinner and auto-redirect.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { GlassCard } from '../../components/primitives/GlassCard';
import { AppText } from '../../components/primitives/AppText';
import { AppButton } from '../../components/primitives/AppButton';
import { StatusSpinner } from '../../components/feedback/StatusSpinner';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { defaultTheme } from '@/theme/worldThemes';
import { spacing } from '@/theme/spacing';
import type { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'MagicLinkVerification'>;

type VerifyState = 'verifying' | 'success' | 'expired' | 'used';

export function MagicLinkVerificationScreen({ navigation, route }: Props) {
  const { token } = route.params;
  const [state, setState] = useState<VerifyState>('verifying');

  useEffect(() => {
    let mounted = true;
    
    const verify = async () => {
      try {
        await useAuthStore.getState().verifyToken(token);
        if (mounted) {
          setState('success');
          setTimeout(() => {
            navigation.reset({ index: 0, routes: [{ name: 'SenderDashboard' }] });
          }, 1200);
        }
      } catch (err: any) {
        if (!mounted) return;
        
        // Detailed error mapping would go here
        if (err?.response?.status === 401) {
          setState('expired');
        } else {
          setState('used'); // simplified error state
        }
      }
    };
    
    verify();

    return () => {
      mounted = false;
    };
  }, [token, navigation]);

  return (
    <ScreenContainer worldTheme={defaultTheme} scrollable={false}>
      <View style={styles.centered}>
        <GlassCard worldTheme={defaultTheme} variant="elevated">
          {state === 'verifying' && (
            <>
              <View style={styles.spinnerContainer}>
                <StatusSpinner size={56} worldTheme={defaultTheme} />
              </View>
              <AppText
                variant="sectionTitleH2"
                worldTheme={defaultTheme}
                align="center"
                style={styles.statusText}
              >
                Verifying your magic link...
              </AppText>
              <AppText variant="bodySmall" worldTheme={defaultTheme} muted align="center">
                This will only take a moment
              </AppText>
            </>
          )}

          {state === 'success' && (
            <>
              <AppText variant="displayHero" worldTheme={defaultTheme} style={styles.successIcon}>
                ✨
              </AppText>
              <AppText
                variant="headlineH1"
                worldTheme={defaultTheme}
                align="center"
                style={styles.statusText}
              >
                Welcome back!
              </AppText>
              <AppText variant="bodySmall" worldTheme={defaultTheme} muted align="center">
                Redirecting to your dashboard...
              </AppText>
            </>
          )}

          {state === 'expired' && (
            <>
              <AppText variant="displayHero" worldTheme={defaultTheme} style={styles.successIcon}>
                ⏰
              </AppText>
              <AppText
                variant="sectionTitleH2"
                worldTheme={defaultTheme}
                align="center"
                style={styles.statusText}
              >
                Link Expired
              </AppText>
              <InlineAlert
                message="This magic link has expired. Please request a new one."
                variant="warning"
              />
              <AppButton
                title="Request New Link"
                onPress={() => navigation.navigate('MagicLinkRequest')}
                worldTheme={defaultTheme}
                fullWidth
                style={styles.actionButton}
              />
            </>
          )}

          {state === 'used' && (
            <>
              <AppText variant="displayHero" worldTheme={defaultTheme} style={styles.successIcon}>
                🔗
              </AppText>
              <AppText
                variant="sectionTitleH2"
                worldTheme={defaultTheme}
                align="center"
                style={styles.statusText}
              >
                Link Already Used
              </AppText>
              <InlineAlert
                message="This magic link has already been used to sign in."
                variant="info"
              />
              <AppButton
                title="Return to Sign In"
                onPress={() => navigation.navigate('MagicLinkRequest')}
                variant="secondary"
                worldTheme={defaultTheme}
                fullWidth
                style={styles.actionButton}
              />
            </>
          )}
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  spinnerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  successIcon: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  statusText: {
    marginBottom: spacing.sm,
  },
  actionButton: {
    marginTop: spacing.base,
  },
});
