import { markdownRules } from './MarkDownRules.js';
import { MockStorage } from '../mocks/MockStorage.js';

jest.mock('./analytics');
let mockStorage = new MockStorage();
jest.doMock(
  'Linking',
  () => {
    return {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      openURL: jest.fn().mockResolvedValue(),
      canOpenURL: jest.fn(),
      getInitialURL: jest.fn(),
    };
  },
  { virtual: true }
);

test('preProcessMarkDown Catches Links', () => {
  let scenarios = [
    {
      input: '[Learning More]({{< ref "/getting-started/learning-more" >}})',
      output: '[Learning More](REF:/en/getting-started/learning-more/)',
    },
    {
      input: '[Learning More]({{<ref"getting-started/learning-more/" >}})',
      output: '[Learning More](REF:/en/getting-started/learning-more/)',
    },
    {
      input:
        '[Learning More]( { { < ref "/getting-started/learning-more" > } } )',
      output: '[Learning More](REF:/en/getting-started/learning-more/)',
    },
    {
      input: '[Google](http://google.com)',
      output: '[Google](http://google.com)',
    },
    {
      input:
        '- [E-numbers]({{ ref: "shopping/e-numbers"}}) (Animal products hide behind some e numbers)',
      output:
        '- [E-numbers](REF:/en/shopping/e-numbers/) (Animal products hide behind some e numbers)',
    },
    {
      input:
        '[acre for acre plants are on average 100 to 160 times more efficient]({{<ref "vegan-statistics/land-usage.md">}})',
      output:
        '[acre for acre plants are on average 100 to 160 times more efficient](REF:/en/vegan-statistics/land-usage/)',
    },
  ];
  let markdownRulesObj = new markdownRules({
    navigation: {},
    storage: mockStorage,
  });
  scenarios.forEach((scenario) => {
    expect(
      markdownRulesObj.preProcessMarkDown(scenario.input, mockStorage.settings)
    ).toEqual(scenario.output);
  });
});

test('preProcessMarkDown Opens Links', () => {
  let markdownRulesObj = new markdownRules({
    navigation: {},
    storage: mockStorage,
  });
  expect(() => {
    markdownRulesObj.openUrl('http:///google.com');
  }).not.toThrow();
});
