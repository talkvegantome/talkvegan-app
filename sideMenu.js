import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './sideMenu.style.js';
import {NavigationActions, StackActions} from 'react-navigation';
import {ScrollView, Text, View, SafeAreaView} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { ListItem } from 'react-native-elements';
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
          <ListItem
            key={item.friendlyName}
            style={styles.navSectionStyle} key={item.screenId}
            onPress={this.navigateToScreen(item.screenId)}
            title={item.friendlyName}
          />
        )
      })
      return (
        <View key={header.friendlyName}>
          <ListItem
            key={header.friendlyName}
            containerStyle={styles.sectionHeadingStyle}
            titleStyle={styles.sectionHeadingTitleStyle}
            title={header.friendlyName}
          />
          {items}
        </View>
      )
    })


    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <ListItem
            containerStyle={styles.navHeaderStyle}
            titleStyle={styles.navHeaderTitleStyle}
            onPress={this.navigateToScreen('default')}
            title="VegBook"/>
          {menuObjects}
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Copyright 2019</Text>
        </View>
      </SafeAreaView>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object,
  menu: PropTypes.array
};

export default SideMenu;
