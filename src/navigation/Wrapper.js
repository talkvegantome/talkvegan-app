import React from 'react';
import { Header } from 'react-native-elements';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import { commonStyle, PaperTheme } from '../styles/Common.style.js';
import { navContainerStyle, navHeaderStyle } from '../styles/Header.style.js'
import { Provider as PaperProvider, Appbar, BottomNavigation } from 'react-native-paper';
import { NavigationActions } from "react-navigation";
import { Storage } from '../Storage.js'
import Home from './Home.js';

class Wrapper extends React.Component {


  render(){

    return (
      <View style={{flex: 1}}>
      <PaperProvider theme={PaperTheme} >
        <Appbar.Header style={{backgroundColor: commonStyle.headerBackgroundColor}}>
          <Appbar.Action
          icon='keyboard-arrow-left'
          onPress={() => {
            this.props.navigation.goBack()
          }}
          />
          <Appbar.Content
            titleStyle={{
              color: commonStyle.headerFontColor}}
            title={this.props.title}
          />
        </Appbar.Header>
        <ScrollView style={{...commonStyle.content,...this.props.style}}>
          {this.props.children}
        </ScrollView>
      </PaperProvider>
      </View>
    ) 
  }
}

export default Wrapper
