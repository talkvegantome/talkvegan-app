import {_} from "lodash"
import {data} from "./index.json"


_.map(data, (menuItem, index) => {
  test("index.json: '" + menuItem.friendlyName + "' machine name has a value", () => {
      expect(menuItem.machineName).not.toBeNull()
  })
});
