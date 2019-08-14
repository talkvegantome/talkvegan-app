import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from '../styles/SideMenu.style.js';
import {Text, View, SafeAreaView } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import {commonStyle} from '../styles/Common.style'
import {markdownStyles} from '../styles/Markdown.style'
import _ from 'lodash';

import CarouselNav from './CarouselNav'
import Analytics from '../analytics'

import Pages from '../Pages.js'



export default class ContentIndex extends Component{
  constructor(props) {
    super(props);
    this.props.storage.triggerUpdateMethods.push((storage) => this.refreshStorage(storage))
    let pages = new Pages(this.props.storage)
    let analytics = new Analytics(this.props.storage.settings)
    this.state = {
      analytics: analytics,
      settings: this.props.storage.settings,
      menu: pages.getMenu(),
      splashPath: pages.getSplashPath(),
      headerVisibility: {}
    };
  }

  refreshStorage(storage){
    let pages = new Pages(storage)
    let analytics = new Analytics(storage.settings)
    this.setState({
      analytics: analytics,
      settings: storage.settings,
      menu: pages.getMenu(storage),
      splashPath: pages.getSplashPath()
    })
  }
  navigateToScreen = (indexId) => () => {
    // Navigation is always to the 'Home' screen, but content changes based on the indexId
    this.props.navigation.navigate('Home', {indexId: indexId});
    this.state.analytics.logEvent('navigateToPage', {relPath: indexId})
  }
  toggleHeaderVisibility = (headerName) => {
    let headerVisibility = this.state.headerVisibility
    if(headerVisibility[headerName]){
      headerVisibility[headerName] = false
    }else{
        _.forEach(headerVisibility, (val, headerName) => {
          headerVisibility[headerName] = false
        })
        headerVisibility[headerName] = true
    }

    this.setState({headerVisibility: headerVisibility})
  }
  generateCardList(headerItem){
    return _.filter(_.sortBy(headerItem.subItems, ['weight', 'friendlyName']).map((item) => {
        if(!_.isNil(item.displayInApp) && !item.displayInApp){
            // Don't display this page if it has displayInApp=false
            return 
        }
        return {
            title: item.friendlyName,
            content: item.description ? item.description : this.attemptToSanitiseMarkdown(item.rawContent),
            navigateTo: this.navigateToScreen(item.relativePermalink)
        }
        
    }), function(o){return !_.isNil(o)})
  }
  attemptToSanitiseMarkdown(text){
      return text.replace(/>|#/g,'')
  }
  render(){
    let menuSorted = _.sortBy(this.state.menu, ['weight', 'friendlyName'])
    return _.map(menuSorted, (headerItem) => {
      let headerFriendlyName = headerItem.friendlyName
      let items = this.generateCardList(headerItem)
     

      let headerVisibility = this.state.headerVisibility
      let display = headerFriendlyName in headerVisibility && headerVisibility[headerFriendlyName]? 'flex': 'none'
      return (
        <View key={headerFriendlyName}>
            <View style={commonStyle.content}>
                <Text style={markdownStyles.heading1}>{headerFriendlyName}</Text> 
            </View>
            <CarouselNav items={items} navigation={this.props.navigation}></CarouselNav>
        
        </View>
      )
    })
  }
  
}

