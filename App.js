/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Button, Text, ScrollView} from 'react-native';
import {createStackNavigator, createDrawerNavigator, createMaterialTopTabNavigator, createAppContainer} from 'react-navigation';


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

class MyIndexScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Index',


  };

  render() {
    return (
      <ScrollView style={styles.content}>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Go back home"
        />
      </ScrollView>
    );
  }
}

type Props = {};
class App extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Home'
  };
  constructor(props){
    super(props);
    this.state ={ isLoading: true, copy:null}
  }

  componentDidMount(){
    loadLocalResource(myResource).then((myResourceContent) => {
            this.setState({copy: myResourceContent})
        }
    )
  }
  static navigationOptions = {
    header: null,
  };

  static propTypes = {};
  static defaultProps = {};

  render() {
    return (
      <ScrollView style={styles.content}>
      <Button
    onPress={() => this.props.navigation.navigate('Index')}
    title="Go to Index"
  />
          <MarkdownView >{this.state.copy}</MarkdownView>
      </ScrollView>
    );
  }

}

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: App,
  },
  Index: {
    screen: MyIndexScreen,
  },
});
const MyApp = createAppContainer(MyDrawerNavigator);
export default MyApp
