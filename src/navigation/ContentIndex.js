import React, {Component} from 'react';
import {Text, View } from 'react-native';
import RemoveMarkdown from 'remove-markdown';
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
  }

  generateCardList(headerItem){
    return _.filter(_.sortBy(headerItem.subItems, ['weight', 'friendlyName']).map((item) => {
        if(!_.isNil(item.displayInApp) && !item.displayInApp){
            // Don't display this page if it has displayInApp=false
            return 
        }
        return {
            title: item.friendlyName,
            content: item.description ? item.description : RemoveMarkdown(item.rawContent).replace(/\n/g, ' '),
            navigateTo: this.navigateToScreen(item.relativePermalink)
        }
        
    }), function(o){return !_.isNil(o)})
  }
  
  render(){
    let menuSorted = _.sortBy(this.state.menu, ['weight', 'friendlyName'])
    return _.map(menuSorted, (headerItem) => {
      let headerFriendlyName = headerItem.friendlyName
      let items = this.generateCardList(headerItem)
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

