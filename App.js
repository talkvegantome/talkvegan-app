/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View, ScrollView, Dimensions, SafeAreaView, AsyncStorage } from 'react-native';
import { createDrawerNavigator, createAppContainer} from 'react-navigation';
// https://medium.com/@mehulmistri/drawer-navigation-with-custom-side-menu-react-native-fbd5680060ba
import Markdown from 'react-native-markdown-renderer';
import SideMenu from './src/navigation/SideMenu.js';
import Pages from './src/Pages.js';
import SettingsScreen  from './src/settings';
import _ from 'lodash';
// import Markdown from 'react-native-simple-markdown'; // This was garbage as each _word_ was a separte <Text> making formatting a nightmare!

import Wrapper from './src/navigation/Wrapper.js'
import { markdownRules, preProcessMarkDown } from './src/MarkDownRules.js'
import { markdownStyles } from './src/styles/Markdown.style.js';
import { light, content} from './src/styles/Common.style.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.props.settings.triggerUpdateMethods.push((settings) => {
      let pagesObj = new Pages(settings)
      this.setState({
        pagesObj: pagesObj,
        settings: settings,
        pages: pagesObj.getPages(),
        splashPath: pagesObj.getSplashPath()
      })
    })
    let pagesObj = new Pages(this.props.settings.settings)
    const markdownRulesObj = new markdownRules(props.navigation);
    this.state = {
      pagesObj: pagesObj,
      pages: pagesObj.getPages(),
      splashPath: pagesObj.getSplashPath(),
      settings: this.props.settings.settings,
      markDownRules: markdownRulesObj.returnRules(),
    };
  }

  static navigationOptions = {
    drawerLabel: 'Home',
  };

  static navigationOptions = {
    header: null,
  };


  //pageIndex = this.props.navigation.getParam('indexId', '/'+ this.state.settings.language+'/splash/')

  getPage(){
    let pageIndex = this.props.navigation.getParam('indexId')
    if (pageIndex){

      return this.state.pages[pageIndex] ? this.state.pages[pageIndex] : 'error loading ' + pageIndex + 'sorry :('

    }
    return this.state.pages[this.state.splashPath]

  }
  getPageTitle(){
    let pageTitle = this.state.pagesObj.getFriendlyName(this.props.navigation.getParam('indexId'))
    return pageTitle ? pageTitle : 'TalkVeganToMe'
  }
  render() {

    return (
      <Wrapper navigation={this.props.navigation} title={this.getPageTitle()}>
        <Markdown style={markdownStyles} rules={this.state.markDownRules}>
          {
              preProcessMarkDown(
                  this.getPage()
              )
            }
        </Markdown>
      </Wrapper>
    );
  }
}

class Settings{
  constructor(){
    this.settings = {
      language: 'en'
    }
    this.triggerUpdateMethods = []
    this.refreshSettings()
  }

  refreshSettings(){
    AsyncStorage.getItem('settings').then(asyncStorageRes => {
      this.settings =  JSON.parse(asyncStorageRes)
    }).then(() => {
        _.forEach(this.triggerUpdateMethods, (method) => {
          method(this.settings)
        })
    })
  }
}

let settings = new Settings()

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: ({ navigation }) => (<App settings={settings} navigation={navigation} />),
  },
  Settings: {
    screen: ({ navigation }) => (<SettingsScreen settings={settings} navigation = {navigation} />)
  }

  }, {
  contentComponent: ({ navigation }) => (<SideMenu settings={settings} navigation={navigation} />
  ),
  drawerWidth: Dimensions.get('window').width - 120,
});
const MyApp = createAppContainer(MyDrawerNavigator);
export default MyApp;
