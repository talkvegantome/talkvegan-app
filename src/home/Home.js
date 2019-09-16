import React from 'react';
import { View } from 'react-native';
import { Appbar, FAB, ActivityIndicator } from 'react-native-paper';
import Markdown from 'react-native-markdown-renderer';
import { _ } from 'lodash';

import PageMenu from './PageMenu';
import ContentIndex from '../navigation/ContentIndex';
import Wrapper from '../wrapper/Wrapper.js';
import { markdownRules } from '../MarkDownRules.js';
import { markdownStyles } from '../styles/Markdown.style.js';
import { commonStyle } from '../styles/Common.style.js';

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: true };
    this.scrollRef = React.createRef();
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
    if (key !== 'home') {
      return;
    }
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
    if (this.props.storage.loading) {
      return {};
    }
    this.markdownRulesObj = new markdownRules(
      this.props.navigation,
      this.props.storage.settings
    );

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
          title="TalkVeganToMe"
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
            title="TalkVeganToMe"
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
          title={this.props.storage.pagesObj.getPageTitle(this.props.indexId)}
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
                  displayName: this.props.storage.pagesObj.getPageTitle(
                    this.props.indexId
                  ),
                });
              }}
            />
          }>
          <Markdown
            style={markdownStyles}
            rules={this.markdownRulesObj.returnRules()}>
            {this.markdownRulesObj.preProcessMarkDown(
              this.props.storage.pagesObj.getPageContent(this.props.indexId)
            )}
          </Markdown>
        </Wrapper>
        <PageMenu
          storage={this.props.storage}
          indexId={this.props.indexId}
          navigation={this.props.navigation}
          scrollRef={this.scrollRef}
          registerScrollListener={(method) =>
            this.setState({ scrollListener: method })
          }
        />
      </View>
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
