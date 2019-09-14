import { DateTime } from 'luxon';
import { Platform } from 'react-native';
import BackgroundFetch from './index.js';
import { MockStorage } from '../../mocks/MockStorage.js';
Platform.OS = 'android';
let mockStorage = new MockStorage();

jest.mock('react-native-amplitude-analytics');
jest.mock('react-native-background-fetch', () => {
  return {
    configure: jest.fn(),
  };
});
jest.mock('react-native-push-notification', () => {
  return {
    requestPermissions: jest.fn(),
    checkPermissions: jest.fn(),
  };
});

let bf = new BackgroundFetch({ storage: mockStorage });

test('Notifies when new article appears', () => {
  let responseJson = {
    Date: DateTime.utc().toISO(),
    Title: 'Hello!',
    Body: 'This is a test.',
  };
  bf.debug = {
    lastNotification: DateTime.utc().plus({ minutes: -10 }),
  };
  expect(bf.shouldNotify(responseJson)).toBeTruthy();
});

test('Does not notify when there is no new article', () => {
  let responseJson = {
    Date: DateTime.utc()
      .plus({ days: -10 })
      .toISO(),
    Title: 'Hello!',
    Body: 'This is a test.',
  };
  bf.debug = {
    lastNotification: DateTime.utc().plus({ minutes: 0 }),
  };
  expect(bf.shouldNotify(responseJson)).toBeFalsy();
});
