import React from 'react';
import { Share, TouchableHighlight, Text, View, Linking } from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import { Appbar, FAB, ActivityIndicator } from 'react-native-paper';
import Markdown from 'react-native-markdown-renderer';
import Pages from '../Pages.js';
import { _ } from 'lodash'

import ContentIndex from '../navigation/ContentIndex'
import Wrapper from '../wrapper/Wrapper.js'
import { markdownRules } from '../MarkDownRules.js'
import { markdownStyles } from '../styles/Markdown.style.js';
import { commonStyle } from '../styles/Common.style.js';

import Analytics, { PrivacyDialog } from '../analytics'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
    this.props.storage.addOnRefreshListener((storage) => this.setState(this.returnState(storage)))
    this.props.storage.addOnRefreshListener(
      (storage) => this.setState({isFavourite: storage.isFavourite({
        indexId: this.props.indexId,
        pageKey: 'home'
      })}),  
      ['favourites']
    )
    this.props.navigation.addOnNavigateListener((key, props) => {
      this.setState({isFavourite: this.props.storage.isFavourite({
        indexId: props.indexId,
        pageKey: 'home'
      })})
    })
    this.state = this.returnState(this.props.storage, true)
  }

  returnState = (storage, loading=false) => {
    return {
      analytics: new Analytics(storage.settings),
      randomiseHomepage: storage.settings.randomiseHomepage,
      isFavourite: storage.isFavourite({
        indexId: this.props.indexId,
        page: 'home'
      }),
      loading: loading,
      settings: storage.settings,
      pagesObj: new Pages(storage),
      markdownRulesObj: new markdownRules(this.props.navigation, storage.settings),
    }
  }
  
  render() {

    if(this.state.loading){
      return (
        <Wrapper
          navigation={this.props.navigation} 
          title={this.state.pagesObj.getPageTitle()} 
          scrollRefPopulator={(scrollRef) => {this.scrollRef = scrollRef}}
          style={{
            flex: 1,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <ActivityIndicator animating={true} color={commonStyle.primary} size='large'/>
        </Wrapper>
      )
    }
    if(_.isNil(this.props.indexId)){
      return (
        <View
        style={{
          flex: 1, 
          flexDirection: 'column',
          justifyContent: 'space-between'}}
        >
        <Wrapper
          navigation={this.props.navigation} 
          title={this.state.pagesObj.getPageTitle()} 
          scrollRefPopulator={(scrollRef) => {this.scrollRef = scrollRef}}
          style={{
            flex: 1,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <PrivacyDialog storage={this.props.storage}></PrivacyDialog>
            <View style={{ marginBottom: -20}}/>
            <ContentIndex storage={this.props.storage} randomiseHomepage={this.state.randomiseHomepage} navigation={this.props.navigation}/>
        </Wrapper>
        <FAB
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
          }}
          small
          icon="arrow-upward"
          onPress={() => this.scrollRef.current.scrollTo({y: 0, animated: true})}
        />
        </View>
      )
    }
    return (
      <View
        style={{
          flex: 1, 
          flexDirection: 'column',
          justifyContent: 'space-between'}}
        >
      <Wrapper
        navigation={this.props.navigation} 
        title={this.state.pagesObj.getPageTitle(this.props.indexId)} 
        scrollRefPopulator={(scrollRef) => {this.scrollRef = scrollRef}}
        style={{flex:1, backgroundColor: commonStyle.contentBackgroundColor}}
        rightComponent={
          <Appbar.Action 
          icon={this.state.isFavourite ? 'favorite' : 'favorite-border'}
          onPress={() => {
            this.props.storage.toggleFavourite({
              pageKey: 'home',
              indexId: this.props.indexId, 
              displayName: this.state.pagesObj.getPageTitle(this.props.indexId)
            })
          }}
          />
        }
      >
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
      </Wrapper>
      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        small
        icon="arrow-upward"
        onPress={() => this.scrollRef.current.scrollTo({y: 0, animated: true})}
      />
      </View>
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
            <TouchableHighlight style={{ flex: 1 }} onPress={() => {
              this.props.analytics.logEvent('openedGitHubLink', {page: this.props.pagePermalink})
              Linking.openURL(this.props.pageGitHubLink)
            }}>
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