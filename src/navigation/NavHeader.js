import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Surface, TouchableRipple } from 'react-native-paper';
import color from 'color';
import { Icon } from 'react-native-elements';
import { PaperTheme } from '../styles/Common.style';

export default class Header extends React.Component {
  state = {
    elevation: new Animated.Value(2),
  };
  _handlePressIn = () => {
    if (this.props.mode === 'contained') {
      Animated.timing(this.state.elevation, {
        toValue: 8,
        duration: 200,
      }).start();
    }
  };

  _handlePressOut = () => {
    if (this.props.mode === 'contained') {
      Animated.timing(this.state.elevation, {
        toValue: 2,
        duration: 150,
      }).start();
    }
  };

  render() {
    const { roundness } = PaperTheme;
    const font = PaperTheme.fonts.medium;
    const rippleColor = color('#FFFFFF')
      .alpha(0.32)
      .rgb()
      .string();
    const buttonStyle = {
      backgroundColor: this.props.backgroundColor,
      borderColor: this.props.borderColor,
      borderWidth: this.props.borderWidth,
      borderRadius: roundness,
    };
    return (
      <Surface
        style={[
          { borderStyle: 'solid' },
          { elevation: this.state.elevation },
          buttonStyle,
          this.props.style,
        ]}>
        <TouchableRipple
          borderless
          delayPressIn={0}
          onPress={this.props.onPress}
          onPressIn={this._handlePressIn}
          onPressOut={this._handlePressOut}
          accessibilityTraits="button"
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityStates={[]}
          rippleColor={rippleColor}
          style={{ borderRadius: roundness, width: '100%' }}>
          <View style={[styles.content, this.props.contentStyle]}>
            <View style={{ ...styles.icon, ...{ width: this.props.iconSize } }}>
              <Icon
                name={this.props.icon}
                size={this.props.iconSize}
                color="#FFFFFF"
              />
            </View>
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                font,
                styles.uppercaseLabel,
                this.props.textStyle,
              ]}>
              {this.props.children}
            </Text>
          </View>
        </TouchableRipple>
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    minWidth: 64,
    borderStyle: 'solid',
  },
  compact: {
    minWidth: 'auto',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  icon: {
    width: 16,
    marginVertical: 9,
    marginLeft: 12,
    marginRight: -4,
  },
  label: {
    textAlign: 'left',
    letterSpacing: 1,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  compactLabel: {
    marginHorizontal: 8,
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
});
