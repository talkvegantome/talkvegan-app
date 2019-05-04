import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './sideMenu.style.js';
import {NavigationActions, StackActions} from 'react-navigation';
import {ScrollView, Text, View} from 'react-native';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';

class SideMenu extends Component {
  navigateToScreen = (key) => () => {

    this.props.navigation.navigate("Home", {indexId:key});
    this.props.navigation.closeDrawer();
  }

  render () {


    menuObjects = this.props.menu.map( (header) => {
      items = header.subItems.map((item) => {
        return(
          <View style={styles.navSectionStyle} key={item.screenId}>
            <Text style={styles.navItemStyle} onPress={this.navigateToScreen(item.screenId)}>
              - {item.friendlyName}
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
          <View style={styles.navHeaderStyle}>
            <Text style={styles.navHeaderTextStyle} onPress={this.navigateToScreen('default')}>Vegan Index</Text>
          </View>
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
  navigation: PropTypes.object,
  menu: PropTypes.array
};

export default SideMenu;
