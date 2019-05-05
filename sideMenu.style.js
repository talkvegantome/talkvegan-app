import { primary, secondary, light, highlight, dark} from './commonStyling.js'
export default {
  container: {
    flex: 1,
    backgroundColor: light,
  },
  safeContainer: {
    backgroundColor: primary,
    flex: 1
  },
  navSectionStyle: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    bottomBorderColor: primary,
    bottomBorderWidth: 1
  },

  navHeaderStyle: {
    backgroundColor: primary,
  },
  navHeaderTitleStyle: {
    fontSize: 30,
    color: light,
  },
  navHeaderTextStyle: {
    padding: 10,
    color: light,
  },
  sectionHeadingStyle: {
    backgroundColor: highlight,
  },
  sectionHeadingTitleStyle: {
    fontSize: 20,
    color: light,
  }
};
