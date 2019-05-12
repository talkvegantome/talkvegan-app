import React from 'react';
import SideMenu from './SideMenu.js';
import renderer from 'react-test-renderer';

import {MockStorage} from '../../mocks/MockStorage.js'

let mockStorage = new MockStorage()

test('SideMenu Renders Correctly', () => {
  const tree = renderer.create(<SideMenu storage={mockStorage}/>).toJSON();
  expect(tree).toMatchSnapshot();
});
