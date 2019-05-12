import React from 'react';
import { SafeAreaView,
  View,
  AsyncStorage,
  Text,
  Modal,
  TouchableHighlight,
  Linking,
  Picker } from 'react-native';
import { ListItem } from 'react-native-elements';
import Wrapper from '../navigation/Wrapper.js'
import _ from 'lodash';
import languages from './Languages.js'

// style = {
//   settingLabel: {
//     fontSize: 22,
//     lineHeight: 30
//   },
//   settingValue: {
//     fontSize: 18,
//     lineHeight: 30,
//   }
// }

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.storage.triggerUpdateMethods.push((storage) => {
      this.setState({
        settings: storage.settings,
        lastSync: storage.getLastPageDataSync('auto')
      })
    })
    this.state = {
      modalVisible: false,
      storage: this.props.storage,
      lastSync: this.props.storage.getLastPageDataSync('auto'),
      settings: this.props.storage.settings
    }
  }

  updateSetting(settingName, value){
    let settings = this.state.settings;
    settings[settingName] = value;
    this.setState(settings)

    // TODO:  this should be a function on the settings object
    AsyncStorage.setItem('settings', JSON.stringify(this.state.settings)).then(() =>{
      this.props.storage.refreshSettings()
    });

  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  refreshPageData(){
    this.setState({pageDataIsLoading: true})
    this.state.storage.refreshPageData().then(() => {
      this.setState({pageDataIsLoading: false})
      this.props.storage.refreshSettings()
    })
  }

  render(){
    let footer = (
      <ListItem
        onPress={() => Linking.openURL('https://talkvegantome.freshdesk.com')}
        leftIcon={{name: "help-outline"}}
        title="Contact Us"
      />
    )
    return (
      <Wrapper
        navigation={this.props.navigation}
        title="Settings"
        safeAreaViewStyle={{backgroundColor:'#D3D3D3'}}
        footer={footer}
        style={{paddingRight:0, paddingLeft: 0, backgroundColor:'#D3D3D3'}}>
        <SettingsModal
          modalVisible={this.state.modalVisible}
          title={"Select Language"}
          onClose={() => {this.setModalVisible(!this.state.modalVisible);}}>
          <Picker
            selectedValue={this.state.settings.language}
            itemStyle={{width: 100, height: 200 }}
            onValueChange={(itemValue) =>
              this.updateSetting('language', itemValue)
            }>
            {_.map(languages, (lang, short) => {
              return <Picker.Item label={lang.name} value={short} key={short}/>
            })}
          </Picker>
        </SettingsModal>
        <View style={{marginTop: 20}}>
          <SettingsItem
            label='Last Synced Data'
            value={this.state.lastSync}
            icon={this.state.pageDataIsLoading ? 'hourglass-empty' : 'refresh'}
            onPress={() => {this.refreshPageData()}}/>
          <SettingsItem label='Language' value={languages[this.state.settings.language].name}
            onPress={() => {this.setModalVisible(!this.state.modalVisible)}}/>
        </View>
      </Wrapper>
    )
  }
}

class SettingsModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.modalVisible}
        >
        <SafeAreaView style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <View>
            <Text style={{fontSize: 22}}>{this.props.title}</Text>
          </View>
          <View style={{marginVertical: 20}}>
            {this.props.children}
          </View>
          <View>
            <TouchableHighlight
              onPress={() => {
                this.props.onClose()
              }}>
              <Text>Done</Text>
            </TouchableHighlight>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }
}

class SettingsItem extends React.Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    icon: 'chevron-right'
  }
  render() {
    return (
      <ListItem
        onPress={() => {this.props.onPress()}}
         title={this.props.label}
         rightTitle={this.props.value}
         rightIcon={{name:this.props.icon}}
      />
    )
  }
}

export default SettingsScreen
