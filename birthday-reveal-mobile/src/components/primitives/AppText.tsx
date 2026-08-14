/**
 * AppText
 * Themed text component that maps typography variants and applies world colors.
 */

import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { typography, TypographyVariant } from '../../theme/typography';
import { defaultTheme } from '../../theme/worldThemes';
import type { ResolvedWorldTheme } from '../../theme/worldThemes';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  worldTheme?: ResolvedWorldTheme;
  muted?: boolean;
  accent?: boolean;
  align?: TextStyle['textAlign'];
}

export function AppText({
  variant = 'bodySmall',
  color,
  worldTheme = defaultTheme,
  muted = false,
  accent = false,
  align,
  style,
  children,
  ...rest
}: AppTextProps) {
  const resolvedColor = color
    ?? (accent ? worldTheme.accent : muted ? worldTheme.textMuted : worldTheme.textMain);

  return (
    <Text
      style={[
        typography[variant],
        { color: resolvedColor },
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
