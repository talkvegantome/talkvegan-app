import {data} from './index.json'
import {_} from 'lodash'
let pages = {}
let menu = {}

data.map((page) => {
  if(!page.section.machineName){
    return
  }
  pages[page.machineName] = page.rawContent
  if(!(page.section.machineName in menu)){
    menu[page.section.machineName] = {
      friendlyName: page.section.friendlyName,
      subItems: []
    }
  }
  menu[page.section.machineName].subItems.push({
    friendlyName: page.friendlyName,
    screenId: page.machineName
  })
})

pages['default'] = `
# Welcome to VegBook
This app provides a resource of information to help new and old vegans navigate the world.

## Contributors

1. The vast majority of the content comes from Earthling Ed of Surge Activism.
Who has kindly agreed to let us reproduce the work from his book [30 Non-Vegan Excuses](https://earthlinged.org/ebook).`




export {pages}
export {menu}
