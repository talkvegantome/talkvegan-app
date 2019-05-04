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
import {pages, menu} from './pages.js'
import { MarkdownView } from 'react-native-markdown-view'


const styles = StyleSheet.create({
  content: {
    textAlign: 'justify',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  }
});
const markdownStyles =  StyleSheet.create({
  heading1: {
    marginBottom: 10,
  },
  paragraph: {
    textAlign: 'justify',
    lineHeight: 22,
  }
});

type Props = {};
class App extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Home'
  };


  static navigationOptions = {
    header: null,
  };

  static propTypes = {};
  static defaultProps = {};
  //static navigation  = this.props.navigation;
  render() {
    return (
      <ScrollView style={styles.content}>

          <MarkdownView styles={markdownStyles}>{pages[this.props.navigation.getParam('indexId','default')]}</MarkdownView>
      </ScrollView>
    );
  }

}



const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: App,
  }

},{
    contentComponent: ({ navigation }) => (<SideMenu navigation={navigation} menu={menu}/>
    ),
    drawerWidth: Dimensions.get('window').width - 120,
});
const MyApp = createAppContainer(MyDrawerNavigator);
export default MyApp
