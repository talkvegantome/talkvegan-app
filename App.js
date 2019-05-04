/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Platform, StyleSheet, Button, Text, ScrollView, Dimensions, SafeAreaView} from 'react-native';
import {createStackNavigator, createDrawerNavigator, createMaterialTopTabNavigator, createAppContainer} from 'react-navigation';
import {Header} from 'react-native-elements'
// https://medium.com/@mehulmistri/drawer-navigation-with-custom-side-menu-react-native-fbd5680060ba
import SideMenu from './sideMenu.js'
import loadLocalResource from 'react-native-local-resource'
import {pages, menu} from './pages.js'
import { MarkdownView } from 'react-native-markdown-view'
import { primary, secondary, light, highlight, dark} from './colours.js'

const styles = StyleSheet.create({
  content: {
    textAlign: 'justify',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  }
});
const markdownStyles =  StyleSheet.create({
  heading1: {
    marginTop: 0,
    color: primary,
    fontFamily: 'Helvetica',
    marginBottom: 10,
    lineHeight: 45,
  },
  heading2: {
    marginTop: 10,
    color: primary,
    fontFamily: 'Helvetica',
    marginBottom: 10,
  },
  paragraph: {
    fontFamily: 'Georgia',
    fontSize: 18,
    textAlign: 'justify',
    lineHeight: 28,
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
      <View style={{flex: 1}}>
        <Header
          leftComponent={{ icon: 'menu', color: light,  onPress: () => this.props.navigation.openDrawer()}}
          centerComponent={{text: 'VegBook', style: {color: light, fontSize: 40, fontFamily: 'Helvetica', lineHeight:40}}}
          containerStyle={{
              backgroundColor: primary,
              justifyContent: 'space-around',
            }}
          />
        <SafeAreaView style={{flex: 1, backgroundColor: light}}>

          <ScrollView style={styles.content}>

              <MarkdownView styles={markdownStyles}>{pages[this.props.navigation.getParam('indexId','default')]}</MarkdownView>
          </ScrollView>
        </SafeAreaView>
      </View>
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
