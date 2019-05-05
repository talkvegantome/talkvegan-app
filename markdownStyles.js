import { primary, secondary, light, highlight, dark, headerFont, paragraphFont} from './commonStyling.js'
import {StyleSheet} from 'react-native';

export const markdownStyles =  StyleSheet.create({
  heading1: {
    fontSize: 25,
    fontWeight: 'bold',
    color: primary,
    fontFamily: headerFont,
    marginVertical: 10,
    lineHeight: 45,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: primary,
    fontFamily: headerFont,
    marginVertical: 10,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primary,
    fontFamily: headerFont,
    marginVertical: 10,
  },
  text: {
    fontFamily: paragraphFont,
    fontSize: 18,
    textAlign: 'justify',
    lineHeight: 28,
  },
  listItemContent: {
    textAlign: 'left'
  }
});
