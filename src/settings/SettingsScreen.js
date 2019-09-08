import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Modal,
  TouchableHighlight,
  Linking,
  Picker,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import _ from 'lodash';

import Analytics from '../analytics';

import { commonStyle } from '../styles/Common.style.js';
import Wrapper from '../wrapper/Wrapper.js';
import Pages from '../Pages.js';
import RateApp from '../rateApp';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.storage.addOnRefreshListener((storage) => {
      let pagesObj = new Pages(storage);
      let analytics = new Analytics(storage.settings);
      this.setState({
        analytics: analytics,
        settings: storage.settings,
        pageObj: pagesObj,
        rateApp: new RateApp({ storage: storage }),
        lastSync: pagesObj.getLastPageDataSync('auto'),
      });
    });

    let pagesObj = new Pages(this.props.storage);
    let analytics = new Analytics(this.props.storage.settings);
    this.state = {
      modalVisible: false,
      analytics: analytics,
      pagesObj: pagesObj,
      storage: this.props.storage,
      rateApp: new RateApp({ storage: this.props.storage }),
      lastSync: pagesObj.getLastPageDataSync('auto'),
      settings: this.props.storage.settings,
    };
  }

  componentDidMount() {
    let timer = setInterval(() => {
      this.setState({
        lastSync: this.state.pagesObj.getLastPageDataSync('auto'),
      });
    }, 1000);
    this.setState({ timer: timer });
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  pullPageDataFromSite() {
    this.setState({ pageDataIsLoading: true });
    this.state.pagesObj.pullPageDataFromSite().then(() => {
      this.setState({ pageDataIsLoading: false });
    });
  }
  updateSetting(settingName, value) {
    this.setState({
      settings: { ...this.state.settings, ...{ [settingName]: value } },
    });
    this.props.storage.updateSetting(settingName, value);
    this.state.analytics.logEvent('updateSetting', {
      settingName: settingName,
      value: value,
    });
  }
  render() {
    return (
      <Wrapper
        navigation={this.props.navigation}
        title="Settings"
        style={{ paddingRight: 0, paddingLeft: 0, backgroundColor: '#E5' }}>
        <SettingsModal
          modalVisible={this.state.modalVisible}
          title={'Select Language'}
          onClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <Picker
            selectedValue={this.state.settings.language}
            style={commonStyle.picker}
            itemStyle={commonStyle.pickerItem}
            onValueChange={(itemValue) =>
              this.updateSetting('language', itemValue)
            }>
            {_.map(this.state.storage.pageData, (lang, short) => {
              return (
                <Picker.Item
                  label={lang.languageName}
                  value={short}
                  key={short}
                />
              );
            })}
          </Picker>
        </SettingsModal>
        <View style={{ marginTop: 20 }}>
          <SettingsItem
            label="Last Synced Data"
            leftIcon={{ name: 'access-time', color: commonStyle.secondary }}
            value={this.state.lastSync}
            icon={this.state.pageDataIsLoading ? 'hourglass-empty' : 'refresh'}
            onPress={() => {
              this.pullPageDataFromSite();
            }}
          />
          <SettingsItem
            label="Language"
            leftIcon={{ name: 'language', color: commonStyle.secondary }}
            value={
              this.state.storage.pageData[this.state.settings.language]
                .languageName
            }
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}
          />
          <SettingsItem
            label="Analytics"
            leftIcon={{
              name: 'chart-areaspline',
              type: 'material-community',
              color: commonStyle.secondary,
            }}
            icon={null}
            switch={{
              value: this.state.storage.settings.analyticsEnabled,
              onValueChange: (value) =>
                this.updateSetting('analyticsEnabled', value),
            }}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <ListItem
            onPress={() =>
              Linking.openURL(this.state.storage.config.helpDeskUrl)
            }
            leftIcon={{ name: 'chat-bubble', color: commonStyle.secondary }}
            title="Contact Us"
          />
          <ListItem
            topDivider={true}
            onPress={() =>
              Linking.openURL(this.state.storage.config.twitterUrl)
            }
            leftIcon={{
              name: 'twitter',
              type: 'material-community',
              color: commonStyle.secondary,
            }}
            title="Twitter"
          />
          <ListItem
            topDivider={true}
            onPress={() => this.state.rateApp.promptForRating()}
            leftIcon={{
              name: 'rate-review',
              color: commonStyle.secondary,
            }}
            title="Rate App"
          />
        </View>
      </Wrapper>
    );
  }
}

class SettingsModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}
        onRequestClose={() => {
          this.props.onClose();
        }}>
        <SafeAreaView
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View>
            <Text style={{ fontSize: 22 }}>{this.props.title}</Text>
          </View>
          <View style={{ marginVertical: 20 }}>{this.props.children}</View>
          <View>
            <TouchableHighlight
              onPress={() => {
                this.props.onClose();
              }}>
              <Text style={{ fontSize: 22 }}>Done</Text>
            </TouchableHighlight>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

class SettingsItem extends React.Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    icon: 'chevron-right',
  };
  render() {
    return (
      <ListItem
        onPress={this.props.onPress}
        leftIcon={this.props.leftIcon}
        title={this.props.label}
        rightTitle={this.props.value}
        rightIcon={{ name: this.props.icon }}
        switch={this.props.switch}
      />
    );
  }
}

export default SettingsScreen;
