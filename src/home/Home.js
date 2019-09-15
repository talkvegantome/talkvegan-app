import React from 'react';
import { Share, StyleSheet, View, Linking } from 'react-native';
import {
  Appbar,
  FAB,
  ActivityIndicator,
  DefaultTheme,
} from 'react-native-paper';
import Markdown from 'react-native-markdown-renderer';
import Pages from '../Pages.js';
import { _ } from 'lodash';

import ContentIndex from '../navigation/ContentIndex';
import Wrapper from '../wrapper/Wrapper.js';
import { markdownRules } from '../MarkDownRules.js';
import { markdownStyles } from '../styles/Markdown.style.js';
import { commonStyle } from '../styles/Common.style.js';

import Analytics from '../analytics';

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
    this.state = this.returnState(this.props.storage, true);
  }
  componentDidMount() {
    this.props.storage.addOnRefreshListener(this._refreshPages);
    this.props.storage.addOnRefreshListener(this._refreshFavourites, [
      { key: 'favourites' },
    ]);
    this.props.navigation.addOnNavigateListener({
      method: this._onNavigationListener,
      keys: ['home'],
      propsEvaluator: (o) => !_.isEmpty(o),
    });
  }
  componentWillUnmount() {
    this.props.storage.removeOnRefreshListener(this._refreshPages);
    this.props.storage.removeOnRefreshListener(this._refreshFavourites);
    this.props.navigation.removeOnNavigateListener(this._onNavigationListener);
  }

  _refreshPages = () => {
    this.setState(this.returnState());
  };
  _onNavigationListener = (key, props) => {
    // this is never actually read from _state_ but instead triggers a render to get indexId from props
    this.setState({
      indexId: props.indexId,
    });
    this._refreshFavourites(props.indexId);
  };
  _refreshFavourites = (indexId = this.props.indexId) => {
    if (this.props.storage.loading) {
      return;
    }
    let isFavourite = this.props.storage.isFavourite({
      indexId: indexId,
      pageKey: 'home',
    });

    this.setState({
      isFavourite: isFavourite,
    });
  };

  returnState = () => {
    (this.analytics = new Analytics(this.props.storage.settings)),
      (this.pagesObj = new Pages(this.props.storage)),
      (this.markdownRulesObj = new markdownRules(
        this.props.navigation,
        this.props.storage.settings
      ));
    return {
      isFavourite: this.props.storage.isFavourite({
        indexId: this.props.indexId,
        page: 'home',
      }),
      loading: this.props.storage.loading,
    };
  };
  _scrollRefPopulator = (scrollRef) => {
    this.scrollRef = scrollRef;
  };
  _scrollListener = (e) => {
    if (!_.isNil(this.state.scrollListener)) {
      this.state.scrollListener(e);
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <Wrapper
          navigation={this.props.navigation}
          title={this.pagesObj.getPageTitle()}
          scrollRefPopulator={this._scrollRefPopulator}
          style={{
            flex: 1,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 20,
            paddingBottom: 20,
          }}>
          <ActivityIndicator
            animating={true}
            color={commonStyle.primary}
            size="large"
          />
        </Wrapper>
      );
    }
    if (_.isNil(this.props.indexId)) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Wrapper
            navigation={this.props.navigation}
            title={this.pagesObj.getPageTitle()}
            scrollRefPopulator={this._scrollRefPopulator}
            scrollListener={(e) => {
              if (!_.isNil(this.state.scrollListener)) {
                this.state.scrollListener(e);
              }
            }}
            style={{
              flex: 1,
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 20,
              paddingBottom: 20,
            }}>
            <View style={{ marginBottom: -20 }} />
            <ContentIndex
              storage={this.props.storage}
              navigation={this.props.navigation}
            />
          </Wrapper>
          <ScrollUpFAB
            registerScrollListener={(method) =>
              this.setState({ scrollListener: method })
            }
            onPress={() =>
              this.scrollRef.current.scrollTo({ y: 0, animated: true })
            }
          />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <Wrapper
          navigation={this.props.navigation}
          title={this.pagesObj.getPageTitle(this.props.indexId)}
          scrollRefPopulator={this._scrollRefPopulator}
          scrollListener={this._scrollListener}
          style={{
            flex: 1,
            backgroundColor: commonStyle.contentBackgroundColor,
          }}
          rightComponent={
            <Appbar.Action
              icon={this.state.isFavourite ? 'favorite' : 'favorite-border'}
              accessibilityLabel="favourite_this_page"
              onPress={() => {
                this.props.storage.toggleFavourite({
                  pageKey: 'home',
                  indexId: this.props.indexId,
                  displayName: this.pagesObj.getPageTitle(this.props.indexId),
                });
              }}
            />
          }>
          <Markdown
            style={markdownStyles}
            rules={this.markdownRulesObj.returnRules()}>
            {this.markdownRulesObj.preProcessMarkDown(
              this.pagesObj.getPageContent(this.props.indexId)
            )}
          </Markdown>
        </Wrapper>
        <PageMenu
          previousPage={this.pagesObj.getPageOffsetInCategory(
            this.props.indexId,
            -1
          )}
          nextPage={this.pagesObj.getPageOffsetInCategory(
            this.props.indexId,
            1
          )}
          navigation={this.props.navigation}
          pagePermalink={this.pagesObj.getPagePermalink(this.props.indexId)}
          pageGitHubLink={this.pagesObj.getPageGitHubLink(this.props.indexId)}
          analytics={this.analytics}
          scrollRef={this.scrollRef}
          registerScrollListener={(method) =>
            this.setState({ scrollListener: method })
          }
        />
      </View>
    );
  }
}

class PageMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayScrollUp: false };
    this.props.registerScrollListener(this.scrollListener);
  }
  scrollListener = (e) => {
    this.setState({ displayScrollUp: e.nativeEvent.contentOffset.y > 0 });
  };
  _navigateForward() {
    this.props.navigation.navigate(
      'home',
      {
        indexId: this.props.nextPage['relativePermalink'],
        from: this.props.thisPage,
      },
      'articleNextButton'
    );
  }
  _navigateBackward() {
    this.props.navigation.navigate(
      'home',
      {
        indexId: this.props.previousPage['relativePermalink'],
      },
      'articlePreviousButton'
    );
  }
  render() {
    const iconSize = 18;
    return (
      <Appbar style={styles.PageMenu} theme={pageMenuTheme}>
        <Appbar.Action
          icon="arrow-back"
          size={iconSize}
          disabled={this.props.previousPage === false}
          style={styles.PageMenuItem}
          onPress={() => this._navigateBackward()}
        />
        <Appbar.Action
          icon="share"
          size={iconSize}
          style={styles.PageMenuItem}
          onPress={() => {
            Share.share({ message: this.props.pagePermalink })
              .then((result) => {
                this.props.analytics.logEvent('sharedPage', {
                  page: this.props.pagePermalink,
                  activity: result.activityType,
                });
              })
              .catch((err) => {
                this.props.analytics.logEvent('error', { errorDetail: err });
              });
          }}
        />
        <Appbar.Action
          icon="arrow-upward"
          size={iconSize}
          style={styles.PageMenuItem}
          disabled={!this.state.displayScrollUp}
          onPress={() =>
            this.props.scrollRef.current.scrollTo({ y: 0, animated: true })
          }
        />
        <Appbar.Action
          icon="edit"
          size={iconSize}
          style={styles.PageMenuItem}
          onPress={() => {
            this.props.analytics.logEvent('openedGitHubLink', {
              page: this.props.pagePermalink,
            });
            Linking.openURL(this.props.pageGitHubLink);
          }}
        />
        <Appbar.Action
          icon="arrow-forward"
          size={iconSize}
          disabled={this.props.nextPage === false}
          style={styles.PageMenuItem}
          onPress={() => this._navigateForward()}
        />
      </Appbar>
    );
  }
}

class ScrollUpFAB extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayScrollUp: false };
    this.props.registerScrollListener(this.scrollListener);
  }
  scrollListener = (e) => {
    this.setState({ displayScrollUp: e.nativeEvent.contentOffset.y > 0 });
  };
  render() {
    return (
      <FAB
        style={{
          display: this.state.displayScrollUp ? 'flex' : 'none',
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        small
        icon="arrow-upward"
        onPress={this.props.onPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  PageMenu: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'absolute',
    height: 50,
    width: '100%',
    right: 0,
    bottom: 0,
  },
  PageMenuItem: {
    margin: 0,
  },
});

const pageMenuTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: commonStyle.secondary,
    accent: commonStyle.white,
    onSurface: '#FFFFFF',
  },
};
