import React from 'react';
import { View, ScrollView, Dimensions, AppState } from 'react-native';
import { Modal, Portal, Text, Button, Surface } from 'react-native-paper';
import { commonStyle, PaperTheme } from '../styles/Common.style';

export default class TalkVeganModal extends React.Component {
  state = Dimensions.get('window');
  _handleAppStateChange = () => {
    this.setState(Dimensions.get('window'));
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  render() {
    return (
      <Portal>
        <Modal
          visible={this.props.visible}
          contentContainerStyle={{ maxHeight: this.state.height * 0.5 }}>
          <Surface
            style={{
              width: '80%',
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: 20,
            }}>
            <ScrollView>{this.props.children}</ScrollView>
            <View
              style={{
                marginTop: 20,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                theme={PaperTheme}
                mode="outlined"
                style={{ width: '40%' }}
                onPress={() => this.props.onDismiss()}>
                <Text>{this.props.dismissText}</Text>
              </Button>
              <Button
                mode="contained"
                theme={PaperTheme}
                onPress={() => this.props.onAction()}
                style={{ width: '40%' }}>
                <Text style={{ color: commonStyle.headerFontColor }}>
                  {this.props.actionText}
                </Text>
              </Button>
            </View>
          </Surface>
        </Modal>
      </Portal>
    );
  }
}
