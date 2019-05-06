import {data} from './index.json'
import {_} from 'lodash'
let pages = {}
let pagesMachineNameByRelativePermalink = {}
let menu = {}

data.map((page) => {
  pages[page.machineName] = page.rawContent
  pagesMachineNameByRelativePermalink[page.relativePermalink] = page.machineName
  if(page.section.machineName == 'index'){
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

let getPageByRelativeUrl = function(relativePermalink){
  // Ensure leading slash
  relativePermalink = relativePermalink[0] === '/' ? relativePermalink : '/' + relativePermalink
  // Ensure trailing slash
  relativePermalink = relativePermalink[-1] === '/' ? relativePermalink : relativePermalink + '/'
  return pagesMachineNameByRelativePermalink[relativePermalink]

}
export {pages}
export {getPageByRelativeUrl}
export {menu}
