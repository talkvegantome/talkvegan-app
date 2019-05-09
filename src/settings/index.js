import React from 'react';
import {Text, View, SafeAreaView, ScrollView, AsyncStorage , Picker} from 'react-native';
import Wrapper from '../navigation/Wrapper.js'
import { light, content} from '../styles/Common.style.js';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.settings.triggerUpdateMethods.push((settings) => {
      this.setState({settings:settings})
    })
    this.state = {
      settings: this.props.settings.settings
    }
  }
  updateSetting(settingName, value){
    this.state.settings[settingName] = value
    AsyncStorage.setItem('settings', JSON.stringify(this.state.settings)).then(() =>{
      this.props.settings.refreshSettings()
    })

  }
  render(){
    return (
      <Wrapper navigation={this.props.navigation}>
        <Picker
          selectedValue={this.state.settings.language}
          style={{height: 50, width: 100}}
          onValueChange={(itemValue, itemIndex) =>
            this.updateSetting('language', itemValue)
          }>
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Francais" value="fr" />
        </Picker>
      </Wrapper>
    )
  }
}

export default SettingsScreen
