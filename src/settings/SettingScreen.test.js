import React from 'react';
import SettingsScreen from './SettingsScreen.js';
import renderer from 'react-test-renderer';

import {MockStorage} from '../../mocks/MockStorage.js'
let mockStorage = new MockStorage()

jest.mock('react-native-amplitude-analytics');


test('SettingsScreen Renders Correctly', () => {
  const tree = renderer.create(<SettingsScreen storage={mockStorage}/>).toJSON();
  expect(tree).toMatchSnapshot();
});
