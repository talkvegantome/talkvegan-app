import React, { Component } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import RemoveMarkdown from 'remove-markdown';
import { commonStyle } from '../styles/Common.style';
import { markdownStyles } from '../styles/Markdown.style';
import _ from 'lodash';

import CarouselNav, { NavigationCard } from './CarouselNav';
import NavHeader from './NavHeader.js';

export default class ContentIndex extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: this.props.storage.loading };
  }
  componentDidMount() {
    if (!this.state.loading) {
      this.pagesList = this.generatePagesList(this.props.storage.pagesObj);
    }
    this.props.storage.addOnRefreshListener(this._storageListener);
  }
  componentWillUnmount() {
    this.props.storage.removeOnRefreshListener(this._storageListener);
  }

  _storageListener = () => {
    if (this.props.storage.loading) {
      return;
    }
    this.pagesList = this.generatePagesList(this.props.storage.pagesObj);
    this.setState({ loading: false });
  };

  generatePagesList() {
    let menuSorted = _.sortBy(this.props.storage.pagesObj.getMenu(), [
      'weight',
      'friendlyName',
    ]);
    return _.map(menuSorted, (headerItem) => {
      return {
        headerItem: headerItem,
        pagesInCategory: this.props.storage.pagesObj.getPagesInCategory(
          headerItem
        ),
      };
    });
  }

  render() {
    if (this.state.loading) {
      return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;
    }
    return _.map(this.pagesList, (menuItem, i) => (
      <View testID="content_index" accessibilityLabel="content_index" key={i}>
        <CarouselNavWrapper
          headerItem={menuItem.headerItem}
          pagesInCategory={menuItem.pagesInCategory}
          navigation={this.props.navigation}
        />
      </View>
    ));
  }
}

class CarouselNavWrapper extends React.Component {
  state = {
    expanded: false,
  };
  constructor(props) {
    super(props);
  }

  generateCardList() {
    return _.map(this.props.pagesInCategory, (item) => {
      return {
        title: item.friendlyName,
        content: item.description
          ? item.description
          : RemoveMarkdown(item.rawContent).replace(/\n/g, ' '),
        relativePermalink: item.relativePermalink,
      };
    });
  }
  expandHeader = () => this.setState({ expanded: !this.state.expanded });
  render() {
    let headerFriendlyName = this.props.headerItem.friendlyName;
    this.items = this.generateCardList();
    this.index = _.random(0, this.items.length - 1);
    return (
      <View key={headerFriendlyName}>
        <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 20 }}>
          <NavHeader
            mode="contained"
            dark={true}
            icon={this.state.expanded ? 'expand-more' : 'chevron-right'}
            backgroundColor={commonStyle.secondary}
            iconSize={20}
            style={{
              alignItems: 'flex-start',
              marginTop: markdownStyles.heading1.marginTop,
              width: '100%',
            }}
            textStyle={{
              color: 'white',
              fontSize: 15,
            }}
            size={20}
            onPress={this.expandHeader}>
            {headerFriendlyName}
          </NavHeader>
        </View>

        {!this.state.expanded && (
          <CarouselNav
            items={this.items}
            firstItem={this.index}
            navigation={this.props.navigation}></CarouselNav>
        )}
        <View
          style={{
            borderLeftColor: commonStyle.primary,
            borderLeftWidth: 2,
            marginLeft: 30,
            marginRight: 40,
          }}>
          {this.state.expanded &&
            _.map(this.items, (item, i) => (
              <NavigationCard
                key={i}
                item={item}
                navigation={this.props.navigation}
                style={{ marginLeft: 10, marginBottom: 20 }}
              />
            ))}
        </View>
      </View>
    );
  }
}
