import React from 'react';
import SettingsScreen from './SettingsScreen.js';
import renderer from 'react-test-renderer';

import { MockStorage } from '../../mocks/MockStorage.js';
import { MockNavigation } from '../../mocks/MockNavigation.js';

let mockStorage = new MockStorage();
let mockNavigation = new MockNavigation();

jest.mock('react-native-push-notification', () => {
  return {
    checkPermissions: jest.fn(),
  }
});
jest.mock('react-native-background-fetch', () => {
  return {
    status: jest.fn(),
  }
});
jest.mock('react-native-amplitude-analytics');

test('SettingsScreen Renders Correctly', () => {
  const tree = renderer
    .create(
      <SettingsScreen storage={mockStorage} navigation={mockNavigation} />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
