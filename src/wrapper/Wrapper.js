import React from 'react';
import { _ } from 'lodash';
import { View, ScrollView } from 'react-native';
import { commonStyle, PaperTheme } from '../styles/Common.style.js';
import { Provider as PaperProvider, Appbar, BottomNavigation } from 'react-native-paper';

class Wrapper extends React.Component {
  constructor(props){
    super(props)
    this.scrollRef = React.createRef();
  }
  componentDidUpdate(){
    this.scrollRef.current.scrollTo({y: 0, animated: false})
  }
  render(){
    return (
      <View style={{flex: 1}}>
      <PaperProvider theme={PaperTheme} >
        <Appbar.Header style={{backgroundColor: commonStyle.headerBackgroundColor}}>
          <Appbar.Action 
          style={
            // Hide back button if there's no back to go to.
            this.props.navigation.state.navigationHistory.length == 1 ? {display: 'none'} : {}
          }
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
        <ScrollView ref={this.scrollRef} style={{...commonStyle.content,...this.props.style}}>
          {this.props.children}
          <View style={{height:50}}></View>
        </ScrollView>
      </PaperProvider>
      </View>
    ) 
  }
}

export default Wrapper
