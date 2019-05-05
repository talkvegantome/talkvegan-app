import {data} from './index.json'
import {_} from 'lodash'
let pages = {}
let menu = {}

data.map((page) => {
  if(!page.section.machineName && page.machineName != 'splash'){
    return
  }
  pages[page.machineName] = page.rawContent


  if(!page.section.machineName){
    return
  }
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

export {pages}
export {menu}
