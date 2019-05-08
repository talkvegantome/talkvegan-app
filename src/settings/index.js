import React from 'react';
import {Text, View, SafeAreaView, ScrollView, AsyncStorage } from 'react-native';
import Wrapper from '../navigation/Wrapper.js'
import { light, content} from '../styles/Common.style.js';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    AsyncStorage.getItem('settings').then(asyncStorageRes => {
      let settings = {}

      settings['language'] = 'fr'
      this.setState({
        'settings': settings
      })
      AsyncStorage.setItem('settings', JSON.stringify(settings));
    })
    this.state = {settings: null}
  }
  render(){
    return (
      <Wrapper navigation={this.props.navigation}>
        <Text>{JSON.stringify(this.state.settings)}</Text>
      </Wrapper>
    )
  }
}

export default SettingsScreen
