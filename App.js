/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Button, Text, ScrollView, Dimensions} from 'react-native';
import {createStackNavigator, createDrawerNavigator, createMaterialTopTabNavigator, createAppContainer} from 'react-navigation';

// https://medium.com/@mehulmistri/drawer-navigation-with-custom-side-menu-react-native-fbd5680060ba
import SideMenu from './sideMenu.js'
import loadLocalResource from 'react-native-local-resource'
import myResource from './MarkDown/index.md'
import { MarkdownView } from 'react-native-markdown-view'


const styles = StyleSheet.create({
  heading: {
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  heading1: {
    fontSize: 32,
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  heading2: {
    fontSize: 24,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 13,
  },
  heading6: {
    fontSize: 11,
  },
  content: {
    marginTop:50,
    marginBottom:50,
    marginRight:20,
    marginLeft:20,
  }
});

type Props = {};
class App extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Home'
  };
  pages = {
    'default': "# This is the default page",
    'screen1': "# Screen 1"
  }

  static navigationOptions = {
    header: null,
  };

  static propTypes = {};
  static defaultProps = {};
  //static navigation  = this.props.navigation;
  render() {
    return (
      <ScrollView style={styles.content}>

          <MarkdownView >{this.pages[this.props.navigation.getParam('indexId','default')]}</MarkdownView>
      </ScrollView>
    );
  }

}

class DetailPage extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Detail'
  };
  pages = {
    'default': "# This is the default page",
    'screen1': "# Screen 1"
  }

  static navigationOptions = {
    header: null,
  };

  static propTypes = {};
  static defaultProps = {};
  //static navigation  = this.props.navigation;
  render() {
    return (
      <ScrollView style={styles.content}>

          <MarkdownView >- {this.props.navigation.getParam('indexId','default')}</MarkdownView>
      </ScrollView>
    );
  }

}

const menu = [
  {
    "friendlyName": "Header 1",
    "screenId": "screen1",
    "subItems":[
      {
        "friendlyName": "Item 1",
        "screenId": "screen1"
      }
    ]
  }
]

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: App,
  },
  Detail: {
    screen: DetailPage,
  },

},{
    contentComponent: ({ navigation }) => (<SideMenu navigation={navigation} menu={menu}/>
    ),
    drawerWidth: Dimensions.get('window').width - 120,
});
const MyApp = createAppContainer(MyDrawerNavigator);
export default MyApp
