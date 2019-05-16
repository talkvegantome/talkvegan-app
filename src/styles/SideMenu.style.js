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
  dividerStyle: {
    height: 1,
    backgroundColor: commonStyle.light
  },
  navHeaderStyle: {
    backgroundColor: commonStyle.primary,
  },
  navHeaderTitleStyle: {
    fontSize: 30,
    color: commonStyle.light,
  },
  sectionHeadingStyle: {
    backgroundColor: commonStyle.secondary
  },
  sectionHeadingTitleStyle: {
    fontSize: 20,
    color: commonStyle.light,
  },
  itemHeadingStyle: {
    backgroundColor: commonStyle.light
  },
  itemHeadingTitleStyle: {

  }
};
