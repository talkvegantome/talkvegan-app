import { Platform } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';

import { DateTime } from 'luxon';

import Analytics from '../analytics';
import Pages from '../Pages.js';

export default class BackgroundFetchHelper {
  constructor(props) {
    this.analytics = new Analytics(props.storage.settings);
    this.pages = new Pages(props.storage);
    this.debug = {
      lastNotification: DateTime.utc().plus({ years: -1 }),
    };
    PushNotification.requestPermissions();
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        // Android options
        stopOnTerminate: false,
        startOnBoot: true,
      },
      async () => {
        console.log('checking for notifications');
        await this.checkForNotifications();
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
      //fireDate: DateTime.local().plus({ seconds: 5 }),
      message: props.body,
      title: props.title,
      category: 'SOME_CATEGORY',
      userInfo: {},
    });

    this.updateLastNotification();
  }

  updateLastNotification() {
    this.storage.updateSettings(
      {
        lastNotification: DateTime.utc(),
      },
      (triggerRefreshListeners = true)
    );
  }

  checkForNotifications = async () => {
    return fetch(this.pages.getNotificationsUri(), {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (!responseJson.Date) {
          throw 'Date missing from JSON response';
        }
        let lastNotification = this.debug
          ? this.debug.lastNotification
          : this.storage.settings.lastNotification;
        this.analytics.logEvent('checkForNotification', {
          fired: DateTime.fromISO(responseJson.Date) > lastNotification,
          json: responseJson,
          lastNotification: lastNotification,
        });
        // if (DateTime.fromISO(responseJson.Date) > lastNotification) {
        this.triggerNotification({
          title: responseJson.Title,
          body: responseJson.Body,
        });
        // }
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
