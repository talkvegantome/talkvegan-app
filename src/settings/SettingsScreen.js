import React from 'react';
import { Platform, AppState } from 'react-native';
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
import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';

import _ from 'lodash';

import Analytics from '../analytics';
import { commonStyle } from '../styles/Common.style.js';
import Wrapper from '../wrapper/Wrapper.js';
import Pages from '../Pages.js';
import RateApp from '../rateApp';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...{
        modalVisible: false,
        notificationPermission: this.props.storage.settings
          .notificationsEnabled,
      },
      ...this.returnState(props.storage),
    };
  }

  _refreshPages = (storage) => this.setState(this.returnState(storage));
  returnState = (storage) => {
    let pagesObj = new Pages(storage);
    let analytics = new Analytics(storage.settings);
    return {
      analytics: analytics,
      settings: storage.settings,
      storage: this.props.storage,
      pagesObj: pagesObj,
      rateApp: new RateApp({ storage: storage }),
      lastSync: pagesObj.getLastPageDataSync('auto'),
    };
  };
  checknotificationPermission = () => {
    if (Platform.OS === 'ios') {
      PushNotification.checkPermissions((permissions) =>
        this.setState({ notificationPermission: Boolean(permissions.alert) })
      );
      BackgroundFetch.status((status) => {
        this.setState({
          backgroundFetchPermission:
            status == BackgroundFetch.STATUS_AVAILABLE ? true : false,
        });
      });
    }
  };
  componentDidMount() {
    this.props.storage.addOnRefreshListener(this._refreshPages);
    let timer = setInterval(() => {
      this.setState({
        lastSync: this.state.pagesObj.getLastPageDataSync('auto'),
      });
    }, 1000);
    AppState.addEventListener('change', this.checknotificationPermission);
    this.timer = timer;
  }
  componentWillUnmount() {
    this.props.storage.removeOnRefreshListener(this._refreshPages);
    clearInterval(this.state.timer);
    AppState.removeEventListener('change', this.checknotificationPermission);
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
    this.props.storage.updateSettings({ [settingName]: value });
    this.state.analytics.logEvent('updateSetting', {
      settingName: settingName,
      value: value,
    });
  }
  changeNotificationPermission = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings://');
      return;
    }
    this.state.storage.updateSettings(
      { notificationsEnabled: !this.state.notificationPermission },
      false
    );
    this.setState({
      notificationPermission: !this.state.notificationPermission,
    });
  };
  changebackgroundFetchPermission = () => {
    Linking.openURL('app-settings://');
  };
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
          <SettingsItem
            label="Notifications"
            leftIcon={{
              name: this.state.notificationPermission
                ? 'notifications-active'
                : 'notifications',
              color: commonStyle.secondary,
            }}
            icon={null}
            switch={{
              value: this.state.notificationPermission,
              onValueChange: () => this.changeNotificationPermission(),
            }}
          />
          <SettingsItem
            label="Background Fetch"
            style={{
              display:
                this.state.notificationPermission && Platform.OS == 'ios'
                  ? 'flex'
                  : 'none',
            }}
            leftIcon={{
              name: 'av-timer',
              color: commonStyle.secondary,
            }}
            icon={null}
            switch={{
              value: this.state.backgroundFetchPermission,
              onValueChange: () => this.changebackgroundFetchPermission(),
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
        containerStyle={this.props.style}
      />
    );
  }
}

export default SettingsScreen;
