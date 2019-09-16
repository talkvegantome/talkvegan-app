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
});

testLanguage({
  languageToTest: 'English',
  languageToTestShortCode: 'en',
  previousLanguage: 'English',
  languageSelectorDirection: 'up',
  expectFavouritesToAlreadyExist: false,
  searchTerm: 'Soy',
});
testLanguage({
  languageToTest: 'Français',
  languageToTestShortCode: 'fr',
  previousLanguage: 'English',
  languageSelectorDirection: 'down',
  expectFavouritesToAlreadyExist: false,
  searchTerm: 'Régime végétalien',
});
testLanguage({
  languageToTest: 'English',
  languageToTestShortCode: 'en',
  previousLanguage: 'Français',
  languageSelectorDirection: 'up',
  expectFavouritesToAlreadyExist: true,
  searchTerm: 'Soy',
});

let clickRelativeInsideElement = (
  elem,
  y = 0,
  x = 0,
  relative_to = 'top_left'
) => {
  elemLocation = elem.getLocation();
  elemenSize = elem.getSize();
  if (relative_to === 'top_left') {
    newX = x + elemLocation.x;
    newY = y + elemLocation.y;
  }
  if (relative_to === 'bottom_right') {
    newX = elemenSize.width + elemLocation.x - x;
    newY = elemenSize.height + elemLocation.y - y;
  }
  driver.touchPerform([
    {
      action: 'press',
      options: {
        x: newX,
        y: newY,
      },
    },
  ]);
};

let swipFromElemTo = (elem, y = 0, x = 0) => {
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

function testLanguage(
  props = {
    languageToTest: 'English',
    languageToTestShortCode: 'fr',
    previousLanguage: 'Français',
    languageSelectorDirection: 'up',
    expectFavouritesToAlreadyExist: true,
  }
) {
  describe(`Test ${props.languageToTest}`, () => {
    it(`should be able to swap to ${props.languageToTest}`, () => {
      languagePickerElem = getToLanguagePicker(props.previousLanguage);
      swipFromElemTo(
        languagePickerElem,
        props.languageSelectorDirection === 'up' ? 1024 : 0
      );
      let doneElem = iosPredicatePicker(
        'XCUIElementTypeOther',
        'Done',
        'BEGINSWITH'
      );
      doneElem.click();
    });

    it(`should be able to press rate app button without crashing`, () => {
      $('~rate_app_button').click();
    });

    it(`should be able to toggle analytics without crashing`, () => {
      clickRelativeInsideElement(
        $('~analytics_toggle'),
        25,
        50,
        'bottom_right'
      );
    });

    it(`should be able to sync data without crashing`, () => {
      $('~sync_data_button').click();
    });

    it('should be able to open a page', () => {
      clickBottomNavButton('Home');
      let randomArticle = iosPredicatePicker(
        'XCUIElementTypeOther',
        `/${props.languageToTestShortCode}/`,
        'BEGINSWITH'
      );
      randomArticle.click();
    });

    if (!props.expectFavouritesToAlreadyExist) {
      it('should have no favourites', () => {
        clickBottomNavButton('Favourites');
        iosPredicatePicker(
          'XCUIElementTypeStaticText',
          'No favourites found'
        ).waitForDisplayed();
      });
    } else {
      it('should be able to remove favourites', () => {
        clickBottomNavButton('Favourites');
        let noFavourites = iosPredicatePicker(
          'XCUIElementTypeStaticText',
          'No favourites found'
        );
        if (!_.isNil(noFavourites.error)) {
          let unfavouriteButton = $('~favouriteRow');
          clickRelativeInsideElement(unfavouriteButton, 15, 15);
        }
      });
    }

    it('search should work', () => {
      clickBottomNavButton('Search');
      $('~search_bar').setValue(`${props.searchTerm}\uE006`);
      // console.log(driver.getPageSource())
      $('~search_result').waitForDisplayed();
    });

    it('should be able to open a search result', () => {
      // console.log(driver.getPageSource())
      $('~search_result').click();
    });

    it('should be able to open a page', () => {
      clickBottomNavButton('Home');
      let randomArticle = iosPredicatePicker(
        'XCUIElementTypeOther',
        `/${props.languageToTestShortCode}/`,
        'BEGINSWITH'
      );
      randomArticle.click();
    });

    it('should be able to favourite a page', () => {
      $('~favourite_this_page').click();
    });

    it('should be able to go forward a page', () => {
      $('~next_article_button').click();
    });

    it('should be able to go backwards a page', () => {
      $('~previous_article_button').click();
    });

    it('should be able to share a page', () => {
      $('~share_button').click();
      iosPredicatePicker(
        'XCUIElementTypeButton',
        'Cancel',
        'BEGINSWITH'
      ).click();
    });

    it('new favourite should appear in favourites', () => {
      clickBottomNavButton('Favourites');
      // Should not show 'No favourites'
      iosPredicatePicker(
        'XCUIElementTypeStaticText',
        'No favourites found'
      ).waitForDisplayed(null, true);
    });

    it('unfavourite new favourite should work', () => {
      let unfavouriteButton = $('~favouriteRow');
      clickRelativeInsideElement(unfavouriteButton, 15, 15);
      iosPredicatePicker(
        'XCUIElementTypeStaticText',
        'No favourites found'
      ).waitForDisplayed();
    });
    it('undo unfavourite should work', () => {
      let undoButton = iosPredicatePicker(
        'XCUIElementTypeButton',
        'UNDO',
        '=='
      );
      undoButton.click();
      // Should not show 'No favourites'
      iosPredicatePicker(
        'XCUIElementTypeStaticText',
        'No favourites found'
      ).waitForDisplayed(null, true);
    });
    it('should be able to go back to the home page', () => {
      for (let i = 0; i < 4; i++) {
        $('~back_button').click();
      }
      let randomArticle = iosPredicatePicker(
        'XCUIElementTypeOther',
        `/${props.languageToTestShortCode}/`,
        'BEGINSWITH'
      );
      randomArticle.waitForDisplayed();
    });
  });
}

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
