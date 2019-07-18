import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from '../styles/SideMenu.style.js';
import {ScrollView, View, SafeAreaView } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import _ from 'lodash';

import Analytics from '../analytics'

import Pages from '../Pages.js'

class SideMenu extends Component {
  render () {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView style={styles.container} bounces={false}>
          <ListItem
            containerStyle={styles.navHeaderStyle}
            titleStyle={styles.navHeaderTitleStyle}
            // onPress={this.navigateToScreen('/'+this.state.settings.language+'/splash/')}
            title={this.props.title}/>
          <Divider style={{...styles.dividerStyle,...{height: 2}}} />
          <MenuItems {...this.props}/>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export class MenuItems extends Component{
  constructor(props) {
    super(props);
    this.props.storage.triggerUpdateMethods.push((storage) => {
      this.refreshStorage(storage)
    })
    let pages = new Pages(this.props.storage)
    let analytics = new Analytics(this.props.storage.settings)
    this.state = {
      analytics: analytics,
      settings: this.props.storage.settings,
      menu: pages.getMenu(),
      splashPath: pages.getSplashPath(),
      headerVisibility: {}
    };
  }

  refreshStorage(storage){
    let pages = new Pages(storage)
    let analytics = new Analytics(storage.settings)
    this.setState({
      analytics: analytics,
      settings: storage.settings,
      menu: pages.getMenu(storage),
      splashPath: pages.getSplashPath()
    })
  }
  navigateToScreen = (indexId) => () => {
    // Navigation is always to the 'Home' screen, but content changes based on the indexId
    this.props.navigation.navigate('Home', {indexId: indexId});
    this.props.navigation.closeDrawer();
    this.state.analytics.logEvent('navigateToPage', {relPath: indexId})
  }
  toggleHeaderVisibility = (headerName) => {
    let headerVisibility = this.state.headerVisibility
    if(headerVisibility[headerName]){
      headerVisibility[headerName] = false
    }else{
        _.forEach(headerVisibility, (val, headerName) => {
          headerVisibility[headerName] = false
        })
        headerVisibility[headerName] = true
    }

    this.setState({headerVisibility: headerVisibility})
  }

  generateMenuObjects(){
    let menuSorted = _.sortBy(this.state.menu, ['weight', 'friendlyName'])
    return _.map(menuSorted, (headerItem) => {
      let headerFriendlyName = headerItem.friendlyName
      let items = _.sortBy(headerItem.subItems, ['weight', 'friendlyName']).map((item) => {
        if(!_.isNil(item.displayInApp) && !item.displayInApp){
          // Don't display this page if it has displayInApp=false
          return 
        }
        return(
          <ListItem
            bottomDivider={true}
            containerStyle={styles.itemHeadingStyle}
            titleStyle={styles.itemHeadingTitleStyle}
            key={item.relativePermalink}
            onPress={this.navigateToScreen(item.relativePermalink)}
            title={item.friendlyName}
          />
        )
      })


      let headerVisibility = this.state.headerVisibility
      let display = headerFriendlyName in headerVisibility && headerVisibility[headerFriendlyName]? 'flex': 'none'
      return (
        <View key={headerFriendlyName}>
          <ListItem
            key={headerFriendlyName}
            containerStyle={styles.sectionHeadingStyle}
            titleStyle={styles.sectionHeadingTitleStyle}
            leftIcon={{
                name: display == 'flex' ? 'expand-less': 'expand-more', 
                iconStyle: styles.sectionHeadingTitleStyle
            }}
            title={headerFriendlyName}
            onPress={()=>{this.toggleHeaderVisibility(headerFriendlyName)}}
          />
          <Divider style={styles.dividerStyle} />
          <View style={{display:display}} animationType="slide">
            {items}
          </View>
        </View>
      )
    })
  }
  render(){
    return (
      <View>{this.generateMenuObjects()}</View>
    )
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object,
};

export default SideMenu;