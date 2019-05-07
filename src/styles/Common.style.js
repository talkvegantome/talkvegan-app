import {Platform} from 'react-native'
export const primary = '#D36135'
export const secondary = '#401F3E'
export const light = '#E8E9EB'
export const highlight = '#2274A5'
export const dark = '#313638'
export const headerFont = Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif';
export const paragraphFont = Platform.OS === 'ios' ? 'Georgia' : 'sans-serif';

export const content =  {
    textAlign: 'justify',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  }
