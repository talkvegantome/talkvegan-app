import { Platform } from 'react-native';
import { StatusBar } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
StatusBar.setBarStyle('light-content', true);

let palette = {
  primary: '#ff6c00',
  secondary: '#143642',
  light: '#f9fbfc',
  white: '#FFFFFF',
  lightText: '#444444',
  highlight: '#161B33',
  dark: '#313638',
};

export const commonStyle = {
  fontMultiplier: Platform.OS === 'ios' ? 1 : 0.9,
  primary: palette.primary,
  secondary: palette.secondary,
  light: palette.light,
  lightText: palette.lightText,
  highlight: palette.highlight,
  dark: palette.dark,

  // Header
  headerFontColor: palette.white,
  headerBackgroundColor: palette.secondary,
  headerFont: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',

  // Nav
  navDividerColor: palette.light,
  navHeaderBackgroundColor: palette.secondary,
  navHeaderFontColor: palette.white,
  navSectionBackgroundColor: palette.primary,
  navSectionFontColor: palette.light,
  navSectionDividerColor: '#FFFFFF',
  navItemBackgroundColor: palette.light,
  navItemFontColor: '#000000',

  // Text
  headingFontColor: palette.secondary,
  paragraphFont: Platform.OS === 'ios' ? 'system font' : 'sans-serif',
  paragraphFontBold:
    Platform.OS === 'ios' ? 'ArialRoundedMTBold' : 'sans-serif-bold',
  contentBackgroundColor: '#f6f6f6',
  content: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  },
  picker: {
    width: Platform.OS === 'ios' ? 100 : 200,
    height: 200,
  },
  pickerItem: {
    width: Platform.OS === 'ios' ? 100 : 200,
    height: 200,
  },
};

export const PaperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: commonStyle.primary,
    accent: commonStyle.secondary,
    onSurface: '#FFFFFF',
  },
};
