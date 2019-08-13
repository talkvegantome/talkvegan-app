/**
 * TalkVeganToMe
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Dimensions, Share, TouchableHighlight, Text, View, ScrollView, Linking } from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import { createAppContainer } from 'react-navigation';
import Markdown from 'react-native-markdown-renderer';
import SideMenu, { MenuItems } from './src/navigation/SideMenu.js';
import Pages from './src/Pages.js';
import SettingsScreen from './src/settings/SettingsScreen.js';
import {_} from 'lodash'

import { Storage } from './src/Storage.js'

import { commonStyle, PaperTheme } from './src/styles/Common.style.js';
import { Provider as PaperProvider, Appbar, BottomNavigation } from 'react-native-paper';
import Home from './src/navigation/Home.js';

let storage = new Storage()

import Analytics, { PrivacyDialog } from './src/analytics'

class BottomDrawer extends React.Component {
  static defaultProps = {
    style: {}
  }
  state = {
    storage: new Storage(),
    index: 0,
    routes: [
      { key: 'home', title: 'Home', icon: 'home' },
      { key: 'search', title: 'Search', icon: 'search' },
      { key: 'settings', title: 'Settings', icon: 'settings' },
    ],
    navigationHistory: [{
      index: 0,
      routeParams: {}
    }]
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = ({route, jumpTo}) => {
    let page = null
    if( route.key == 'home'){
      page = <Home 
        storage={this.state.storage} 
        navigation={this}
        {...this.state.routeParams} 
      />
    }
    return page
  }

  navigate = (title, props) => {
    index = _.findIndex(this.state.routes, ['title', title])
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
    console.log(this.state)
    lastLocation = this.state.navigationHistory[this.state.navigationHistory.length-2]
    
    console.log(lastLocation)
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
    return ( <BottomNavigation
      theme={PaperTheme}
      activeColor={commonStyle.headerFontColor}
      inactiveColor={commonStyle.headerFontColor}
      navigationState={this.state}
      onIndexChange={this._handleIndexChange}
      renderScene={this._renderScene}
    />)
    
  }
}


export default BottomDrawer

