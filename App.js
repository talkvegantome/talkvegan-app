/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View, ScrollView, Dimensions, SafeAreaView, } from 'react-native';
import { createDrawerNavigator, createAppContainer} from 'react-navigation';
import { Header } from 'react-native-elements';
// https://medium.com/@mehulmistri/drawer-navigation-with-custom-side-menu-react-native-fbd5680060ba
import Markdown from 'react-native-markdown-renderer';
import SideMenu from './src/navigation/SideMenu.js';
import { pages } from './src/Pages.js';
// import Markdown from 'react-native-simple-markdown'; // This was garbage as each _word_ was a separte <Text> making formatting a nightmare!

import { markdownRules, preProcessMarkDown } from './src/MarkDownRules.js'
import { markdownStyles } from './src/styles/Markdown.style.js';
import { navContainerStyle, navHeaderStyle } from './src/styles/Header.style.js'
import { light, content} from './src/styles/Common.style.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    const markdownRulesObj = new markdownRules(props.navigation);

    this.state = {
      markDownRules: markdownRulesObj.returnRules(),
    };
  }

  static navigationOptions = {
    drawerLabel: 'Home',
  };

  static navigationOptions = {
    header: null,
  };


  static defaultProps = {};

  // static navigation  = this.props.navigation;
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={{ icon: 'menu', color: light, navHeaderStyle, onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={{
            text: 'TalkVeganToMe',
            style: navHeaderStyle,
          }}
          containerStyle={navContainerStyle}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={content}>
            <Markdown style={markdownStyles} rules={this.state.markDownRules}>
              {
                  preProcessMarkDown(pages[this.props.navigation.getParam('indexId', '/splash/')])
                }
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
  },

}, {
  contentComponent: ({ navigation }) => (<SideMenu navigation={navigation} />
  ),
  drawerWidth: Dimensions.get('window').width - 120,
});
const MyApp = createAppContainer(MyDrawerNavigator);
export default MyApp;
