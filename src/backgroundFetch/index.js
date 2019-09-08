import BackgroundFetch from 'react-native-background-fetch';
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
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        // Android options
        stopOnTerminate: false,
        startOnBoot: true,
      },
      async () => {
        this.checkForNotifications();
        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
      },
      (error) => {
        console.log('[js] RNBackgroundFetch failed to start');
      }
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
        if (
          DateTime.fromISO(responseJson.Date) >
          lastNotification
        ) {
          console.log(responseJson.Title);
        }
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
