import { commonStyle } from './Common.style.js'
import { Platform } from 'react-native';
import _ from 'lodash';
let fontMultiplier = commonStyle.fontMultiplier
export const markdownStyles =  {
  heading1: {
    textAlign:'left',
    fontSize: 22 * fontMultiplier,
    lineHeight: 22 * fontMultiplier,
    fontWeight: 'bold',
    color: commonStyle.headingFontColor,
    fontFamily: commonStyle.headerFont,
    marginTop: 35,
    marginBottom: 10,

  },
  heading2: {
    textAlign: 'left',
    fontSize: 20 * fontMultiplier,
    lineHeight: 20 * fontMultiplier,
    fontWeight: 'bold',
    color: commonStyle.headingFontColor,
    fontFamily: commonStyle.headerFont,
    marginTop: 20 * fontMultiplier,
    marginBottom: 5 * fontMultiplier
  },
  heading3: {
    textAlign: 'left',
    fontSize: 18 * fontMultiplier,
    lineHeight: 28 * fontMultiplier,
    fontWeight: 'bold',
    color: commonStyle.headingFontColor,
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
    margin: -10
  },
  quotedListUnorderedItemIcon: {
    fontSize: 15,
    paddingTop: 10,
    marginLeft: 10,
    marginRight: 10,
    lineHeight: Platform.OS === 'ios' ? 15 : 15
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
  quotedListOrderedItemIcon: {
    fontSize: 15,
    paddingTop: 10,
    marginLeft: 10,
    marginRight: 10,
    lineHeight: Platform.OS === 'ios' ? 15 : 15
  },
  listOrderedItemIcon: {
    fontSize: 15,
    paddingTop: 18,
    marginLeft: 10,
    marginRight: 10,
    lineHeight: Platform.OS === 'ios' ? 15 : 15
  },
  blockquote: {
    paddingHorizontal: 20,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: commonStyle.light
  },
  blockquoteText: {
    fontFamily: commonStyle.paragraphFont,
    fontSize: 16 * fontMultiplier,
    lineHeight: 25 * fontMultiplier,
    color: commonStyle.lightText
  },
  strong: {
    fontFamily: commonStyle.paragraphFontBold,
    fontWeight: 'bold'
  }
};

export const popUpmarkdownStyles = _.merge(_.cloneDeep(markdownStyles), {
  heading1: {
    fontSize: 16,
    marginTop: 0
  },
  text: {
    fontSize: 14,
    lineHeight: 18
  },
  listUnorderedItemIcon: {
    lineHeight: 10
  }
})