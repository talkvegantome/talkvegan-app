import { Platform } from 'react-native'
import { StatusBar } from 'react-native';
StatusBar.setBarStyle('light-content', true);

export const commonStyle = {
	primary: '#235789',
	secondary: '#3371AA',
	light: '#E8E9EB',
	highlight: '#161B33',
	dark: '#313638',
	headerFont: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
	paragraphFont: Platform.OS === 'ios' ? 'Georgia' : 'sans-serif',
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
