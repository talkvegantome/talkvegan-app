import React from 'react';
import { View } from 'react-native';
import { DateTime } from 'luxon';
import Duration from 'luxon/src/duration.js';
import { _ } from 'lodash';
import Rate, { AndroidMarket } from 'react-native-rate';
import Markdown from 'react-native-markdown-renderer';
import Analytics from '../analytics';

import { markdownRules } from '../MarkDownRules.js';
import { popUpmarkdownStyles } from '../styles/Markdown.style.js';
import Modal from '../modal';

export default class RateApp {
  constructor(props) {
    this.props = props;
    this.analytics = new Analytics(props.storage.settings);
    this.storage = props.storage;
  }
  ratingIntervals = {
    0: {
      duration: Duration.fromObject({ minutes: 10 }),
    },
    1: {
      duration: Duration.fromObject({ days: 7 }),
    },
    2: {
      duration: Duration.fromObject({ days: 7 }),
    },
    3: {
      duration: Duration.fromObject({ days: 30 }),
    },
    4: {
      duration: Duration.fromObject({ months: 3 }),
    },
    default: {
      duration: Duration.fromObject({ months: 6 }),
    },
  };
  ratingOptions = {
    GooglePackageName: 'com.talkvegantome',
    preferredAndroidMarket: AndroidMarket.Google,
    AppleAppID: '1463279026',
    preferInApp: false,
    fallbackPlatformURL: 'http://talkveganto.me',
  };
  durationPassed(durationRequired) {
    let lastPrompted = DateTime.fromISO(
      this.storage.settings.lastPromptedForAppRating
    );
    //lastPrompted = DateTime.utc().plus({ days: -1 });
    return DateTime.utc().diff(lastPrompted) > durationRequired;
  }
  promptForRating(callback) {
    this.dismissPrompt(true);
    Rate.rate(this.ratingOptions, callback);
  }
  readyToPrompt() {
    let timesPrompted = this.storage.settings.timesPromptedForAppRating;
    timesPrompted = 0;
    let durationRequired;
    if (!_.isNil(this.ratingIntervals[timesPrompted])) {
      durationRequired = this.ratingIntervals[timesPrompted].duration;
      return this.durationPassed(durationRequired);
    }
    durationRequired = this.ratingIntervals['default'].duration;
    return this.durationPassed(durationRequired);
  }
  dismissPrompt(hasRatedApp) {
    this.storage.updateSettings({
      lastPromptedForAppRating: DateTime.utc(),
      timesPromptedForAppRating:
        this.storage.settings.timesPromptedForAppRating + 1,
      hasRatedApp: hasRatedApp,
    });

    this.analytics.logEvent('dismissAppRatingDialog', {
      hasRatedApp: hasRatedApp,
    });
  }
}

export class RateModal extends React.Component {
  constructor(props) {
    super(props);
    this.storage = this.props.storage;
    this.markdownRules = new markdownRules({}, props.storage.settings);
  }
  state = { visible: false };
  promptBlurb = `
  ## Rate the App!

  Hi! We hope you're enjoying the app. 
  If you've found the app useful, please consider rating it so that other people can find it useful too!
  `;
  componentDidMount() {
    let timer = setInterval(() => {
      this.readyToPrompt();
    }, 10000);
    this.setState({ timer: timer });
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  componentDidUpdate() {
    if (this.storage.loading || this.state.visible) {
      return;
    }
    this.rateApp = new RateApp({ storage: this.storage });
    this.readyToPrompt();
  }
  onDismiss = () => {
    this.rateApp.dismissPrompt(false);
    this.setState({ visible: false });
  };
  onRate = () => {
    this.rateApp.promptForRating();
    this.onDismiss();
  };
  readyToPrompt() {
    if (this.rateApp.readyToPrompt()) {
      this.setState({ visible: true });
    }
  }
  render() {
    return (
      <Modal
        dismissText="Later"
        actionText="Sure!"
        onDismiss={this.onDismiss}
        onAction={this.onRate}
        visible={this.state.visible}>
        <View style={{ marginTop: -20 }} />
        <Markdown
          style={popUpmarkdownStyles}
          rules={this.markdownRules.returnRules()}>
          {this.promptBlurb}
        </Markdown>
      </Modal>
    );
  }
}
