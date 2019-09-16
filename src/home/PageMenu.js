import React from 'react';
import { Share, Linking, StyleSheet } from 'react-native';
import { Appbar, DefaultTheme } from 'react-native-paper';
import { commonStyle } from '../styles/Common.style.js';

export default class PageMenu extends React.Component {
  constructor(props) {
    super(props);
    this.previousPage = this.props.storage.pagesObj.getPageOffsetInCategory(
      this.props.indexId,
      -1
    );
    this.nextPage = this.props.storage.pagesObj.getPageOffsetInCategory(
      this.props.indexId,
      1
    );
    this.pagePermalink = this.props.storage.pagesObj.getPagePermalink(
      this.props.indexId
    );
    this.pageGitHubLink = this.props.storage.pagesObj.getPageGitHubLink(
      this.props.indexId
    );
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
        indexId: this.nextPage['relativePermalink'],
        from: this.thisPage,
      },
      'articleNextButton'
    );
  }
  _navigateBackward() {
    this.props.navigation.navigate(
      'home',
      {
        indexId: this.previousPage['relativePermalink'],
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
          testID='previous_article_button'
          size={iconSize}
          disabled={this.previousPage === false}
          style={styles.PageMenuItem}
          onPress={() => this._navigateBackward()}
        />
        <Appbar.Action
          icon="share"
          testID='share_button'
          size={iconSize}
          style={styles.PageMenuItem}
          onPress={() => {
            Share.share({ message: this.pagePermalink })
              .then((result) => {
                this.props.storage.analytics.logEvent('sharedPage', {
                  page: this.pagePermalink,
                  activity: result.activityType,
                });
              })
              .catch((err) => {
                this.props.storage.analytics.logEvent('error', {
                  errorDetail: err,
                });
              });
          }}
        />
        <Appbar.Action
          icon="arrow-upward"
          testID='scroll_to_top_button'
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
            this.props.storage.analytics.logEvent('openedGitHubLink', {
              page: this.pagePermalink,
            });
            Linking.openURL(this.pageGitHubLink);
          }}
        />
        <Appbar.Action
          icon="arrow-forward"
          testID='next_article_button'
          size={iconSize}
          disabled={this.nextPage === false}
          style={styles.PageMenuItem}
          onPress={() => this._navigateForward()}
        />
      </Appbar>
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
