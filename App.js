/**
 * TalkVeganToMe
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Dimensions, Share, TouchableHighlight, Text, View, Linking } from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import Markdown from 'react-native-markdown-renderer';
import SideMenu from './src/navigation/SideMenu.js';
import Pages from './src/Pages.js';
import SettingsScreen from './src/settings/SettingsScreen.js';

import { Storage } from './src/Storage.js'
import Wrapper from './src/navigation/Wrapper.js'
import { markdownRules } from './src/MarkDownRules.js'
import { markdownStyles } from './src/styles/Markdown.style.js';

let storage = new Storage()

import Analytics, { PrivacyDialog } from './src/analytics'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props.storage.triggerUpdateMethods.push((storage) => {
      let pagesObj = new Pages(storage)
      let analytics = new Analytics(storage.settings)
      this.setState({
        analytics: analytics,
        pagesObj: pagesObj,
        settings: storage.settings,
        pages: pagesObj.getPages(),
        splashPath: pagesObj.getSplashPath(),
        markdownRulesObj: new markdownRules(props.navigation, storage.settings)
      })
    })
    let analytics = new Analytics(storage.settings)
    let pagesObj = new Pages(this.props.storage)
    this.state = {
      analytics: analytics,
      pagesObj: pagesObj,
      pages: pagesObj.getPages(),
      splashPath: pagesObj.getSplashPath(),
      settings: this.props.storage.settings,
      markdownRulesObj: new markdownRules(props.navigation, storage.settings),
    };
    this.state.analytics.logEvent('Loaded Application')
  }

  static navigationOptions = {
    drawerLabel: 'Home',
  };

  static navigationOptions = {
    header: null,
  };

  getPageIndex() {
    let pageIndex = this.props.navigation.getParam('indexId')
    return pageIndex ? pageIndex : this.state.splashPath
  }
  getPagePermalink() {
    let pageIndex = this.getPageIndex()
    let pageMetadata = this.state.pagesObj.getPageMetadata(pageIndex)
    return pageMetadata.permalink
  }
  getPageGitHubLink() {
    let pageIndex = this.getPageIndex()
    let pageMetadata = this.state.pagesObj.getPageMetadata(pageIndex)
    let languageName = this.props.storage.pageData[this.state.settings.language].languageName
    let gitHubPath = pageMetadata.relativePermalink

    // Replace the language shortcode with the full name
    gitHubPath = gitHubPath.replace(/^\/[^\/]+\//, '/' + languageName.toLowerCase() + '/')
    // Replace the trailing slash with .md
    gitHubPath = gitHubPath.replace(/\/$/, '.md')
    return this.props.storage.config.gitHubUrl + 'blob/master/content' + gitHubPath
  }
  getPageContent() {
    let pageIndex = this.getPageIndex()
    if (!this.state.pages[pageIndex]) {
      let errorMessage = 'Error loading ' + pageIndex + '. Try refreshing data from the Settings page.'
      this.state.analytics.logEvent('error', { errorDetail: errorMessage })
      return errorMessage
    }
    return this.state.pages[pageIndex]
  }
  getPageTitle() {
    let pageMetadata = this.state.pagesObj.getPageMetadata(this.props.navigation.getParam('indexId'))
    let pageTitle = pageMetadata ? pageMetadata['friendlyName'] : 'TalkVeganToMe'
    // Exclude top level pages (e.g. /en/ or 'splash' pages) from having their friendlyName as header
    if (pageMetadata && pageMetadata['section']['relativePermalink'].match(/^\/[^\/]+\/$/)) {
      return 'TalkVeganToMe'
    }
    return pageTitle
  }
  render() {

    return (
      <Wrapper navigation={this.props.navigation} title={this.getPageTitle()}>
        <PrivacyDialog storage={storage}></PrivacyDialog>
        <Markdown style={markdownStyles} rules={this.state.markdownRulesObj.returnRules()}>
          {this.state.markdownRulesObj.preProcessMarkDown(this.getPageContent())}
        </Markdown>
        <Divider style={{ marginVertical: 20 }} />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableHighlight style={{ flex: 1 }} onPress={() => { 
              Share.share({ message: this.getPagePermalink() }).then((result) => {
                this.state.analytics.logEvent('sharedPage', {page: this.getPagePermalink(), activity: result.activityType})
              }).catch((err) => {this.state.analytics.logEvent('error', {errorDetail: err})})
            }}>
            <View style={{ alignSelf: 'flex-start' }}>
              <Icon name='share' />
              <Text style={markdownStyles.text}>Share</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={{ flex: 1 }} onPress={() => { Linking.openURL(this.getPageGitHubLink()) }}>
            <View style={{ alignSelf: 'flex-end' }}>
              <Icon name='edit' />
              <Text style={markdownStyles.text}>Edit</Text>
            </View>
          </TouchableHighlight>
        </View>
      </Wrapper>
    );
  }
}


const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: ({ navigation }) => (<App storage={storage} navigation={navigation} />),
  },
  Settings: {
    screen: ({ navigation }) => (<SettingsScreen storage={storage} navigation={navigation} />)
  }
}, {
    contentComponent: ({ navigation }) => (<SideMenu storage={storage} navigation={navigation} />
    ),
    drawerWidth: Dimensions.get('window').width - 120,
  });
const Main = createAppContainer(DrawerNavigator);
export default Main;
