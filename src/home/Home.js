import React from 'react';
import { Share, TouchableHighlight, Text, View, ScrollView, Linking } from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import Markdown from 'react-native-markdown-renderer';
import Pages from '../Pages.js';
import { _ } from 'lodash'
import ContentIndex from '../navigation/ContentIndex'
import Wrapper from '../wrapper/Wrapper.js'
import { markdownRules } from '../MarkDownRules.js'
import { markdownStyles } from '../styles/Markdown.style.js';
import { commonStyle, PaperTheme } from '../styles/Common.style.js';

import Analytics, { PrivacyDialog } from '../analytics'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.scrollRef= React.createRef();
    this.props.storage.triggerUpdateMethods.push((storage) => this.setState(this.returnState(storage)))
    this.state = this.returnState(this.props.storage)
  }
  componentDidUpdate(){
    this.scrollRef.current.scrollTo({y: 0, animated: false})
  }

  returnState = (storage) => {
    let pagesObj = new Pages(storage)
    let analytics = new Analytics(storage.settings)
    return {
      analytics: analytics,
      pagesObj: pagesObj,
      settings: storage.settings,
      pages: pagesObj.getPages(),
      splashPath: pagesObj.getSplashPath(),
      markdownRulesObj: new markdownRules(this.props.navigation, storage.settings),
    }
  }
  
  
  render() {
    if(_.isNil(this.props.indexId)){
      return (
        <Wrapper 
          navigation={this.props.navigation} 
          title={this.state.pagesObj.getPageTitle()} 
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
      <Wrapper navigation={this.props.navigation} title={this.state.pagesObj.getPageTitle(this.props.indexId)} style={{flex:1, backgroundColor: commonStyle.contentBackgroundColor}}>
          <PrivacyDialog storage={this.props.storage}></PrivacyDialog>
          <ScrollView ref={this.scrollRef}>
            <View>
              <Markdown style={markdownStyles} rules={this.state.markdownRulesObj.returnRules()}>
                {this.state.markdownRulesObj.preProcessMarkDown(this.state.pagesObj.getPageContent(this.props.indexId))}
              </Markdown>
              <PageMenu 
                pagePermalink={this.state.pagesObj.getPagePermalink(this.props.indexId)}
                pageGitHubLink={this.state.pagesObj.getPageGitHubLink(this.props.indexId)}
                analytics={this.state.analytics}
              />
            </View>
          </ScrollView>
      </Wrapper>
    );
    
          
  }
}

class PageMenu extends React.Component {
  render() {
    return (
      <View>
        <Divider style={{ marginVertical: 20 }} />
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableHighlight style={{ flex: 1 }} onPress={() => { 
                Share.share({ message: this.props.pagePermalink }).then((result) => {
                this.props.analytics.logEvent('sharedPage', {page: this.props.pagePermalink, activity: result.activityType})
                }).catch((err) => {this.props.analytics.logEvent('error', {errorDetail: err})})
            }}>
            <View style={{ alignSelf: 'flex-start' }}>
                <Icon name='share' />
                <Text style={markdownStyles.text}>Share</Text>
            </View>
            </TouchableHighlight>
            <TouchableHighlight style={{ flex: 1 }} onPress={() => { Linking.openURL(this.props.pageGitHubLink) }}>
            <View style={{ alignSelf: 'flex-end' }}>
                <Icon name='edit' />
                <Text style={markdownStyles.text}>Edit</Text>
            </View>
            </TouchableHighlight>
        </View>
      </View>
    )
  }
}