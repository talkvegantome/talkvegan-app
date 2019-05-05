import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './sideMenu.style.js';
import {NavigationActions, StackActions} from 'react-navigation';
import {ScrollView, Text, View, SafeAreaView} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import _ from 'lodash';
import {pages, menu} from './pages.js'

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

    menuObjects = _.map( menu, (headerItem, header) => {
      headerFriendlyName = headerItem.friendlyName

      items = headerItem.subItems.map((item) => {
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
      display = headerFriendlyName in headerVisibility && headerVisibility[headerFriendlyName]? 'block': 'none'
      return (
        <View key={headerFriendlyName}>
          <ListItem
            key={headerFriendlyName}
            bottomDivider={true}
            containerStyle={styles.sectionHeadingStyle}
            titleStyle={styles.sectionHeadingTitleStyle}
            leftIcon={{name: 'expand-more', iconStyle: styles.sectionHeadingTitleStyle}}
            title={headerFriendlyName}
            onPress={()=>{this.toggleHeaderVisibility(headerFriendlyName)}}
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
};

export default SideMenu;
