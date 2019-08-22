/**
 * TalkVeganToMe
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import SettingsScreen from './src/settings/SettingsScreen.js';
import SearchScreen from './src/search/Search.js'
import HomeScreen from './src/home/Home.js';
import {_} from 'lodash'

import { Storage } from './src/Storage.js'
import Analytics from './src/analytics'

import { commonStyle, PaperTheme } from './src/styles/Common.style.js';
import { BottomNavigation } from 'react-native-paper';


class BottomDrawer extends React.Component {
  static defaultProps = {
    style: {}
  }
  constructor(props){
    super(props)
    this.state.storage = new Storage()
    this.state.storage.triggerUpdateMethods.push((storage) => this.setState(this.returnState(storage)))
    this.state = {...this.state, ...this.returnState(this.state.storage)}
  }

  returnState(storage){
    return { 
      storage: storage,
      analytics: new Analytics(storage.settings),
      navigationHistory: [{
        index: 0,
        routeParams: {}
      }]
    }
  }
  state = {
    index: 0,
    routes: [
      { key: 'home', title: 'Home', icon: 'home' },
      { key: 'search', title: 'Search', icon: 'search' },
      { key: 'settings', title: 'Settings', icon: 'settings' },
    ]
  }
  

  _handleIndexChange = (index) => {
    this.setState({ index });
  }
  _handleTabPress = (route) => {
    this.state.analytics.logEvent('navigateToPage', {page: route.route.key, params: {}})
    this.setState({
      routeParams: {},
      navigationHistory: this.state.navigationHistory.concat({
        index: _.findIndex(this.state.routes, ['key', route.route.key]),
        routeParams: {}
      })
    })
  }

  _renderScene = ({route, jumpTo}) => {
    let page = null
    if(route.key == 'home'){
      return <HomeScreen
        storage={this.state.storage} 
        navigation={this}
        {...this.state.routeParams} 
      />
    }
    if(route.key == 'settings'){
      return <SettingsScreen
        storage={this.state.storage} 
        navigation={this}
      />
    }
    if(route.key == 'search'){
      return <SearchScreen 
        storage={this.state.storage} 
        navigation={this}
      />
    }
    return page
  }

  navigate = (title, props) => {
    index = _.findIndex(this.state.routes, ['title', title])
    this.state.analytics.logEvent('navigateToPage', {page: title, params: props})
    this.setState({
      index: index, 
      routeParams: props,
      navigationHistory: this.state.navigationHistory.concat({
        index: index,
        routeParams: props
      })
    })
  }

  goBack = () => {
    lastLocation = this.state.navigationHistory[this.state.navigationHistory.length-2]
    if(_.isNil(lastLocation)){
      return
    }
    navigationHistoryLessLastLocation = this.state.navigationHistory.slice(
      0,
      this.state.navigationHistory.length-1
    )
    
    this.setState({
      index: lastLocation.index,
      routeParams: lastLocation.routeParams,
      navigationHistory: navigationHistoryLessLastLocation
    })
  }

  render(){
    return ( 
      <BottomNavigation
        theme={PaperTheme}
        activeColor={commonStyle.headerFontColor}
        inactiveColor={commonStyle.headerFontColor}
        navigationState={this.state}
        onTabPress={this._handleTabPress}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    )
  }
}


export default BottomDrawer

