import React from 'react';
import Wrapper from './Wrapper.js';
import renderer from 'react-test-renderer';

test('Wrapper Renders Correctly', () => {
  const tree = renderer.create(<Wrapper/>).toJSON();
  expect(tree).toMatchSnapshot();
});
