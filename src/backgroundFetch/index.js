import { Platform } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';

import { DateTime } from 'luxon';
import { _ } from 'lodash';

import Analytics from '../analytics';
import Pages from '../Pages.js';

export default class BackgroundFetchHelper {
  constructor(props) {
    if (_.isNil(props.storage)) {
      return;
    }
    this.storage = props.storage;
    this.analytics = new Analytics(this.storage.settings);
    this.pages = new Pages(props.storage);
    this.debug = {
      lastNotification: DateTime.utc().plus({ years: -1 }),
    };
    this.debug = false;
    this.requestPermissionToAlert();
    this.getPermissionToAlert();
  }

  componentDidMount() {
    this.props.storage.addOnRefreshListener(this.getPermissionToAlert, {
      key: 'settings',
      onlySubKeys: ['notificationsEnabled', 'analyticsEnabled'],
    });
  }
  componentWillUnmount() {
    this.props.storage.removeOnRefreshListener(this.getPermissionToAlert);
  }
  _refreshPermissions = (storage) => this.setState(this.returnState(storage));

  requestPermissionToAlert() {
    if (Platform.OS === 'ios') {
      PushNotification.requestPermissions().then((permissions) => {
        this.havePermissionToAlert = permissions.alert;
        this.configureBackgroundFetch();
      });
    } else {
      this.configureBackgroundFetch();
    }
  }
  getPermissionToAlert() {
    this.analytics = new Analytics(this.storage.settings);
    if (Platform.OS === 'ios') {
      PushNotification.checkPermissions((permissions) => {
        this.havePermissionToAlert = permissions.alert;
        this.configureBackgroundFetch();
      });
      return;
    }
    this.havePermissionToAlert = this.storage.settings.notificationsEnabled;
  }

  configureBackgroundFetch() {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        // Android options
        stopOnTerminate: false,
        startOnBoot: true,
      },
      async () => {
        if (this.havePermissionToAlert) {
          await this.checkForNotifications();
        }
        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
      },
      (error) => {
        this.analytics.logEvent('error', {
          action: 'backgroundNotification',
          errorDetail: error,
        });
      }
    );
  }

  triggerNotification(props) {
    PushNotification.localNotification({
      message: props.body,
      title: props.title,
      category: 'SOME_CATEGORY',
      userInfo: {},
    });
    this.updateLastNotification();
  }

  updateLastNotification = () => {
    this.storage.updateSettings(
      {
        lastNotification: DateTime.utc(),
      },
      false
    );
  };
  getlastNotification = () => {
    if (_.isString(this.storage.settings.lastNotification)) {
      return DateTime.fromISO(this.storage.settings.lastNotification);
    }
    return this.storage.settings.lastNotification;
  };
  shouldNotify = (responseJson) => {
    const lastNotification = this.debug
      ? this.debug.lastNotification
      : this.getlastNotification();
    this.analytics.logEvent('checkForNotification', {
      fired: DateTime.fromISO(responseJson.Date) > lastNotification,
      json: responseJson,
      lastNotification: lastNotification,
      havePermissionToAlert: this.havePermissionToAlert,
    });
    return DateTime.fromISO(responseJson.Date) > lastNotification;
  };

  validResponse(responseJson) {
    if (!responseJson.Date) {
      this.analytics.logEvent('error', {
        errorDetail: 'Invalid response JSON',
        json: responseJson,
      });
      return false;
    }
    return true;
  }

  checkForNotifications = async () => {
    return fetch(this.pages.getNotificationsUri(), {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (
          !this.validResponse(responseJson) ||
          !this.shouldNotify(responseJson)
        ) {
          return;
        }

        this.triggerNotification({
          title: responseJson.Title,
          body: responseJson.Body,
        });
      })
      .catch((err) => {
        this.analytics.logEvent('error', {
          errorDetail:
            'Failed to fetch notifications from ' +
            this.pages.getNotificationsUri() +
            ' ' +
            err,
        });
      });
  };
}
