/**
 * MemoryGateScreen (Screen 4.18)
 * Playful anticipation barrier with 3 attempts and auto-bypass.
 */

import React, { useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { GlassCard } from '../../components/primitives/GlassCard';
import { AppTextField } from '../../components/primitives/AppTextField';
import { AppButton } from '../../components/primitives/AppButton';
import { AppText } from '../../components/primitives/AppText';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { defaultTheme } from '../../theme/worldThemes';
import { haptics } from '../../utils/haptics';
import { config } from '../../config/env';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MemoryGate'>;

export function MemoryGateScreen({ navigation, route }: Props) {
  const { question, token } = route.params;
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= config.MEMORY_GATE_MAX_ATTEMPTS) {
      haptics.celebrate();
      setFeedback("Close enough! Happy Birthday anyway! 🎉");
      setTimeout(() => navigation.replace('InteractiveReveal', { token }), 1500);
      return;
    }

    // Simulate wrong answer
    haptics.warning();
    shake();
    setFeedback('Not quite! Try again.');
  };

  return (
    <ScreenContainer worldTheme={defaultTheme} scrollable={false}>
      <View style={styles.centered}>
        <Animated.View style={{ transform: [{ translateX: shakeAnim }], width: '100%' }}>
          <GlassCard worldTheme={defaultTheme} variant="elevated">
            {__DEV__ && (
              <InlineAlert message="[DEV] API is mocked. Any answer will fail until bypass." variant="warning" />
            )}
            <AppText variant="displayHero" worldTheme={defaultTheme} style={{ fontSize: 40, textAlign: 'center', marginBottom: 16 }}>🔐</AppText>
            <AppText variant="sectionTitleH2" worldTheme={defaultTheme} align="center" style={{ marginBottom: 16 }}>
              {question}
            </AppText>

            <AppTextField label="Your Answer" value={answer} onChangeText={setAnswer} placeholder="Type your answer..." worldTheme={defaultTheme} />

            {feedback ? (
              <AppText variant="bodySmall" worldTheme={defaultTheme} accent align="center" style={{ marginVertical: 12 }}>
                {feedback}
              </AppText>
            ) : null}

            <AppText variant="uiLabelSmall" worldTheme={defaultTheme} muted align="center" style={{ marginBottom: 16 }}>
              Attempt {attempts} of {config.MEMORY_GATE_MAX_ATTEMPTS}
            </AppText>

            <AppButton title="Submit" onPress={handleSubmit} disabled={!answer.trim()} worldTheme={defaultTheme} fullWidth />
          </GlassCard>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
});
