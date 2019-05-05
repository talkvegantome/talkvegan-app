/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Platform, StyleSheet, Button, Text, ScrollView, Dimensions, SafeAreaView, Linking} from 'react-native';
import {createStackNavigator, createDrawerNavigator, createMaterialTopTabNavigator, createAppContainer} from 'react-navigation';
import {Header} from 'react-native-elements'
// https://medium.com/@mehulmistri/drawer-navigation-with-custom-side-menu-react-native-fbd5680060ba
import SideMenu from './sideMenu.js'
import loadLocalResource from 'react-native-local-resource'
import {pages} from './pages.js'
import Markdown from 'react-native-simple-markdown';

import { markdownStyles } from './markdownStyles.js'
import { primary, secondary, light, highlight, dark, paragraphFont, headerFont} from './commonStyling.js'

const styles = StyleSheet.create({
  content: {
    textAlign: 'justify',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
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
          centerComponent={{text: 'VegBook', style: {color: light, fontSize: 40, fontFamily: headerFont, lineHeight:40}}}
          containerStyle={{
              backgroundColor: primary,
              justifyContent: 'space-around',
            }}
          />
        <SafeAreaView style={{flex: 1, backgroundColor: light}}>

          <ScrollView style={styles.content}>

              <Markdown
                styles={markdownStyles}
                renderListBullet={(ordered, index) => {
                  return (
                    <Text/>
                    )
                  }}
                renderLink={(href, title, childrenm) => {
                  return(

                     <Text style={{flexDirection: 'row'}}> Start here, </Text>

                    )
                  }}

              >
                {pages[this.props.navigation.getParam('indexId','splash')]}
              </Markdown>
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
    contentComponent: ({ navigation }) => (<SideMenu navigation={navigation}/>
    ),
    drawerWidth: Dimensions.get('window').width - 120,
});
const MyApp = createAppContainer(MyDrawerNavigator);
export default MyApp
