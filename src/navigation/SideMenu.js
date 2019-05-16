import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from '../styles/SideMenu.style.js';
import {ScrollView, View, SafeAreaView} from 'react-native';
import { ListItem } from 'react-native-elements';
import Pages from '../Pages.js'
import _ from 'lodash';

// AWS Amplify
import Amplify, { Analytics } from 'aws-amplify';
import awsmobile from '../../aws-exports';
Amplify.configure(awsmobile);

class SideMenu extends Component {

  constructor(props) {
    super(props);
    this.props.storage.triggerUpdateMethods.push((storage) => {
      this.refreshStorage(storage)
    })
    let pages = new Pages(this.props.storage)

    this.state = {
      settings: this.props.storage.settings,
      menu: pages.getMenu(),
      splashPath: pages.getSplashPath(),
      headerVisibility: {}
    };
  }
  refreshStorage(storage){
    let pages = new Pages(storage)
    this.setState({
      settings: storage.settings,
      menu: pages.getMenu(storage),
      splashPath: pages.getSplashPath()
    })
  }
  navigateToScreen = (indexId) => () => {
    // Navigation is always to the 'Home' screen, but content changes based on the indexId
    this.props.navigation.navigate('Home', {indexId: indexId});
    this.props.navigation.closeDrawer();

    Analytics.record({name: 'navigateToScreen', attributes: {indexId: indexId}})
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

  render () {
    let menuSorted = _.sortBy(this.state.menu, ['weight', 'friendlyName'])
    let menuObjects = _.map(menuSorted, (headerItem) => {
      let headerFriendlyName = headerItem.friendlyName
      let items = _.sortBy(headerItem.subItems, ['weight', 'friendlyName']).map((item) => {
        return(
          <ListItem
            bottomDivider={true}
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
            onPress={this.navigateToScreen('/'+this.state.settings.language+'/splash/')}
            title="TalkVeganToMe"/>
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
