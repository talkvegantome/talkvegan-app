import React from 'react';
import Wrapper from './Wrapper.js';
import renderer from 'react-test-renderer';

import {MockNavigation} from '../../mocks/MockNavigation.js'
let mockNavigation = new MockNavigation()


test('Wrapper Renders Correctly', () => {
  const tree = renderer.create(<Wrapper
    navigation={mockNavigation}
  />).toJSON();
  expect(tree).toMatchSnapshot();
});
