import { primary, secondary, background, highlight, dark} from './colours.js'
export default {
  container: {
    paddingTop: 0,
    flex: 1
  },
  navItemStyle: {
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  navSectionStyle: {

  },
  navHeaderStyle: {
    backgroundColor: primary,
  },
  navHeaderTitleStyle: {
    fontSize: 30,
    color: background,
  },
  navHeaderTextStyle: {
    padding: 10,

    color: background,
  },
  sectionHeadingStyle: {
    backgroundColor: highlight,
  },
  sectionHeadingTitleStyle: {
    fontSize: 20,
    color: dark,
  },
  footerContainer: {
    padding: 10,
    backgroundColor: dark,
  },
  footerText: {
    color: background
  }
};
