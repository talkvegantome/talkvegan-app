import BackgroundFetch from 'react-native-background-fetch';
import NotificationsIOS, {
  NotificationsAndroid,
} from 'react-native-notifications';

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
    if (Platform.OS === 'ios') {
        NotificationsIOS.requestPermissions()
    }
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

  triggerNotification(props) {
    if (Platform.OS === 'ios') {
      NotificationsIOS.localNotification({
        fireDate: DateTime.local().plus({seconds: 5}),
        body: props.body,
        title: props.title,
        sound: 'chime.aiff',
        silent: false,
        category: 'SOME_CATEGORY',
        userInfo: {},
      });
    }
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
        if (DateTime.fromISO(responseJson.Date) > lastNotification) {
          console.log(responseJson.Title);
          this.triggerNotification({
            title: responseJson.Title,
            body: responseJson.Title,
          });
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
