import React from 'react';
import SideMenu from './SideMenu.js';
import renderer from 'react-test-renderer';

import {MockStorage} from '../../mocks/MockStorage.js'
let mockStorage = new MockStorage()
jest.mock('react-native-amplitude-analytics');


test('SideMenu Renders Correctly', () => {
  const tree = renderer.create(<SideMenu storage={mockStorage}/>).toJSON();
  expect(tree).toMatchSnapshot();
});
