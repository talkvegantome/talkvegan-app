import React from 'react';
import { SafeAreaView, ScrollView, View, Text, Linking, TouchableHighlight } from 'react-native';
import { Overlay } from 'react-native-elements';
import RNAmplitude from 'react-native-amplitude-analytics';
import amplitudeSettings from '../../assets/amplitudeSettings.json'

import {commonStyle} from '../styles/Common.style.js'

class analytics{
  constructor(settings){
      this.settings = settings
      // Do not track session events otherwise we will always log when we initialise amplitude
      this.amplitude = new RNAmplitude(amplitudeSettings.apiKey, false);
  }
  logEvent(eventName, data){
    if(!this.settings.analyticsEnabled){
      return
    }
    this.amplitude.logEvent(eventName, data)
  }
}

export class PrivacyDialog extends React.Component{
  constructor(props) {
    super(props);
  }
  textStyle = {lineHeight:20}
  denyStyle = {backgroundColor: '#6c757d', borderRadius: 10, paddingVertical: 15, paddingHorizontal: 25}
  acceptStyle = {backgroundColor: '#28a745', borderRadius: 10, paddingVertical: 15, paddingHorizontal: 25}
  async setConsent(result){
    await this.props.storage.updateSetting('analyticsPromptAnswered', true)
    await this.props.storage.updateSetting('analyticsEnabled', result)
  }
  render() {
    return (
      <Overlay
          animationType="slide"
          isVisible={!this.props.storage.settings.loading && !this.props.storage.settings.analyticsPromptAnswered}
        >
        <SafeAreaView style={{ flex: 1, flexDirection: 'column'}}>
        <ScrollView style={{padding:20}}>
          <Text style={{...this.textStyle,...{fontSize:22, marginBottom:20}}}>Telemetry</Text>
          <Text style={this.textStyle}>
            Welcome to TalkVeganToMe! Before you get started we&lsquo;d like to ask your permission to enable analytics/telemetry in this app.
            This sends some additional data about how you use the app back to us to help us understand how to make the app better.
            That data includes, but is not limited to:
          </Text>
          <Text style={this.textStyle}>- Platform</Text>
          <Text style={this.textStyle}>- Device Type</Text>
          <Text style={this.textStyle}>- Device Family</Text>
          <Text style={this.textStyle}>- Country</Text>
          <Text style={this.textStyle}>- City</Text>
          <Text style={this.textStyle}>- Region</Text>
          <Text style={this.textStyle}>- Carrier</Text>
          <Text style={this.textStyle}>- OS</Text>
          <Text style={this.textStyle}>- Language</Text>
          <Text style={this.textStyle}>It also provides us with a warm fuzzy feeling to know our app is beinfg used!</Text>
          <Text style={this.textStyle}>For more information on how this data is used, see the </Text>
          <Text style={{...this.textStyle, ...{textDecorationLine:'underline'}}}
                onPress={() => Linking.openURL(this.props.storage.config.privacyPolicyUrl)}>
                Privacy Policy
          </Text>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20}}>
            <TouchableHighlight style={this.denyStyle} onPress={()=> this.setConsent(false)}>
              <Text style={{color: commonStyle.light, fontWeight: 'bold'}}>Opt Out</Text>
            </TouchableHighlight>

            <TouchableHighlight style={this.acceptStyle} onPress={()=> this.setConsent(true)}>
              <Text style={{color: commonStyle.light, fontWeight: 'bold'}}>Opt In</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
        </SafeAreaView>
      </Overlay>
    )
  }
}

export default analytics
