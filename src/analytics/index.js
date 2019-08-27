import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableHighlight } from 'react-native';
import { Overlay } from 'react-native-elements';
import RNAmplitude from 'react-native-amplitude-analytics';
import amplitudeSettings from '../../assets/amplitudeSettings.json'
import Markdown from 'react-native-markdown-renderer';

import { commonStyle } from '../styles/Common.style.js'
import { popUpmarkdownStyles } from '../styles/Markdown.style.js';

class analytics {
  constructor(settings) {
    this.settings = settings
    // Do not track session events otherwise we will always log when we initialise amplitude
    this.amplitude = new RNAmplitude(amplitudeSettings.apiKey, false);
  }
  logEvent(eventName, data) {
    if (!this.settings.analyticsEnabled) { return }
    this.amplitude.logEvent(eventName, data)
  }
}

export class PrivacyDialog extends React.Component {
  constructor(props) {
    super(props);
  }
  textStyle = { lineHeight: 20 }
  denyStyle = { height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#6c757d', borderRadius: 10, paddingHorizontal: 25 }
  acceptStyle = { height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#28a745', borderRadius: 10, paddingHorizontal: 25 }
  async setConsent(result) {
    await this.props.storage.updateSetting('analyticsPromptAnswered', true)
    await this.props.storage.updateSetting('analyticsEnabled', result)
  }
  telemetryBlurb = `
# Telemetry  

Welcome to TalkVeganToMe! Before you get started we&lsquo;d like to ask your permission to enable analytics and telemetry in this app. This sends some additional data about how you use the app back to us to help us understand how to make the app better. That data includes, but is not limited to:

- Platform
- Device Type
- Device Family
- Country
- City
- Region
- Carrier
- OS
- Language

It also provides us with a warm fuzzy feeling to know our app is being used!
For more information on how this data is used, see the [Privacy Policy](` + this.props.storage.config.privacyPolicyUrl + `)
`

  render() {
    return (
      <Overlay
        animationType="slide"
        style={{overflow:'scroll'}}
        isVisible={!this.props.storage.loading && !this.props.storage.settings.analyticsPromptAnswered}
      >
        <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
          <ScrollView style={{ padding: 10 }}>
            <Markdown style={popUpmarkdownStyles}>
              {this.telemetryBlurb}
            </Markdown>
          </ScrollView>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', minHeight: 50, marginTop: 20}}>
            <TouchableHighlight style={this.denyStyle} onPress={() => this.setConsent(false)}>
              <Text style={{ color: commonStyle.light, fontWeight: 'bold'}}>Opt Out</Text>
            </TouchableHighlight>

            <TouchableHighlight style={this.acceptStyle} onPress={() => this.setConsent(true)}>
              <Text style={{ color: commonStyle.light, fontWeight: 'bold' }}>Opt In</Text>
            </TouchableHighlight>
          </View>


        </SafeAreaView>
      </Overlay>
    )
  }
}

export default analytics
