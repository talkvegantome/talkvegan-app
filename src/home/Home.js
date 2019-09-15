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

import Analytics, { PrivacyDialog } from '../analytics';

export default class App extends React.Component {
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
    this.props.navigation.addOnNavigateListener(this._onNavigationListener);
  }
  componentWillUnmount() {
    this.props.storage.removeOnRefreshListener(this._refreshPages);
    this.props.storage.removeOnRefreshListener(this._refreshFavourites);
    this.props.navigation.removeOnNavigateListener(this._onNavigationListener);
  }

  _refreshPages = () => {
    console.log('Refresh Pages in Home')
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
    let storage = this.props.storage;
    return {
      analytics: new Analytics(this.props.storage.settings),
      isFavourite: storage.isFavourite({
        indexId: this.props.indexId,
        page: 'home',
      }),
      loading: this.props.storage.loading,
      settings: storage.settings,
      pagesObj: new Pages(storage),
      markdownRulesObj: new markdownRules(
        this.props.navigation,
        storage.settings
      ),
    };
  };

  render() {
    if (this.state.loading) {
      return (
        <Wrapper
          navigation={this.props.navigation}
          title={this.state.pagesObj.getPageTitle()}
          scrollRefPopulator={(scrollRef) => {
            this.scrollRef = scrollRef;
          }}
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
            title={this.state.pagesObj.getPageTitle()}
            scrollRefPopulator={(scrollRef) => {
              this.scrollRef = scrollRef;
            }}
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
            <PrivacyDialog storage={this.props.storage} />
            <View style={{ marginBottom: -20 }} />
            <ContentIndex
              language={this.state.settings.language}
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
          title={this.state.pagesObj.getPageTitle(this.props.indexId)}
          scrollRefPopulator={(scrollRef) => {
            this.scrollRef = scrollRef;
          }}
          scrollListener={(e) => {
            if (!_.isNil(this.state.scrollListener)) {
              this.state.scrollListener(e);
            }
          }}
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
                  displayName: this.state.pagesObj.getPageTitle(
                    this.props.indexId
                  ),
                });
              }}
            />
          }>
          <Markdown
            style={markdownStyles}
            rules={this.state.markdownRulesObj.returnRules()}>
            {this.state.markdownRulesObj.preProcessMarkDown(
              this.state.pagesObj.getPageContent(this.props.indexId)
            )}
          </Markdown>
        </Wrapper>
        <PageMenu
          previousPage={this.state.pagesObj.getPageOffsetInCategory(
            this.props.indexId,
            -1
          )}
          nextPage={this.state.pagesObj.getPageOffsetInCategory(
            this.props.indexId,
            1
          )}
          navigation={this.props.navigation}
          pagePermalink={this.state.pagesObj.getPagePermalink(
            this.props.indexId
          )}
          pageGitHubLink={this.state.pagesObj.getPageGitHubLink(
            this.props.indexId
          )}
          analytics={this.state.analytics}
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
