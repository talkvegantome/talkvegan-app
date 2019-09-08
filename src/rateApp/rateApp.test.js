import React from 'react';
import { DateTime } from 'luxon';
import RateApp from './index.js';
import { MockStorage } from '../../mocks/MockStorage.js';
import { MockNavigation } from '../../mocks/MockNavigation.js';
let mockStorage = new MockStorage();

jest.mock('react-native-amplitude-analytics');

test('Does not prompt on first open', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 0,
    lastPrompted: DateTime.utc().plus({ minutes: 0 }),
  };
  expect(r.readyToPrompt()).toBeFalsy();
});

test('Prompts first after 10 minutes', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 0,
    lastPrompted: DateTime.utc().plus({ minutes: -10, seconds: -1 }),
  };
  expect(r.readyToPrompt()).toBeTruthy();
});

test('Does not prompt second before 1 week', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 1,
    lastPrompted: DateTime.utc().plus({ days: -6 }),
  };
  expect(r.readyToPrompt()).toBeFalsy();
});

test('Prompts second after 1 week', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 1,
    lastPrompted: DateTime.utc().plus({ days: -8 }),
  };
  expect(r.readyToPrompt()).toBeTruthy();
});

test('Does not prompt third before 1 week', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 2,
    lastPrompted: DateTime.utc().plus({ days: -6 }),
  };
  expect(r.readyToPrompt()).toBeFalsy();
});

test('Prompts third after 1 week', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 2,
    lastPrompted: DateTime.utc().plus({ days: -8 }),
  };
  expect(r.readyToPrompt()).toBeTruthy();
});

test('Does not prompt fourth before 1 month', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 3,
    lastPrompted: DateTime.utc().plus({ days: -27 }),
  };
  expect(r.readyToPrompt()).toBeFalsy();
});

test('Prompts fourth after 1 month', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 3,
    lastPrompted: DateTime.utc().plus({ days: -32 }),
  };
  expect(r.readyToPrompt()).toBeTruthy();
});

test('Does not prompt fifth before 3 months', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 4,
    lastPrompted: DateTime.utc().plus({ days: -80 }),
  };
  expect(r.readyToPrompt()).toBeFalsy();
});

test('Prompts fifth after 3 months', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 4,
    lastPrompted: DateTime.utc().plus({ days: -93 }),
  };
  expect(r.readyToPrompt()).toBeTruthy();
});

test('Does not prompt sixth before 6 months', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 5,
    lastPrompted: DateTime.utc().plus({ months: -5 }),
  };
  expect(r.readyToPrompt()).toBeFalsy();
});

test('Prompts sixth after 6 month', () => {
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 5,
    lastPrompted: DateTime.utc().plus({ months: -6, days: -1 }),
  };
  expect(r.readyToPrompt()).toBeTruthy();
});

test('Does not prompt if rated', () => {
  mockStorage.settings.hasRatedApp = true;
  r = new RateApp({ storage: mockStorage });
  r.debug = {
    timesPrompted: 0,
    lastPrompted: DateTime.utc().plus({ months: -6, days: -1 }),
  };
  expect(r.readyToPrompt()).toBeFalsy();
});
