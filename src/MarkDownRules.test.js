import {preProcessMarkDown} from './MarkDownRules.js';
import {MockStorage} from '../mocks/MockStorage.js'

let mockStorage = new MockStorage()

test('preProcessMarkDown Catches Links', () => {
  let scenarios = [
    {
      input: '[Learning More]({{< ref "/getting-started/learning-more" >}})',
      output: '[Learning More](REF:/en/getting-started/learning-more/)'
    },
    {
      input: '[Learning More]({{<ref"getting-started/learning-more/" >}})',
      output: '[Learning More](REF:/en/getting-started/learning-more/)'
    },
    {
      input: '[Learning More]( { { < ref "/getting-started/learning-more" > } } )',
      output: '[Learning More](REF:/en/getting-started/learning-more/)'
    },
    {
      input: '[Google](http://google.com)',
      output: '[Google](http://google.com)'
    }
  ]

  scenarios.forEach((scenario) => {
      expect(preProcessMarkDown(scenario.input, mockStorage.settings)).toBe(scenario.output)
  })

});
