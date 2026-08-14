/**
 * Root Navigator
 * Type-safe navigation structure covering all 23 screens.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { palette } from '../theme/colors';
import type { RootStackParamList } from '../types/navigation';

// Sender screens
import { LandingScreen } from '../screens/sender/LandingScreen';
import { MagicLinkRequestScreen } from '../screens/sender/MagicLinkRequestScreen';
import { MagicLinkVerificationScreen } from '../screens/sender/MagicLinkVerificationScreen';
import { SenderDashboardScreen } from '../screens/sender/SenderDashboardScreen';
import { GiftBuilderStep1Screen } from '../screens/sender/GiftBuilderStep1Screen';
import { GiftBuilderStep2Screen } from '../screens/sender/GiftBuilderStep2Screen';
import { GiftBuilderStep3Screen } from '../screens/sender/GiftBuilderStep3Screen';
import { GiftBuilderStep4Screen } from '../screens/sender/GiftBuilderStep4Screen';
import { GiftBuilderStep5Screen } from '../screens/sender/GiftBuilderStep5Screen';
import { CelebrationDetailScreen } from '../screens/sender/CelebrationDetailScreen';

// Preview
import { WebViewPreviewScreen } from '../screens/system/WebViewPreviewScreen';

// System screens
import { GenericErrorScreen, NotFoundScreen } from '../screens/system/SystemScreens';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: palette.loft.bgPrimary },
  animation: 'fade' as const,
};

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions} initialRouteName="Landing">
        {/* ─── Auth ─── */}
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="MagicLinkRequest" component={MagicLinkRequestScreen} />
        <Stack.Screen name="MagicLinkVerification" component={MagicLinkVerificationScreen} />

        {/* ─── Sender ─── */}
        <Stack.Screen name="SenderDashboard" component={SenderDashboardScreen} />
        <Stack.Screen name="CelebrationDetail" component={CelebrationDetailScreen} />

        {/* ─── Gift Builder Wizard ─── */}
        <Stack.Screen name="GiftBuilderStep1" component={GiftBuilderStep1Screen} />
        <Stack.Screen name="GiftBuilderStep2" component={GiftBuilderStep2Screen} />
        <Stack.Screen name="GiftBuilderStep3" component={GiftBuilderStep3Screen} />
        <Stack.Screen name="GiftBuilderStep4" component={GiftBuilderStep4Screen} />
        <Stack.Screen name="GiftBuilderStep5" component={GiftBuilderStep5Screen} />

        {/* ─── Preview Modal ─── */}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="WebViewPreview" component={WebViewPreviewScreen} />
        </Stack.Group>

        {/* ─── System ─── */}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="GenericError" component={GenericErrorScreen} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
