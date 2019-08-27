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
import FavouritesScreen from './src/navigation/Favourites'
import { _ } from 'lodash'

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
    this.state.storage.addOnRefreshListener((storage) => this.setState(this.returnState(storage)))
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
  onNavigationListeners = []
  state = {
    
    index: 0,
    routes: [
      { key: 'home', title: 'Home', icon: 'home' },
      { key: 'search', title: 'Search', icon: 'search' },
      { key: 'favourites', title: 'Favourites', icon: 'favorite' },
      { key: 'settings', title: 'Settings', icon: 'settings' },
    ]
  }
  
  _appendToHistory(index, params){
    let lastLocation = _.nth(this.state.navigationHistory, -1)
    if(lastLocation.index === index && _.isEqual(lastLocation.routeParams,params)){
      return
    }
    this.setState({
      routeParams: {},
      navigationHistory: this.state.navigationHistory.concat({
        index: index,
        routeParams: params
      })
    })
  }

  _handleIndexChange = (index) => {
    this.setState({ index });
  }
  _handleTabPress = (route) => {
    this.state.analytics.logEvent('navigateToPage', {page: route.route.key, params: {}})
    this._appendToHistory(
      _.findIndex(this.state.routes, ['key', route.route.key]),
      {}
    )
    console.log('navigated in APP.js')
    this._triggerNavigationListeners()
    this.setState({routeParams: {}})
  }

  _renderScene = ({route}) => {
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
    if(route.key == 'favourites'){
      return <FavouritesScreen 
        storage={this.state.storage} 
        navigation={this}
      />
    }
    return page
  }
  _triggerNavigationListeners(key, props={}){
    _.forEach(this.onNavigationListeners, (method) => method(key, props))
  }
  navigate = (key, props) => {
    let index = _.findIndex(this.state.routes, ['key', key])
    this.state.analytics.logEvent('navigateToPage', {page: key, params: props})
    this._appendToHistory(index, props)
    this._triggerNavigationListeners(key, props)
    this.setState({
      index: index, 
      routeParams: props
    })
  }

  goBack = () => {
    let lastLocation = _.nth(this.state.navigationHistory, -2) // current location is -1
    if(_.isNil(lastLocation)){
      return
    }
    let navigationHistoryLessLastLocation = this.state.navigationHistory.slice(
      0,
      this.state.navigationHistory.length-1
    )
    
    this.setState({
      index: lastLocation.index,
      routeParams: lastLocation.routeParams,
      navigationHistory: navigationHistoryLessLastLocation
    })
  }

  addOnNavigateListener = (func) => {
    console.log("adding navigation listener" + func)
    this.onNavigationListeners = this.onNavigationListeners.concat(func)
    
    console.log(this.onNavigationListeners)
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

