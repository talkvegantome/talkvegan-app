import Gestures from '../helpers/Gestures';
import TabBar from '../screenobjects/components/tab.bar';
import FormScreen from '../screenobjects/forms.screen';
import LoginScreen from '../screenobjects/login.screen';
import { _ } from 'lodash';

describe('Test Languages', () => {
  it('should be in English', () => {
    let englishArticle = iosPredicatePicker(
      'XCUIElementTypeOther',
      '/en/',
      'BEGINSWITH'
    );
    if (!_.isNil(englishArticle.error)) {
      languagePickerElem = getToLanguagePicker('Français');
      swipFromElemTo(languagePickerElem, 1080);
      let doneElem = iosPredicatePicker(
        'XCUIElementTypeOther',
        'Done',
        'BEGINSWITH'
      );
      doneElem.click();
    }
    clickBottomNavButton('Home');
  });
  it('should be able to open a page in English', () => {
    let randomArticle = iosPredicatePicker(
      'XCUIElementTypeOther',
      '/en/',
      'BEGINSWITH'
    );
    randomArticle.click();
    $('~favourite_this_page').click();
  });

  // French Testing
  it('should be able to swap to French', () => {
    languagePickerElem = getToLanguagePicker('English');
    swipFromElemTo(languagePickerElem);
    let doneElem = iosPredicatePicker(
      'XCUIElementTypeOther',
      'Done',
      'BEGINSWITH'
    );
    doneElem.click();

    clickBottomNavButton('Home');
  });
  it('should be able to open a page in French', () => {
    let randomArticle = iosPredicatePicker(
      'XCUIElementTypeOther',
      '/fr/',
      'BEGINSWITH'
    );
    randomArticle.click();
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

let clickBottomNavButton = (buttonName) => {
  let settingsSelector = `type == 'XCUIElementTypeButton' && name CONTAINS '${buttonName}'`;
  let settingsButton = $(`-ios predicate string:${settingsSelector}`);
  settingsButton.waitForDisplayed();
  settingsButton.click();
};

let getToLanguagePicker = (language) => {
  clickBottomNavButton('Settings');
  $('~language_button').waitForDisplayed();
  $('~language_button').click();
  $('~language_picker').waitForDisplayed();

  let languagePicker =
    "type == 'XCUIElementTypePickerWheel' && value CONTAINS '" + language + "'";
  let languagePickerElem = $(`-ios predicate string:${languagePicker}`);
  try {
    languagePickerElem.waitForDisplayed(1000);
  } catch {}
  return languagePickerElem;
};

let iosPredicatePicker = (elementName, text, operator = 'CONTAINS') => {
  let predicatePicker = `type == 'XCUIElementTypeOther' && name ${operator} '${text}'`;
  return $(`-ios predicate string:${predicatePicker}`);
};
