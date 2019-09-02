import React from 'react';
import { Share, StyleSheet, View, Linking } from 'react-native';
import { Appbar, FAB, ActivityIndicator, DefaultTheme } from 'react-native-paper';
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
        <Markdown style={markdownStyles} rules={this.state.markdownRulesObj.returnRules()}>
          {this.state.markdownRulesObj.preProcessMarkDown(this.state.pagesObj.getPageContent(this.props.indexId))}
        </Markdown>
      </Wrapper>
      <PageMenu
        previousPage={this.state.pagesObj.getPageOffsetInCategory(this.props.indexId, -1)['relativePermalink']} 
        nextPage={this.state.pagesObj.getPageOffsetInCategory(this.props.indexId, 1)['relativePermalink']} 
        navigation={this.props.navigation}
        pagePermalink={this.state.pagesObj.getPagePermalink(this.props.indexId)}
        pageGitHubLink={this.state.pagesObj.getPageGitHubLink(this.props.indexId)}
        analytics={this.state.analytics}
        scrollRef={this.scrollRef}
      />
      </View>
    );
    
          
  }
}

class PageMenu extends React.Component {
  _navigateForward(){
    this.props.navigation.navigate('home', {
      indexId: this.props.nextPage,
      from: this.props.thisPage
    })
  }
  _navigateBackward(){
    this.props.navigation.navigate('home', {
      indexId: this.props.previousPage,
      from: this.props.thisPage
    })
  }
  render() {
    return (
      <Appbar style={styles.PageMenu} theme={pageMenuTheme}>
        <Appbar.Action icon="arrow-back" onPress={() => this._navigateBackward()} />
        <Appbar.Action icon="share" onPress={() => { Share.share({ message: this.props.pagePermalink }).then((result) => {
                this.props.analytics.logEvent('sharedPage', {page: this.props.pagePermalink, activity: result.activityType})
                }).catch((err) => {this.props.analytics.logEvent('error', {errorDetail: err})})}} />
        <Appbar.Action icon="edit" onPress={() => {
              this.props.analytics.logEvent('openedGitHubLink', {page: this.props.pagePermalink})
              Linking.openURL(this.props.pageGitHubLink)
            }} />
        <Appbar.Action icon="arrow-upward"
        onPress={() => this.props.scrollRef.current.scrollTo({y: 0, animated: true})} />
        <Appbar.Action icon="arrow-forward" onPress={() => this._navigateForward()} />
      </Appbar>
    )
  }
}

const styles = StyleSheet.create({
  PageMenu: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'absolute',
    width: "100%",
    right: 0,
    bottom: 0,
  },
});

const pageMenuTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: commonStyle.secondary,
    accent: commonStyle.white,
    onSurface: '#FFFFFF'
  }
}