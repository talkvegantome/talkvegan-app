import React from 'react';
import { SafeAreaView, Share, TouchableHighlight, Text, View, ScrollView, Linking } from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import { createAppContainer } from 'react-navigation';
import Markdown from 'react-native-markdown-renderer';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import SideMenu, { MenuItems } from './SideMenu.js';
import Pages from '../Pages.js';
import SettingsScreen from '../settings/SettingsScreen.js';
import {_} from 'lodash'
import ContentIndex from './ContentIndex'

import { Storage } from '../Storage.js'
import Wrapper from '../navigation/Wrapper.js'
import { markdownRules } from '../MarkDownRules.js'
import { markdownStyles } from '../styles/Markdown.style.js';
import { commonStyle, PaperTheme } from '../styles/Common.style.js';

import Analytics, { PrivacyDialog } from '../analytics'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.scrollRef= React.createRef();
    this.props.storage.triggerUpdateMethods.push((storage) => {
      let pagesObj = new Pages(storage)
      let analytics = new Analytics(storage.settings)
      this.setState({
        analytics: analytics,
        pagesObj: pagesObj,
        settings: storage.settings,
        pages: pagesObj.getPages(),
        splashPath: pagesObj.getSplashPath(),
        markdownRulesObj: new markdownRules(props.navigation, storage.settings),
      })
    })
    let analytics = new Analytics(this.props.storage.settings)
    let pagesObj = new Pages(this.props.storage)
    this.state = {
      analytics: analytics,
      pagesObj: pagesObj,
      pages: pagesObj.getPages(),
      splashPath: pagesObj.getSplashPath(),
      settings: this.props.storage.settings,
      markdownRulesObj: new markdownRules(props.navigation, this.props.storage.settings),
      indexHistory: []
    };
    this.state.analytics.logEvent('Loaded Application')
  }
  componentDidUpdate(){
    this.scrollRef.current.scrollTo({y: 0, animated: false})
  }
  

  static navigationOptions = {
    drawerLabel: 'Home',
  };

  static navigationOptions = {
    header: null,
  };

  getPageIndex() {
    let pageIndex = this.props.indexId
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
    let pageMetadata = this.state.pagesObj.getPageMetadata(this.props.indexId)
    let pageTitle = pageMetadata ? pageMetadata['friendlyName'] : 'TalkVeganToMe'
    // Exclude top level pages (e.g. /en/ or 'splash' pages) from having their friendlyName as header
    if (pageMetadata && pageMetadata['section']['relativePermalink'].match(/^\/[^\/]+\/$/)) {
      return 'TalkVeganToMe'
    }
    return pageTitle
  }
  render() {
    if(_.isNil(this.props.indexId)){
      return (
        <Wrapper 
          navigation={this.props.navigation} 
          title={this.getPageTitle()} 
          style={{
            flex: 1,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 20,
            paddingBottom: 20,
          }}>
          <ScrollView ref={this.scrollRef}>
            <ContentIndex storage={this.props.storage} navigation={this.props.navigation}/>
          </ScrollView>
        </Wrapper>
      )
    }
    return (
      <Wrapper navigation={this.props.navigation} title={this.getPageTitle()} style={{flex:1}}>
          <PrivacyDialog storage={this.props.storage}></PrivacyDialog>
          <ScrollView ref={this.scrollRef}>
            <View>
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
            </View>
          </ScrollView>
      </Wrapper>
    );
    
          
  }
}