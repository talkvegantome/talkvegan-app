import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import { DateTime } from 'luxon';
import Pages from './Pages.js';
import Analytics from './analytics';

export class Storage {
  constructor() {
    //AsyncStorage.clear()
    this.onRefreshListeners = [];
    this.refreshFromStorage().then(() => {
      // If it's been over a day since we loaded new data, load on start
      let pagesObj = new Pages(this);
      let daysSinceLastSync =
        pagesObj.getLastPageDataSync().diffNow('days').days * -1;
      if (daysSinceLastSync > 1) {
        pagesObj.pullPageDataFromSite();
      }
    });
    this.addOnRefreshListener(this.onRefresh, [{ key: 'settings' }]);
    this.onRefresh();
  }

  favourites = {};
  pageData = {
    en: require('../assets/index.en.json'),
  };
  settings = {
    language: 'en',
    analyticsPromptAnswered: false,
    analyticsEnabled: false,
    loading: true,
    randomiseHomepage: true,

    // App rating
    lastPromptedForAppRating: DateTime.utc(),
    timesPromptedForAppRating: 0,
    hasRatedApp: false,

    // Notifications
    notificationsEnabled: true, // Android only as iOS maintains its own permissions
    lastNotification: DateTime.utc(),
  };
  config = {
    apiUrl: 'https://talkveganto.me/',
    gitHubUrl: 'https://github.com/talkvegantome/talkvegan-hugo/',
    privacyPolicyUrl: 'https://talkveganto.me/en/privacy-policy',
    helpDeskUrl: 'https://talkvegantome.freshdesk.com/support/tickets/new',
    twitterUrl: 'https://twitter.com/TalkVeganApp',
  };

  onRefresh = () => {
    this.analytics = new Analytics(this.settings);
  };
  mergeStorage(propertyName, storageValue) {
    if (!storageValue) {
      return;
    }
    this[propertyName] = {
      ...this[propertyName],
      ...storageValue,
    };
    // If there were new defaults (i.e. keys in this[propertyName] that were not in storageValue)
    // Save them back so they persist into storage
    const keysNotStored = _.difference(
      _.keys(this[propertyName]),
      _.keys(storageValue)
    );
    if (!_.isEmpty(keysNotStored)) {
      AsyncStorage.setItem(propertyName, JSON.stringify(this[propertyName]));
    }
  }
  refreshFromStorage(
    keysToRefresh = ['pageData', 'settings', 'favourites'],
    subKeysSaved = []
  ) {
    let promises = [];
    this.loading = true;
    _.forEach(keysToRefresh, (propertyName) => {
      let promise = AsyncStorage.getItem(propertyName).then(
        (asyncStorageRes) => {
          // Don't overwrite defaults with null if nothing exists in AsyncStorage!
          this.mergeStorage(propertyName, JSON.parse(asyncStorageRes));
        }
      );
      promises.push(promise);
    });
    return Promise.all(promises).then(() => {
      this.loading = false;
      _.forEach(this.onRefreshListeners, (methodObj) => {
        // If the listener cares about the keys we refreshed, call it!
        if (
          this.shouldTriggerStorageListener(
            keysToRefresh,
            subKeysSaved,
            methodObj
          )
        ) {
          methodObj['method'](this);
        }
      });
    });
  }
  shouldTriggerStorageListener(keysRefreshed, subKeysSaved, methodObj) {
    let trigger = false;
    _.forEach(methodObj['listenForKeys'], (key) => {
      if (!_.includes(keysRefreshed, key['key'])) {
        return;
      }
      if (!('onlySubKeys' in key)) {
        trigger = true;
        return;
      }
      if (
        !_.isNil(subKeysSaved) &&
        _.intersection(key['onlySubKeys'], subKeysSaved).length > 0
      ) {
        trigger = true;
      }
    });
    return trigger;
  }
  updateSetting(settingName, value) {
    this.settings[settingName] = value;
    return AsyncStorage.setItem('settings', JSON.stringify(this.settings)).then(
      () => {
        this.refreshFromStorage();
      }
    );
  }

  updateSettings(settings, triggerRefreshListeners = true) {
    this.settings = { ...this.settings, ...settings };
    let settingsKeys = _.keys(settings);
    return AsyncStorage.setItem('settings', JSON.stringify(this.settings)).then(
      () => {
        if (triggerRefreshListeners) {
          this.refreshFromStorage(['settings'], settingsKeys);
        }
      }
    );
  }

  addOnRefreshListener(
    method,
    listenForKeys = [
      { key: 'settings', onlySubKeys: ['language'] },
      { key: 'pageData' },
    ]
  ) {
    this.onRefreshListeners.push({
      method: method,
      listenForKeys: listenForKeys,
    });
  }
  addFavourite(props) {
    this.favourites[this.settings.language].push({
      pageKey: props.pageKey,
      indexId: props.indexId,
      displayName: props.displayName,
    });
    this.analytics.logEvent('addedFavourite', props);
    this.syncFavourites();
  }
  removeFavourite(props) {
    this.favourites[this.settings.language] = _.filter(
      this.getFavourites(),
      (o) => {
        return !(o.indexId === props.indexId && o.pageKey === props.pageKey);
      }
    );
    this.analytics.logEvent('removedFavourite', props);
    return this.syncFavourites();
  }
  syncFavourites() {
    return AsyncStorage.setItem(
      'favourites',
      JSON.stringify(this.favourites)
    ).then(() => {
      this.refreshFromStorage(['favourites']);
    });
  }
  toggleFavourite(props) {
    if (this.isFavourite(props)) {
      return this.removeFavourite(props);
    }
    return this.addFavourite(props);
  }
  getFavourites() {
    this._initialiseLanguage('favourites', []);
    return this.favourites[this.settings.language];
  }
  isFavourite(props) {
    return (
      _.filter(this.getFavourites(), {
        indexId: props.indexId,
        pageKey: props.pageKey,
      }).length > 0
    );
  }
  _initialiseLanguage(key, value) {
    if (_.isNil(this[key])) {
      this[key] = {};
    }
    if (_.isNil(this[key][this.settings.language])) {
      this[key][this.settings.language] = value;
    }
  }
}
