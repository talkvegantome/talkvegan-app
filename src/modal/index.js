import React from 'react';
import { View } from 'react-native';
import { Modal, Portal, Text, Button, Surface } from 'react-native-paper';
import { commonStyle, PaperTheme } from '../styles/Common.style';

export default class TalkVeganModal extends React.Component {
  render() {
    return (
      <Portal>
        <Modal visible={this.props.visible}>
          <Surface
            style={{
              width: '80%',
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: 20,
            }}>
            {this.props.children}
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
