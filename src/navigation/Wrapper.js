import React from 'react';
import { Header } from 'react-native-elements';
import {Text, View, SafeAreaView, ScrollView, AsyncStorage } from 'react-native';
import { light, content} from '../styles/Common.style.js';
import { navContainerStyle, navHeaderStyle } from '../styles/Header.style.js'

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    style: {}
  }
  render(){
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={{ icon: 'menu', color: light, navHeaderStyle, onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={{
            text: this.props.title,
            style: navHeaderStyle,
          }}
          rightComponent={{
            icon: 'settings',
            color: light,
            onPress: () => this.props.navigation.navigate('Settings')
          }}
          containerStyle={navContainerStyle}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={{...content,...this.props.style}}>
            {this.props.children}
          </ScrollView>
        </SafeAreaView>
      </View>
    )
  }
}

export default Wrapper
