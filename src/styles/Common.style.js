import { Platform } from 'react-native'
import { StatusBar } from 'react-native';
StatusBar.setBarStyle('light-content', true);

let palette = {
	primary: '#ff6c00',
	secondary: '#292f5a',
	light: '#f9fbfc',
	lightText: '#999999',
	highlight: '#161B33',
	dark: '#313638',
}

export const commonStyle = {
	fontMultiplier: Platform.OS === 'ios' ? 1 : 0.9,
	primary: palette.primary,
	secondary: palette.secondary,
	light: palette.light,
	lightText: palette.lightText,
	highlight: palette.highlight,
	dark: palette.dark,
	headerFontColor: palette.light,
	headerBackgroundColor: palette.primary,
	headerFont: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',

	// Nav
	navDividerBackgroundColor: palette.light,
	navHeaderBackgroundColor: palette.primary,
	navHeaderFontColor: palette.light,
	navSectionBackgroundColor: palette.primary,
	navSectionDividerColor: '#FFFFFF',
	navSectionFontColor: palette.light,
	navItemBackgroundColor: palette.light,

	// Text
	headingFontColor: palette.secondary,
	paragraphFont: Platform.OS === 'ios' ? 'system font' : 'sans-serif',
	paragraphFontBold: Platform.OS === 'ios' ? 'ArialRoundedMTBold' : 'sans-serif-bold',
	content: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  },
	picker: {
		width: Platform.OS === 'ios' ? 100 : 200,
		height: 200
	},
	pickerItem: {
		width: Platform.OS === 'ios' ? 100 : 200,
		height: 200
	}

}
