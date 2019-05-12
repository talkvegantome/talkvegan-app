import { commonStyle } from './Common.style.js'
export default {
  container: {
    flex: 1,
    backgroundColor: commonStyle.light,
  },
  safeContainer: {
    backgroundColor: commonStyle.primary,
    flex: 1
  },
  navSectionStyle: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    bottomBorderColor: commonStyle.primary,
    bottomBorderWidth: 1
  },

  navHeaderStyle: {
    backgroundColor: commonStyle.primary,
  },
  navHeaderTitleStyle: {
    fontSize: 30,
    color: commonStyle.light,
  },
  navHeaderTextStyle: {
    padding: 10,
    color: commonStyle.light,
  },
  sectionHeadingStyle: {
    backgroundColor: commonStyle.highlight,
  },
  sectionHeadingTitleStyle: {
    fontSize: 20,
    color: commonStyle.light,
  }
};
