/**
 * Birthday Reveal v2.0
 * App Entry Point
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';

import { BuilderProvider } from './src/features/celebrations/context/BuilderContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <BuilderProvider>
        <RootNavigator />
      </BuilderProvider>
    </SafeAreaProvider>
  );
}
