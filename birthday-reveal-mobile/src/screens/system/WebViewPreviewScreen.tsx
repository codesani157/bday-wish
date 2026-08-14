import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '../../components/primitives/AppText';
import { AppButton } from '../../components/primitives/AppButton';
import { defaultTheme } from '../../theme/worldThemes';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'WebViewPreview'>;

export function WebViewPreviewScreen({ route, navigation }: Props) {
  const { token } = route.params;

  return (
    <View style={styles.container}>
      <AppText variant="headlineH1" worldTheme={defaultTheme} align="center">
        Web Reveal Preview
      </AppText>
      <AppText variant="bodyMessage" worldTheme={defaultTheme} align="center" muted style={{ marginTop: 16 }}>
        In production, this will render a React Native WebView{'\n'}
        pointing to the TRD-mandated Vite/Three.js reveal app.
      </AppText>
      <AppText variant="uiLabelSmall" worldTheme={defaultTheme} align="center" accent style={{ marginTop: 24, marginBottom: 48 }}>
        Token: {token}
      </AppText>

      <AppButton
        title="Close Preview"
        onPress={() => navigation.goBack()}
        worldTheme={defaultTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.bgPrimary,
    justifyContent: 'center',
    padding: 24,
  },
});
