import React from 'react';
import { View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import { _ } from 'lodash';
import Wrapper from '../wrapper/Wrapper';
import { commonStyle } from '../styles/Common.style.js';

export default class Favourites extends React.Component {
  constructor(props) {
    super(props);
    this.props.storage.addOnRefreshListener(
      (storage) => {
        this.setState({ favourites: storage.getFavourites() });
      },
      ['favourites']
    );
    this.state = {
      undoVisible: false,
      favourites: this.props.storage.getFavourites(),
      lastUnfavourite: null,
    };
  }
  render() {
    let favouritesList;
    if (this.state.favourites.length > 0) {
      favouritesList = _.map(
        _.sortBy(this.state.favourites, ['displayName']),
        (favourite) => {
          return (
            <ListItem
              key={favourite.indexId}
              leftIcon={{
                name: 'favorite',
                color: commonStyle.primary,
                onPress: () => {
                  this.props.storage.toggleFavourite(favourite);
                  this.setState({
                    undoVisible: true,
                    lastUnfavourite: favourite,
                  });
                },
              }}
              topDivider={true}
              bottomDivider={true}
              title={favourite.displayName}
              onPress={() => {
                this.props.navigation.navigate(
                  favourite.pageKey,
                  { indexId: favourite.indexId },
                  'favourites'
                );
              }}
            />
          );
        }
      );
    } else {
      favouritesList = (
        <Text style={commonStyle.content}>
          No favourites found. Why not add some?
        </Text>
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
          title="Favourites"
          style={{ paddingTop: 20, paddingRight: 0, paddingLeft: 0 }}>
          {favouritesList}
        </Wrapper>
        <Snackbar
          visible={this.state.undoVisible}
          onDismiss={() => this.setState({ undoVisible: false })}
          style={{
            alignSelf: 'flex-end',
            backgroundColor: commonStyle.secondary,
            color: commonStyle.headerFontColor,
          }}
          theme={{
            colors: {
              accent: commonStyle.headerFontColor,
            },
          }}
          action={{
            label: 'Undo',
            onPress: () => {
              this.props.storage.toggleFavourite(this.state.lastUnfavourite);
            },
          }}>
          Unfavourited &apos;
          {!_.isNil(this.state.lastUnfavourite)
            ? this.state.lastUnfavourite.displayName
            : ''}
          &apos;
        </Snackbar>
      </View>
    );
  }
}
