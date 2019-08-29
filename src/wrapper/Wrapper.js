import React from 'react';
import { View, ScrollView } from 'react-native';
import { commonStyle, PaperTheme } from '../styles/Common.style.js';
import { Provider as PaperProvider, Appbar } from 'react-native-paper';
import { _ } from 'lodash';

class Wrapper extends React.Component {
  constructor(props){
    super(props)
    this.scrollRef = React.createRef();
    if(!_.isNil(this.props.scrollRefPopulator)){
      this.props.scrollRefPopulator(this.scrollRef)
    }
    this.props.navigation.addOnNavigateListener(() => {
      this.scrollRef.current.scrollTo({y: 0, animated: false})
    })
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
          {this.props.rightComponent}
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
