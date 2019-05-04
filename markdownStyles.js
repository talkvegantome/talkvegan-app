import { primary, secondary, light, highlight, dark} from './colours.js'
import {StyleSheet} from 'react-native';
export const markdownStyles =  StyleSheet.create({
  heading1: {
    marginTop: 0,
    color: primary,
    fontFamily: 'Helvetica',
    marginBottom: 10,
    lineHeight: 45,
  },
  heading2: {
    marginTop: 10,
    color: primary,
    fontFamily: 'Helvetica',
    marginBottom: 10,
  },
  paragraph: {
    fontFamily: 'Georgia',
    fontSize: 18,
    textAlign: 'justify',
    lineHeight: 28,
  },
  listItemNumber: {
    marginTop:5,
  },
  listItemOrderedContent: {
    fontFamily: 'Georgia',
    fontSize: 18,
    textAlign: 'left',
    lineHeight: 28
  }
});
