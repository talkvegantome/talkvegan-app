import {Platform} from 'react-native'
export const commonStyle = {
	primary: '#D36135',
	secondary: '#401F3E',
	light: '#E8E9EB',
	highlight: '#2274A5',
	dark: '#313638',
	headerFont: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
	paragraphFont: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif',
	content: {
    textAlign: 'justify',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  }
}
