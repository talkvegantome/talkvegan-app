import React from 'react';
import { View, ScrollView } from 'react-native';
import { commonStyle, PaperTheme } from '../styles/Common.style.js';
import { Provider as PaperProvider, Appbar } from 'react-native-paper';
import { _ } from 'lodash';

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
    this.state = {
      showBackButton: this.props.navigation.navigationHistory.length > 1,
    };
    if (!_.isNil(this.props.scrollRefPopulator)) {
      this.props.scrollRefPopulator(this.scrollRef);
    }
  }

  componentDidMount() {
    this.props.navigation.addOnNavigateListener({
      method: this._navigateListener,
    });
  }
  componentWillUnmount() {
    this.props.navigation.removeOnNavigateListener(this._navigateListener);
  }
  _navigateListener = (key) => {
    let showBackButton = this.props.navigation.navigationHistory.length > 1;
    if (showBackButton != this.state.showBackButton) {
      this.setState({ showBackButton: showBackButton });
    }
    if (key === 'home') {
      this.scrollRef.current.scrollTo({ y: 0, animated: false });
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <PaperProvider theme={PaperTheme}>
          <Appbar.Header
            style={{ backgroundColor: commonStyle.headerBackgroundColor }}>
            <Appbar.Action
              style={
                // Hide back button if there's no back to go to.
                this.state.showBackButton ? {} : { display: 'none' }
              }
              testID="back_button"
              icon="keyboard-arrow-left"
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
            <Appbar.Content
              testID={'page_title'}
              titleStyle={{
                color: commonStyle.headerFontColor,
              }}
              title={this.props.title}
            />
            {this.props.rightComponent}
          </Appbar.Header>
          <ScrollView
            ref={this.scrollRef}
            style={{ ...commonStyle.content, ...this.props.style }}
            scrollEventThrottle={0} // DO NOT SET TO ANYTHING OTHER THAN 0 YOUR CPU WILL EXPLODE
            onScroll={(e) => {
              if (!_.isNil(this.props.scrollListener)) {
                this.props.scrollListener(e);
              }
            }}>
            {this.props.children}
            <View style={{ height: 50 }}></View>
          </ScrollView>
        </PaperProvider>
      </View>
    );
  }
}

export default Wrapper;
