import Gestures from '../helpers/Gestures';
import TabBar from '../screenobjects/components/tab.bar';
import FormScreen from '../screenobjects/forms.screen';
import LoginScreen from '../screenobjects/login.screen';
import { _ } from 'lodash';

describe('Test Languages', () => {
  it('should be able change languages and navigate to page', () => {
    let languagePickerElem = getToLanguagePicker('English');
    if (!_.isNil(languagePickerElem.error)) {
      driver.reset();
      languagePickerElem = getToLanguagePicker('Français');
      swipFromElemTo(languagePickerElem, 1080);
      driver.reset();
      languagePickerElem = getToLanguagePicker('English');
    }
    swipFromElemTo(languagePickerElem);
    let donePicker = "type == 'XCUIElementTypeOther' && name BEGINSWITH 'Done'";
    let doneElem = $(`-ios predicate string:${donePicker}`);
    doneElem.click();

    let homeSelector =
      "type == 'XCUIElementTypeButton' && name CONTAINS 'Home'";
    let homeButton = $(`-ios predicate string:${homeSelector}`);
    homeButton.waitForDisplayed(10000);
    homeButton.click();
    $('~régime_végétalien').click();
  });
});

let swipFromElemTo = (elem, y = 0) => {
  elemLocation = elem.getLocation();
  elemenSize = elem.getSize();
  Gestures.swipe(
    {
      // middle horizontally
      x: Math.round(elemLocation.x + elemenSize.width / 2),
      // middle vertically
      y: Math.round(elemLocation.y + elemenSize.height / 2),
    },
    {
      // middle horizontally
      x: Math.round(elemLocation.x + elemenSize.width / 2),
      // top
      y: y,
    }
  );
};

let getToLanguagePicker = (language) => {
  let settingsSelector =
    "type == 'XCUIElementTypeButton' && name CONTAINS 'Settings'";
  let settingsButton = $(`-ios predicate string:${settingsSelector}`);

  settingsButton.waitForDisplayed(1000);
  settingsButton.click();
  $('~language_button').waitForDisplayed(1000);
  $('~language_button').click();
  $('~language_picker').waitForDisplayed(1000);

  let languagePicker =
    "type == 'XCUIElementTypePickerWheel' && value CONTAINS '" + language + "'";
  let languagePickerElem = $(`-ios predicate string:${languagePicker}`);
  try {
    languagePickerElem.waitForDisplayed(1000);
  } catch {}
  return languagePickerElem;
};
