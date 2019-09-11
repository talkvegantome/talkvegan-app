import { Storage } from './Storage.js';

jest.mock('react-native-amplitude-analytics');
jest.mock('@react-native-community/async-storage', () => {
  return {
    setItem: jest.fn().mockResolvedValue(),
    getItem: jest.fn().mockResolvedValue(),
  };
});

test('Returns false when top level keys do not match', () => {
  let storage = new Storage();
  let keysToRefresh = ['settings'];
  let subKeysSaved = ['language'];
  let methodObj = { listenForKeys: [{ key: 'favourites' }] };
  expect(
    storage.shouldTriggerStorageListener(keysToRefresh, subKeysSaved, methodObj)
  ).toBeFalsy();
});

test('Returns true when top level keys match', () => {
  let storage = new Storage();
  let keysToRefresh = ['settings'];
  let subKeysSaved = ['language'];
  let methodObj = { listenForKeys: [{ key: 'settings' }] };
  expect(
    storage.shouldTriggerStorageListener(keysToRefresh, subKeysSaved, methodObj)
  ).toBeTruthy();
});

test('Returns false when top level keys match but onlySubKeys do not', () => {
  let storage = new Storage();
  let keysToRefresh = ['settings'];
  let subKeysSaved = ['language'];
  let methodObj = {
    listenForKeys: [{ key: 'settings', onlySubKeys: ['notlanguage'] }],
  };
  expect(
    storage.shouldTriggerStorageListener(keysToRefresh, subKeysSaved, methodObj)
  ).toBeFalsy();
});

test('Returns true when top level keys match and onlySubKeys match', () => {
  let storage = new Storage();
  let keysToRefresh = ['settings'];
  let subKeysSaved = ['language'];
  let methodObj = {
    listenForKeys: [{ key: 'settings', onlySubKeys: ['language'] }],
  };
  expect(
    storage.shouldTriggerStorageListener(keysToRefresh, subKeysSaved, methodObj)
  ).toBeTruthy();
});
