import { commonStyle } from './Common.style.js'
let fontMultiplier = commonStyle.fontMultiplier
export default {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeContainer: {
    backgroundColor: commonStyle.navHeaderBackgroundColor,
    flex: 1
  },
  dividerStyle: {
    height: 1,
    backgroundColor: commonStyle.navDividerColor
  },
  navHeaderStyle: {
    backgroundColor: commonStyle.navHeaderBackgroundColor,
  },
  navHeaderTitleStyle: {
    fontSize: 30 * fontMultiplier,
    lineHeight: 30 * fontMultiplier,
    color: commonStyle.navHeaderFontColor,
  },
  sectionHeadingStyle: {
    backgroundColor: commonStyle.navSectionBackgroundColor,
    padding: 15 * fontMultiplier,
    margin:0,
    borderBottomWidth: 1,
    borderBottomColor: commonStyle.navSectionDividerColor,
  },
  sectionHeadingTitleStyle: {
    fontSize: 18 * fontMultiplier,
    lineHeight: 20 * fontMultiplier,
    color: commonStyle.navSectionFontColor,
  },
  itemHeadingStyle: {
    backgroundColor: commonStyle.navItemBackgroundColor
  },
  itemHeadingTitleStyle: {
    color: commonStyle.navItemFontColor
  }
};
