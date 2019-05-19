/**
 * TalkVeganToMe
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Dimensions, Share } from 'react-native';
import { ListItem } from 'react-native-elements';
import { createDrawerNavigator, createAppContainer} from 'react-navigation';
import Markdown from 'react-native-markdown-renderer';
import SideMenu from './src/navigation/SideMenu.js';
import Pages from './src/Pages.js';
import SettingsScreen  from './src/settings/SettingsScreen.js';

// import { Amplitude } from 'expo';
// import amplitudeSettings from './assets/amplitudeSettings.json'
// Amplitude.initialize(amplitudeSettings.apiKey)


import {Storage} from './src/Storage.js'
import Wrapper from './src/navigation/Wrapper.js'
import { markdownRules, preProcessMarkDown } from './src/MarkDownRules.js'
import { markdownStyles } from './src/styles/Markdown.style.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.props.storage.triggerUpdateMethods.push((storage) => {
      let pagesObj = new Pages(storage)
      this.setState({
        pagesObj: pagesObj,
        settings: storage.settings,
        pages: pagesObj.getPages(),
        splashPath: pagesObj.getSplashPath()
      })
    })
    let pagesObj = new Pages(this.props.storage)
    const markdownRulesObj = new markdownRules(props.navigation);
    this.state = {
      pagesObj: pagesObj,
      pages: pagesObj.getPages(),
      splashPath: pagesObj.getSplashPath(),
      settings: this.props.storage.settings,
      markDownRules: markdownRulesObj.returnRules(),
    };
    // Amplitude.logEvent('Loaded Application')
  }

  static navigationOptions = {
    drawerLabel: 'Home',
  };

  static navigationOptions = {
    header: null,
  };

  getPageIndex(){
    let pageIndex = this.props.navigation.getParam('indexId')
    return pageIndex ? pageIndex : this.state.splashPath
  }
  getPagePermalink(){
    let pageIndex = this.getPageIndex()
    let pageMetadata = this.state.pagesObj.getPageMetadata(pageIndex)
    return pageMetadata.permalink
  }
  getPageContent(){
    let pageIndex = this.getPageIndex()
    if(!this.state.pages[pageIndex]){
      let errorMessage = 'Error loading ' + pageIndex + '. Try refreshing data from the Settings page.'
      // Amplitude.logEventWithProperties('error', {errorDetail: errorMessage})
      return errorMessage
    }
    return this.state.pages[pageIndex]
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
          {preProcessMarkDown(this.getPageContent(), this.state.settings)}
        </Markdown>
        <ListItem leftIcon={{name: 'share'}} title='Share Link to Page' topDivider={true}
          containerStyle={{marginTop:10, paddingTop: 20}}
          onPress={() => {Share.share({message: this.getPagePermalink()})}}
        />
      </Wrapper>
    );
  }
}

let storage = new Storage()

const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: ({ navigation }) => (<App storage={storage} navigation={navigation} />),
  },
  Settings: {
    screen: ({ navigation }) => (<SettingsScreen storage={storage} navigation = {navigation} />)
  }
  }, {
  contentComponent: ({ navigation }) => (<SideMenu storage={storage} navigation={navigation} />
  ),
  drawerWidth: Dimensions.get('window').width - 120,
});
const Main = createAppContainer(DrawerNavigator);
export default Main;
