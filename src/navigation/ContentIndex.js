import React, { Component } from 'react';
import { View } from 'react-native';
import RemoveMarkdown from 'remove-markdown';
import { commonStyle } from '../styles/Common.style';
import { markdownStyles } from '../styles/Markdown.style';
import _ from 'lodash';

import CarouselNav, { NavigationCard } from './CarouselNav';
import NavHeader from './NavHeader.js';

import Pages from '../Pages.js';

export default class ContentIndex extends Component {
  componentDidMount() {
    this.pagesList = this.generatePagesList(new Pages(this.props.storage));
    this.props.storage.addOnRefreshListener(this._storageListener);
  }
  componentWillUnmount() {
    this.props.storage.removeOnRefreshListener(this._storageListener);
  }

  _storageListener = () => {
    this.pagesList = this.generatePagesList(new Pages(this.props.storage));
    this.setState({ triggerRender: true });
  };

  generatePagesList(pagesObj) {
    let menuSorted = _.sortBy(pagesObj.getMenu(), ['weight', 'friendlyName']);
    return _.map(menuSorted, (headerItem) => {
      return {
        headerItem: headerItem,
        pagesInCategory: pagesObj.getPagesInCategory(headerItem),
      };
    });
  }

  render() {
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
  navigateToScreen = (indexId) => () => {
    // Navigation is always to the 'Home' screen, but content changes based on the indexId
    this.props.navigation.navigate(
      'home',
      { indexId: indexId },
      'carouselNavCard'
    );
  };
  generateCardList() {
    return _.map(this.props.pagesInCategory, (item) => {
      return {
        title: item.friendlyName,
        content: item.description
          ? item.description
          : RemoveMarkdown(item.rawContent).replace(/\n/g, ' '),
        relativePermalink: item.relativePermalink,
        navigateTo: this.navigateToScreen(item.relativePermalink),
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
                style={{ marginLeft: 10, marginBottom: 20 }}
              />
            ))}
        </View>
      </View>
    );
  }
}
