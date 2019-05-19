import { Platform } from 'react-native'
import { commonStyle } from './Common.style.js'

export const navHeaderStyle = {
  color: commonStyle.light,
  fontSize: 20,
  fontFamily: commonStyle.headerFont,
  lineHeight: 40,
}
export const navContainerStyle = {
  marginTop: Platform.OS === 'ios' ? 0 : -20,
  backgroundColor: commonStyle.primary,
  justifyContent: 'space-around',
}
