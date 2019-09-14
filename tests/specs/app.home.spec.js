import Gestures from '../helpers/Gestures';
import { _ } from 'lodash';

describe('Test Startup', () => {
  it('should prompt for permission to notify', () => {
    let allowButton = iosPredicatePicker(
      'XCUIElementTypeButton',
      'Allow',
      'BEGINSWITH'
    );
    allowButton.click();
  });
  it('should prompt for analytics permissions', () => {
    let optInButton = iosPredicatePicker(
      'XCUIElementTypeButton',
      'Opt In',
      'BEGINSWITH'
    );
    optInButton.click();
  });
  it('should be in English', () => {
    let englishArticle = iosPredicatePicker(
      'XCUIElementTypeOther',
      '/en/',
      'BEGINSWITH'
    );
    englishArticle.waitForDisplayed();
  });

  it('should have no favourites in English', () => {
    clickBottomNavButton('Favourites');
    iosPredicatePicker(
      'XCUIElementTypeStaticText',
      'No favourites found'
    ).waitForDisplayed();
  });
});
describe('Test English', () => {
  it('should be able to open a page', () => {
    clickBottomNavButton('Home');
    let randomArticle = iosPredicatePicker(
      'XCUIElementTypeOther',
      '/en/',
      'BEGINSWITH'
    );
    randomArticle.click();
  });

  it('should be able to favourite a page', () => {
    $('~favourite_this_page').click();
  });

  it('new favourite should appear in favourites', () => {
    clickBottomNavButton('Favourites');
    // Should not show 'No favourites'
    iosPredicatePicker(
      'XCUIElementTypeStaticText',
      'No favourites found'
    ).waitForDisplayed(null, true);
  });

  // it('Unfavourite new favourite should work', () => {
  //   //const selector  = '**/XCUIElementTypeOther[`name BEGINSWITH "unfavourite_"`]/XCUIElementTypeOther/XCUIElementTypeOther[`name BEGINSWITH "unfavourite_"`]'
  //   //const selector  = '**/XCUIElementTypeOther[`name BEGINSWITH "unfavourite_"`]/XCUIElementTypeScrollView/XCUIElementTypeOther[`name BEGINSWITH "unfavourite_"`]/XCUIElementTypeOther[`name BEGINSWITH "unfavourite_"`]'
  //   // const selector =
  //   //   '**/XCUIElementTypeOther[`name CONTAINS "unfavourite_"`]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeButton';
  //   // const unfavouriteButton = $(`-ios class chain:${selector}`);
  //   //console.log(unfavouriteButton);
  //   console.log(driver.getPageSource());

  //   // TRY XPATH checking the selector on line
  //   let unfavouriteButton = $('~unfavourite_*')
  //   unfavouriteButton.click();

  //   iosPredicatePicker(
  //     'XCUIElementTypeStaticText',
  //     'No favourites found'
  //   ).waitForDisplayed();
  // });
});

describe('Test French', () => {
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
  });
  it('should have no favourites', () => {
    clickBottomNavButton('Favourites');
    iosPredicatePicker(
      'XCUIElementTypeStaticText',
      'No favourites found'
    ).waitForDisplayed();
  });
  it('should be able to open a page', () => {
    clickBottomNavButton('Home');
    let randomArticle = iosPredicatePicker(
      'XCUIElementTypeOther',
      '/fr/',
      'BEGINSWITH'
    );
    randomArticle.click();
  });
  it('should be able to favourite a page', () => {
    $('~favourite_this_page').click();
  });

  it('new favourite should appear in favourites', () => {
    clickBottomNavButton('Favourites');
    // Should not show 'No favourites'
    iosPredicatePicker(
      'XCUIElementTypeStaticText',
      'No favourites found'
    ).waitForDisplayed(null, true);
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

let iosPredicatePicker = (
  elementName,
  text,
  operator = 'CONTAINS',
  property = 'name'
) => {
  let predicatePicker = `type == '${elementName}' && ${property} ${operator} '${text}'`;
  return $(`-ios predicate string:${predicatePicker}`);
};

// let unfavouriteAll = () => {
//     console.log('unfavouriting all')
//   let unfavouriteButton = iosPredicatePicker(
//     'XCUIElementTypeOther',
//     'unfavourite_',
//     'BEGINSWITH'
//   );
//   console.log(unfavouriteButton)
//   if(!_.isNil(unfavouriteButton.error)){
//       console.log('clicking unfavourite')
//     unfavouriteButton.click()
//     unfavouriteAll()
//   }
// };
