import { commonStyle } from './Common.style.js'
let fontMultiplier = commonStyle.fontMultiplier
export default {
  container: {
    flex: 1,
    backgroundColor: commonStyle.light,
  },
  safeContainer: {
    backgroundColor: commonStyle.primary,
    flex: 1
  },
  dividerStyle: {
    height: 1,
    backgroundColor: commonStyle.light
  },
  navHeaderStyle: {
    backgroundColor: commonStyle.primary,
  },
  navHeaderTitleStyle: {
    fontSize: 30 * fontMultiplier,
    lineHeight: 30 * fontMultiplier,
    color: commonStyle.light,
  },
  sectionHeadingStyle: {
    backgroundColor: commonStyle.secondary,
    padding: 15 * fontMultiplier
  },
  sectionHeadingTitleStyle: {
    fontSize: 20 * fontMultiplier,
    lineHeight: 20 * fontMultiplier,
    color: commonStyle.light,
  },
  itemHeadingStyle: {
    backgroundColor: commonStyle.light
  },
  itemHeadingTitleStyle: {

  }
};
