import {_} from "lodash"
import {data} from "./index.json"


_.map(data, (menuItem, index) => {
  test("index.json: '" + menuItem.friendlyName + "' machine name has a value", () => {
      expect(menuItem.machineName).not.toBeNull()
  })
  test("index.json: '" + menuItem.friendlyName + "' content has no single newlines (breaks MD)", () => {
      let pattern = /([^\n\-\d])\n([^\n\-\d])/
      //console.log(menuItem.rawContent.match(pattern))
      expect(!menuItem.rawContent.match(pattern));

  })
});
