/**
 * TalkVeganToMe
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { AppState } from 'react-native';
import SettingsScreen from './src/settings/SettingsScreen.js';
import SearchScreen from './src/search/Search.js';
import HomeScreen from './src/home/Home.js';
import FavouritesScreen from './src/navigation/Favourites';
import { _ } from 'lodash';

import BackgroundFetch from './src/backgroundFetch';
import { Storage } from './src/Storage.js';
import { PrivacyDialog } from './src/analytics';
import { RateModal } from './src/rateApp';

import { commonStyle, PaperTheme } from './src/styles/Common.style.js';
import { BottomNavigation, Portal } from 'react-native-paper';

console.disableYellowBox = true; // eslint-disable-line no-console

class BottomDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.storage = new Storage();
    this.BackgroundFetch = new BackgroundFetch({ storage: this.storage });
    this.storage.addOnRefreshListener(() => this._storageRefreshListener());
  }
  _storageRefreshListener = () => {
    this.setState({ forceRender: 1 });
  };

  navigationHistory = [
    {
      index: 0,
      routeParams: {},
    },
  ];
  onNavigationListeners = [];
  state = {
    index: 0,
    routeParams: { home: {} },
    routes: [
      { key: 'home', title: 'Home', icon: 'home' },
      { key: 'search', title: 'Search', icon: 'search' },
      { key: 'favourites', title: 'Favourites', icon: 'favorite' },
      { key: 'settings', title: 'Settings', icon: 'settings' },
    ],
  };
  componentDidMount() {
    AppState.addEventListener('change', this._appStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._appStateChange);
  }
  _appStateChange = () => {
    this.BackgroundFetch.getPermissionToAlert();
  };
  _appendToHistory(index, params) {
    let lastLocation = _.nth(this.navigationHistory, -1);
    if (
      lastLocation.index === index &&
      _.isEqual(lastLocation.routeParams, params)
    ) {
      return;
    }
    this.navigationHistory = this.navigationHistory.concat({
      index: index,
      // this is pure params (not a child of the index) because it's history not state
      routeParams: params,
    });
  }

  _handleIndexChange = (index) => {
    this.setState({ index });
  };
  _handleTabPress = (route) => {
    let key = route.route.key;
    this.storage.analytics.logEvent('navigateToPage', {
      page: key,
      params: {},
    });
    this._appendToHistory(
      _.findIndex(this.state.routes, ['key', route.route.key]),
      {}
    );
    this._triggerNavigationListeners(route.route.key, {});
    this.setState({
      routeParams: { ...this.state.routeParams, ...{ [key]: {} } },
    });
  };

  _renderScene = ({ route }) => {
    if (route.key == 'home') {
      return (
        <HomeScreen
          storage={this.storage}
          navigation={this}
          {...this.state.routeParams['home']}
        />
      );
    }
    if (route.key == 'settings') {
      return <SettingsScreen storage={this.storage} navigation={this} />;
    }
    if (route.key == 'search') {
      return <SearchScreen storage={this.storage} navigation={this} />;
    }
    if (route.key == 'favourites') {
      return <FavouritesScreen storage={this.storage} navigation={this} />;
    }
  };
  _triggerNavigationListeners(key, props = {}) {
    _.forEach(
      _.filter(
        this.onNavigationListeners,
        (o) =>
          (_.includes(o.keys, key) || _.isNil(o.keys)) &&
          (_.isNil(o.propsEvaluator) || o.propsEvaluator(props))
      ),
      (listener) => {
        listener.method(key, props);
      }
    );
  }
  navigate = (key, props, type = 'unknown') => {
    let index = _.findIndex(this.state.routes, ['key', key]);
    this.storage.analytics.logEvent('navigateToPage', {
      page: key,
      params: props,
      type: type,
    });
    this._appendToHistory(index, props);
    this._triggerNavigationListeners(key, props);
    this.setState({
      index: index,
      routeParams: { ...this.state.routeParams, ...{ [key]: props } },
    });
  };
  goBack = () => {
    let lastLocation = _.nth(this.navigationHistory, -2); // current location is -1
    let key = this.state.routes[lastLocation.index].key;
    if (_.isNil(lastLocation)) {
      return;
    }
    this.navigationHistory = this.navigationHistory.slice(
      0,
      this.navigationHistory.length - 1
    );
    this.setState({
      index: lastLocation.index,
      routeParams: {
        ...this.state.routeParams,
        ...{ [key]: lastLocation.routeParams },
      },
    });
    this._triggerNavigationListeners(key, lastLocation.routeParams);
  };

  addOnNavigateListener = (props) => {
    this.onNavigationListeners = this.onNavigationListeners.concat(props);
  };
  removeOnNavigateListener = (func) => {
    this.onNavigationListeners = _.filter(
      this.onNavigationListeners,
      (o) => o.method !== func
    );
  };

  render() {
    return (
      <Portal.Host>
        <PrivacyDialog storage={this.storage} />
        <RateModal storage={this.storage} />
        <BottomNavigation
          theme={PaperTheme}
          activeColor={commonStyle.headerFontColor}
          inactiveColor={commonStyle.headerFontColor}
          navigationState={this.state}
          onTabPress={this._handleTabPress}
          onIndexChange={this._handleIndexChange}
          renderScene={this._renderScene}
        />
      </Portal.Host>
    );
  }
}

export default BottomDrawer;
