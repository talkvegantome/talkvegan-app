/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View, ScrollView, Dimensions, SafeAreaView, AsyncStorage } from 'react-native';
import { createDrawerNavigator, createAppContainer} from 'react-navigation';
// https://medium.com/@mehulmistri/drawer-navigation-with-custom-side-menu-react-native-fbd5680060ba
import Markdown from 'react-native-markdown-renderer';
import SideMenu from './src/navigation/SideMenu.js';
import { pages } from './src/Pages.js';
import SettingsScreen  from './src/settings';
// import Markdown from 'react-native-simple-markdown'; // This was garbage as each _word_ was a separte <Text> making formatting a nightmare!

import Wrapper from './src/navigation/Wrapper.js'
import { markdownRules, preProcessMarkDown } from './src/MarkDownRules.js'
import { markdownStyles } from './src/styles/Markdown.style.js';
import { light, content} from './src/styles/Common.style.js';

  class App extends React.Component {
    constructor(props) {
      super(props);
    const markdownRulesObj = new markdownRules(props.navigation);
    this.state = {
      markDownRules: markdownRulesObj.returnRules(),
    };
  }

  static navigationOptions = {
    drawerLabel: 'Home',
  };

  static navigationOptions = {
    header: null,
  };


  static defaultProps = {};

  // static navigation  = this.props.navigation;
  render() {
    return (
      <Wrapper navigation={this.props.navigation}>
        <Markdown style={markdownStyles} rules={this.state.markDownRules}>
          {
              preProcessMarkDown(pages[this.props.navigation.getParam('indexId', '/splash/')])
            }
        </Markdown>
      </Wrapper>
    );
  }
}


const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: App,
  },
  Settings: {
    screen: SettingsScreen
  }

}, {
  contentComponent: ({ navigation }) => (<SideMenu navigation={navigation} />
  ),
  drawerWidth: Dimensions.get('window').width - 120,
});
const MyApp = createAppContainer(MyDrawerNavigator);
export default MyApp;
