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
    },
    {
      input: '- [E-numbers]({{ ref: "shopping/e-numbers"}}) (Animal products hide behind some e numbers)',
      output: '- [E-numbers](REF:/en/shopping/e-numbers/) (Animal products hide behind some e numbers)'
    },
    {
      input: '[acre for acre plants are on average 100 to 160 times more efficient]({{<ref "vegan-statistics/land-usage.md">}})',
      output: '[acre for acre plants are on average 100 to 160 times more efficient](REF:/en/vegan-statistics/land-usage/)'
    }
  ]

  scenarios.forEach((scenario) => {
      expect(preProcessMarkDown(scenario.input, mockStorage.settings)).toEqual(scenario.output)
  })

});
