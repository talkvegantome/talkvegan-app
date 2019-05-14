import { commonStyle } from './Common.style.js'
import { StatusBar } from 'react-native';
StatusBar.setBarStyle('light-content', true);
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
    backgroundColor: commonStyle.light,
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
