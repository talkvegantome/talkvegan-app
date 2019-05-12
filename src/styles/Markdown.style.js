import { commonStyle } from './Common.style.js'
import { StyleSheet, Platform } from 'react-native';

export const markdownStyles =  StyleSheet.create({
  heading1: {
    textAlign:'left',
    fontSize: 25,
    fontWeight: 'bold',
    color: commonStyle.primary,
    fontFamily: commonStyle.headerFont,
    marginTop: 15,
    marginBottom: 10,
    lineHeight: 35,
  },
  heading2: {
    textAlign:'left',
    fontSize: 22,
    fontWeight: 'bold',
    color: commonStyle.primary,
    fontFamily: commonStyle.headerFont,
    marginVertical: 10,
  },
  heading3: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: commonStyle.primary,
    fontFamily: commonStyle.headerFont,
    marginVertical: 10,
  },
  paragraph: {
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    textAlign: 'justify'
  },
  text: {
    fontFamily: commonStyle.paragraphFont,
    fontSize: 18,
    textAlign: 'justify',
    lineHeight: 28,
  },
  listUnorderedItemIcon: {
    marginLeft: 10,
    marginRight: 10,
    lineHeight: Platform.OS === 'ios' ? 15 : 15
  },
  listOrderedItemIcon: {
    marginLeft: 10,
    marginRight: 10,
    lineHeight: Platform.OS === 'ios' ? 15 : 15
  },
});
