import React from 'react';
import { Header } from 'react-native-elements';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { commonStyle } from '../styles/Common.style.js';
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
          leftComponent={{
            icon: 'menu',
            color: commonStyle.light,
            iconStyle: {paddingLeft: 10},
            onPress: () => this.props.navigation.openDrawer()
          }}
          centerComponent={{
            text: this.props.title,
            style: navHeaderStyle,
          }}
          rightComponent={{
            icon: 'settings',
            color: commonStyle.light,
            iconStyle: {paddingRight: 10},
            onPress: () => this.props.navigation.navigate('Settings')
          }}
          containerStyle={navContainerStyle}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={{...commonStyle.content,...this.props.style}}>
            {this.props.children}
          </ScrollView>
        </SafeAreaView>
      </View>
    )
  }
}

export default Wrapper
