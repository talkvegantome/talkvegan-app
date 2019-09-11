import { Platform } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';

import { DateTime } from 'luxon';
import { _ } from 'lodash';

import Analytics from '../analytics';
import Pages from '../Pages.js';

export default class BackgroundFetchHelper {
  constructor(props) {
    this.storage = props.storage;
    if (_.isNil(props.storage) || props.storage.loading) {
      return;
    }
    this.analytics = new Analytics(props.storage.settings);
    this.pages = new Pages(props.storage);
    this.debug = {
      lastNotification: DateTime.utc().plus({ years: -1 }),
    };
    this.debug = false;
    PushNotification.requestPermissions();
    this.getPermissionToAlert();
    this.configureBackgroundFetch();
  }

  getPermissionToAlert() {
    if (Platform.OS === 'ios') {
      PushNotification.checkPermissions(
        (permissions) => (this.havePermissionToAlert = permissions.alert)
      );
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

  shouldNotify = (responseJson) => {
    const lastNotification = this.debug
      ? this.debug.lastNotification
      : this.storage.settings.lastNotification;
    this.analytics.logEvent('checkForNotification', {
      fired: DateTime.fromISO(responseJson.Date) > lastNotification,
      json: responseJson,
      lastNotification: lastNotification,
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
