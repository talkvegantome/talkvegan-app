import {Platform} from 'react-native'
let blueTheme = {
	primary: '#235789',
	secondary: '#401F3E',
	light: '#E8E9EB',
	highlight: '#6EA4BF',
	dark: '#313638',
}
export const commonStyle = {
	primary: '#235789',
	secondary: '#401F3E',
	light: '#E8E9EB',
	highlight: '#161B33',
	dark: '#313638',
	headerFont: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
	paragraphFont: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif',
	content: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  }
}
