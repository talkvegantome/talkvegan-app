import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './sideMenu.style.js';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View} from 'react-native';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render () {
    menu = [
      {
        "friendlyName": "Header 1",
        "screenId": "screen1",
        "subItems":[
          {
            "friendlyName": "Item 1",
            "screenId": "screen1"
          }
        ]
      }
    ]
    let navmenu = this;
    menuObjects = _.map(menu, function(header){
      items = _.map(header.subItems, function(item){
        return(
          <View style={styles.navSectionStyle} key={item.screenId}>
            <Text style={styles.navItemStyle} onPress={navmenu.navigateToScreen(item.screenId)}>
              {item.friendlyName}
            </Text>
          </View>
        )
      })
      return (
        <View key={header.friendlyName}>
          <Text style={styles.sectionHeadingStyle}>
            {header.friendlyName}
          </Text>
          {items}
        </View>
      )
    })


    return (
      <View style={styles.container}>
        <ScrollView>
          {menuObjects}
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text>This is my fixed footer</Text>
        </View>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;
