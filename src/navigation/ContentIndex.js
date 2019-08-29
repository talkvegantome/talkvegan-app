import React, {Component} from 'react';
import {Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import RemoveMarkdown from 'remove-markdown';
import {commonStyle} from '../styles/Common.style'
import {markdownStyles} from '../styles/Markdown.style'
import _ from 'lodash';

import CarouselNav, {NavigationCard} from './CarouselNav'
import Analytics from '../analytics'

import Pages from '../Pages.js'



export default class ContentIndex extends Component{
  constructor(props) {
    super(props);
    this.props.storage.addOnRefreshListener((storage) => this.refreshStorage(storage))
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
  

  render(){
    let menuSorted = _.sortBy(this.state.menu, ['weight', 'friendlyName'])
    return _.map(menuSorted, (headerItem, i) => 
      <CarouselNavWrapper 
        headerItem={headerItem} 
        key={i}
        randomiseHomepage={this.props.randomiseHomepage}
        navigation={this.props.navigation}
      />
    )
  }
  
}

class CarouselNavWrapper extends React.Component{
  state = {
    expanded: false
  }
  navigateToScreen = (indexId) => () => {
    // Navigation is always to the 'Home' screen, but content changes based on the indexId
    this.props.navigation.navigate('home', {indexId: indexId});
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
  render() {
    let headerFriendlyName = this.props.headerItem.friendlyName
    let items = this.generateCardList(this.props.headerItem)
    return (
      <View key={headerFriendlyName}>
          <View style={{...commonStyle.content,...{flex: 1, flexDirection: 'row'}}}>
            <Button
              mode='contained'
              dark={true}
              color={commonStyle.secondary}
              icon={this.state.expanded ? 'expand-more' : "chevron-right"}
              style={markdownStyles.heading1}
              size={20}
              onPress={() => this.setState({expanded: !this.state.expanded})}
            >{headerFriendlyName}</Button>
            
          </View>
          {!this.state.expanded && 
            <CarouselNav items={items} randomiseHomepage={this.props.randomiseHomepage} navigation={this.props.navigation}></CarouselNav>
          }
          <View
            style={{
              borderLeftColor: commonStyle.primary,
              borderLeftWidth: 2,
              marginLeft: 30, 
              marginRight: 40, 
            }}
          >
            <View style={{marginTop:-10}}></View>
            {this.state.expanded && 
              _.map(items, (item, i) => <NavigationCard key={i} item={item} style={{marginLeft: 10, marginTop: 10, marginBottom: 10}} />)
            }
          </View>
      </View>
    )
  }
}