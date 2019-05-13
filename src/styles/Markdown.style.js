import { commonStyle } from './Common.style.js'
import { StyleSheet, Platform } from 'react-native';

let fontMultiplier = 1
export const markdownStyles =  StyleSheet.create({
  heading1: {
    textAlign:'left',
    fontSize: 25 * fontMultiplier,
    lineHeight: 25 * fontMultiplier,
    fontWeight: 'bold',
    color: commonStyle.primary,
    fontFamily: commonStyle.headerFont,
    marginTop: 35,
    marginBottom: 10,

  },
  heading2: {
    textAlign: 'left',
    fontSize: 22 * fontMultiplier,
    lineHeight: 22 * fontMultiplier,
    fontWeight: 'bold',
    color: commonStyle.primary,
    fontFamily: commonStyle.headerFont,
    marginTop: 20 * fontMultiplier,
    marginBottom: 5 * fontMultiplier
  },
  heading3: {
    textAlign: 'left',
    fontSize: 18 * fontMultiplier,
    lineHeight: 28 * fontMultiplier,
    fontWeight: 'bold',
    color: commonStyle.primary,
    fontFamily: commonStyle.headerFont,
    marginVertical: 10,
  },
  text: {
    fontFamily: commonStyle.paragraphFont,
    fontSize: 18 * fontMultiplier,
    lineHeight: 28 * fontMultiplier,
  },
  listUnorderedItem: {
    flexDirection: 'row',
    margin: -7
  },
  listUnorderedItemIcon: {
    fontSize: 15,
    paddingTop: 18,
    marginLeft: 10,
    marginRight: 10,
    lineHeight: Platform.OS === 'ios' ? 15 : 15
  },
  listOrderedItem: {
    flexDirection: 'row',
    margin: -7
  },
  listOrderedItemIcon: {
    fontSize: 15,
    paddingTop: 18,
    marginLeft: 10,
    marginRight: 10,
    lineHeight: Platform.OS === 'ios' ? 15 : 15
  },
});
