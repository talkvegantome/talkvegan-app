import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './sideMenu.style.js';
import {NavigationActions, StackActions} from 'react-navigation';
import {ScrollView, Text, View, SafeAreaView} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import _ from 'lodash';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { headerVisibility: {} };
  }
  navigateToScreen = (key) => () => {
    this.props.navigation.navigate("Home", {indexId:key});
    this.props.navigation.closeDrawer();
  }
  toggleHeaderVisibility = (headerName) => {
    let headerVisibility = this.state.headerVisibility
    headerVisibility[headerName] = headerName in headerVisibility && headerVisibility[headerName] ? false : true
    this.setState({headerVisibility: headerVisibility})
  }

  render () {


    menuObjects = this.props.menu.map( (header) => {
      items = header.subItems.map((item) => {
        return(
          <ListItem
            key={item.friendlyName}
            bottomDivider={true}
            key={item.screenId}
            onPress={this.navigateToScreen(item.screenId)}
            title={item.friendlyName}
          />
        )
      })
      let headerVisibility = this.state.headerVisibility
      display = header.friendlyName in headerVisibility && headerVisibility[header.friendlyName]? 'block': 'none'
      return (
        <View key={header.friendlyName}>
          <ListItem
            key={header.friendlyName}
            bottomDivider={true}
            containerStyle={styles.sectionHeadingStyle}
            titleStyle={styles.sectionHeadingTitleStyle}
            leftIcon={{name: 'expand-more', iconStyle: styles.sectionHeadingTitleStyle}}
            title={header.friendlyName}
            onPress={()=>{this.toggleHeaderVisibility(header.friendlyName)}}
          />
          <View style={{display:display}}>
            {items}
          </View>
        </View>
      )
    })


    return (

      <SafeAreaView style={styles.safeContainer}>
        <ScrollView style={styles.container}>
          <ListItem
            containerStyle={styles.navHeaderStyle}
            titleStyle={styles.navHeaderTitleStyle}
            onPress={this.navigateToScreen('default')}
            title="VegBook"/>
          {menuObjects}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object,
  menu: PropTypes.array
};

export default SideMenu;
