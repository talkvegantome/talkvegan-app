/**
 * TalkVeganToMe
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { createDrawerNavigator, createAppContainer} from 'react-navigation';
import Markdown from 'react-native-markdown-renderer';
import SideMenu from './src/navigation/SideMenu.js';
import Pages from './src/Pages.js';
import SettingsScreen  from './src/settings/SettingsScreen.js';
import _ from 'lodash';
// import Markdown from 'react-native-simple-markdown'; // This was garbage as each _word_ was a separte <Text> making formatting a nightmare!

import {Settings} from './src/settings/Settings.js'
import Wrapper from './src/navigation/Wrapper.js'
import { markdownRules, preProcessMarkDown } from './src/MarkDownRules.js'
import { markdownStyles } from './src/styles/Markdown.style.js';
import { light, content} from './src/styles/Common.style.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.props.settings.triggerUpdateMethods.push((settings) => {
      let pagesObj = new Pages(settings)
      this.setState({
        pagesObj: pagesObj,
        settings: settings,
        pages: pagesObj.getPages(),
        splashPath: pagesObj.getSplashPath()
      })
    })
    let pagesObj = new Pages(this.props.settings.settings)
    const markdownRulesObj = new markdownRules(props.navigation);
    this.state = {
      pagesObj: pagesObj,
      pages: pagesObj.getPages(),
      splashPath: pagesObj.getSplashPath(),
      settings: this.props.settings.settings,
      markDownRules: markdownRulesObj.returnRules(),
    };
  }

  static navigationOptions = {
    drawerLabel: 'Home',
  };

  static navigationOptions = {
    header: null,
  };

  getPage(){
    let pageIndex = this.props.navigation.getParam('indexId')
    if (pageIndex){
      return this.state.pages[pageIndex] ? this.state.pages[pageIndex] : 'error loading ' + pageIndex + 'sorry :('
    }
    return this.state.pages[this.state.splashPath]

  }
  getPageTitle(){
    let pageMetadata = this.state.pagesObj.getPageMetadata(this.props.navigation.getParam('indexId'))
    let pageTitle = pageMetadata ? pageMetadata['friendlyName'] : 'TalkVeganToMe'
    // Exclude top level pages (e.g. /en/ or 'splash' pages) from having their friendlyName as header
    if(pageMetadata && pageMetadata['section']['relativePermalink'].match(/^\/[^\/]+\/$/)){
      return 'TalkVeganToMe'
    }
    return pageTitle
  }
  render() {

    return (
      <Wrapper navigation={this.props.navigation} title={this.getPageTitle()}>
        <Markdown style={markdownStyles} rules={this.state.markDownRules}>
          {preProcessMarkDown(this.getPage(), this.state.settings)}
        </Markdown>
      </Wrapper>
    );
  }
}

let settings = new Settings()

const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: ({ navigation }) => (<App settings={settings} navigation={navigation} />),
  },
  Settings: {
    screen: ({ navigation }) => (<SettingsScreen settings={settings} navigation = {navigation} />)
  }
  }, {
  contentComponent: ({ navigation }) => (<SideMenu settings={settings} navigation={navigation} />
  ),
  drawerWidth: Dimensions.get('window').width - 120,
});
const Main = createAppContainer(DrawerNavigator);
export default Main;
