/**
 * Typography Hierarchy
 * Maps to UX Spec Section 2.2
 *
 * Fonts loaded via expo-font at app boot.
 * Arcade world overrides to "PressStart2P" via worldKey context.
 */

import { TextStyle } from 'react-native';

export const fontFamilies = {
  display: 'Outfit-Bold',
  headline: 'Outfit-SemiBold',
  sectionTitle: 'Outfit-Medium',
  body: 'PlayfairDisplay-Regular',
  bodyItalic: 'PlayfairDisplay-Italic',
  label: 'Inter-Medium',
  labelBold: 'Inter-SemiBold',
  arcade: 'PressStart2P-Regular',
} as const;

export const typography = {
  displayHero: {
    fontFamily: fontFamilies.display,
    fontSize: 48,
    lineHeight: 48 * 1.1,
    fontWeight: '700',
  } as TextStyle,

  headlineH1: {
    fontFamily: fontFamilies.headline,
    fontSize: 32,
    lineHeight: 32 * 1.2,
    fontWeight: '600',
  } as TextStyle,

  sectionTitleH2: {
    fontFamily: fontFamilies.sectionTitle,
    fontSize: 24,
    lineHeight: 24 * 1.3,
    fontWeight: '500',
  } as TextStyle,

  bodyMessage: {
    fontFamily: fontFamilies.body,
    fontSize: 18,
    lineHeight: 18 * 1.6,
    fontWeight: '400',
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 14 * 1.5,
    fontWeight: '400',
  } as TextStyle,

  uiLabel: {
    fontFamily: fontFamilies.label,
    fontSize: 14,
    lineHeight: 14 * 1.0,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,

  uiLabelSmall: {
    fontFamily: fontFamilies.label,
    fontSize: 12,
    lineHeight: 12 * 1.2,
    fontWeight: '500',
    letterSpacing: 0.3,
  } as TextStyle,

  buttonText: {
    fontFamily: fontFamilies.labelBold,
    fontSize: 16,
    lineHeight: 16 * 1.0,
    fontWeight: '600',
    letterSpacing: 0.3,
  } as TextStyle,

  arcadeSpecialty: {
    fontFamily: fontFamilies.arcade,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontWeight: '400',
  } as TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;
