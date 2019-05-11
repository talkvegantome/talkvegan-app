import React from 'react';
import { SafeAreaView,
  View,
  AsyncStorage,
  Text,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Picker } from 'react-native';
import Wrapper from '../navigation/Wrapper.js'
import {markdownStyles} from '../styles/Markdown.style.js'
import { light, content} from '../styles/Common.style.js';

style = {
  settingLabel: {
    fontSize: 22,
    lineHeight: 30
  },
  settingValue: {
    fontSize: 18,
    lineHeight: 30,
  }
}
class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.settings.triggerUpdateMethods.push((settings) => {
      this.setState({settings:settings})
    })
    this.state = {
      modalVisible: false,
      settings: this.props.settings.settings
    }
  }
  updateSetting(settingName, value){
    settings = this.state.settings;
    settings[settingName] = value;
    this.setState(settings)

    AsyncStorage.setItem('settings', JSON.stringify(this.state.settings)).then(() =>{
      this.props.settings.refreshSettings()
    });

  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render(){
    return (
      <Wrapper navigation={this.props.navigation}>
        <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
          >
          <SafeAreaView style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <View>
              <Text style={{fontSize: 22}}  >Select Language</Text>
            </View>
            <View style={{marginVertical: 20}}>
              <Picker
                selectedValue={this.state.settings.language}
                itemStyle={{width: 100, height: 100, }}
                onValueChange={(itemValue, itemIndex) =>
                  this.updateSetting('language', itemValue)
                }>
                <Picker.Item label="English" value="en" />
                <Picker.Item label="Francais" value="fr" />
              </Picker>
            </View>
            <View>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>Done</Text>
              </TouchableHighlight>
            </View>
          </SafeAreaView>
        </Modal>
        <View style={{marginTop: 20}}>
          <SettingsItem label='Language' value={this.state.settings.language}
            onPress={() => {this.setModalVisible(!this.state.modalVisible)}}/>
        </View>
      </Wrapper>
    )
  }
}

class SettingsItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity
        onPress={() => {this.props.onPress()}}
        style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white'}}
        >
        <Text style={style.settingLabel}>{this.props.label}</Text>
        <Text style={style.settingValue}>{this.props.value}</Text>
      </TouchableOpacity>
    )
  }
}

export default SettingsScreen
