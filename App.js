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
import Analytics from './src/analytics';
import { RateModal } from './src/rateApp';

import { commonStyle, PaperTheme } from './src/styles/Common.style.js';
import { BottomNavigation, Portal } from 'react-native-paper';

console.disableYellowBox = true; // eslint-disable-line no-console

class BottomDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state.storage = new Storage();
    this.BackgroundFetch = new BackgroundFetch({ storage: this.state.storage });
    this.state.storage.addOnRefreshListener((storage) =>
      this.setState(this.returnState(storage))
    );
    this.state = { ...this.state, ...this.returnState(this.state.storage) };
  }

  returnState(storage) {
    return {
      analytics: new Analytics(storage.settings),
      navigationHistory: [
        {
          index: 0,
          routeParams: {},
        },
      ],
    };
  }
  onNavigationListeners = [];
  state = {
    index: 0,
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
    this.BackgroundFetch.getPermissionToAlert()
  };
  _appendToHistory(index, params) {
    let lastLocation = _.nth(this.state.navigationHistory, -1);
    if (
      lastLocation.index === index &&
      _.isEqual(lastLocation.routeParams, params)
    ) {
      return;
    }
    this.setState({
      routeParams: {},
      navigationHistory: this.state.navigationHistory.concat({
        index: index,
        routeParams: params,
      }),
    });
  }

  _handleIndexChange = (index) => {
    this.setState({ index });
  };
  _handleTabPress = (route) => {
    this.state.analytics.logEvent('navigateToPage', {
      page: route.route.key,
      params: {},
    });
    this._appendToHistory(
      _.findIndex(this.state.routes, ['key', route.route.key]),
      {}
    );
    this._triggerNavigationListeners();
    this.setState({ routeParams: {} });
  };

  _renderScene = ({ route }) => {
    if (route.key == 'home') {
      return (
        <HomeScreen
          storage={this.state.storage}
          navigation={this}
          {...this.state.routeParams}
        />
      );
    }
    if (route.key == 'settings') {
      return <SettingsScreen storage={this.state.storage} navigation={this} />;
    }
    if (route.key == 'search') {
      return <SearchScreen storage={this.state.storage} navigation={this} />;
    }
    if (route.key == 'favourites') {
      return (
        <FavouritesScreen storage={this.state.storage} navigation={this} />
      );
    }
  };
  _triggerNavigationListeners(key, props = {}) {
    _.forEach(this.onNavigationListeners, (method) => method(key, props));
  }
  navigate = (key, props, type = 'unknown') => {
    let index = _.findIndex(this.state.routes, ['key', key]);
    this.state.analytics.logEvent('navigateToPage', {
      page: key,
      params: props,
      type: type,
    });
    this._appendToHistory(index, props);
    this._triggerNavigationListeners(key, props);
    this.setState({
      index: index,
      routeParams: props,
    });
  };

  goBack = () => {
    let lastLocation = _.nth(this.state.navigationHistory, -2); // current location is -1
    if (_.isNil(lastLocation)) {
      return;
    }
    let navigationHistoryLessLastLocation = this.state.navigationHistory.slice(
      0,
      this.state.navigationHistory.length - 1
    );

    this.setState({
      index: lastLocation.index,
      routeParams: lastLocation.routeParams,
      navigationHistory: navigationHistoryLessLastLocation,
    });
  };

  addOnNavigateListener = (func) => {
    this.onNavigationListeners = this.onNavigationListeners.concat(func);
  };
  removeOnNavigateListener = (func) => {
    this.onNavigationListeners = _.filter(
      this.onNavigationListeners,
      (o) => o !== func
    );
  };

  render() {
    return (
      <Portal.Host>
        <RateModal storage={this.state.storage} />
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
