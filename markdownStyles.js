import { primary, secondary, light, highlight, dark, headerFont, paragraphFont} from './commonStyling.js'
import {StyleSheet} from 'react-native';

export const markdownStyles =  StyleSheet.create({
  heading1: {
    textAlign:'left',
    fontSize: 25,
    fontWeight: 'bold',
    color: primary,
    fontFamily: headerFont,
    marginVertical: 10,
    lineHeight: 35,
  },
  heading2: {
    textAlign:'left',
    fontSize: 20,
    fontWeight: 'bold',
    color: primary,
    fontFamily: headerFont,
    marginVertical: 10,
  },
  heading3: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: primary,
    fontFamily: headerFont,
    marginVertical: 10,
  },
  paragraph: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlign: 'center'
  },
  text: {
    fontFamily: paragraphFont,
    fontSize: 18,
    textAlign: 'justify',
    lineHeight: 28,
  },
  listItemText: {
    textAlign: 'left'
  },
  listItem: {
    flexDirection: 'row',
  }
});
