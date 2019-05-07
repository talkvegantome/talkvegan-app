import {data} from './index.json'
import {_} from 'lodash'
let pages = {}
let pagesMachineNameByRelativePermalink = {}
let menu = {}

data.map((page) => {
  pages[page.relativePermalink] = page.rawContent
  if(page.section.relativePermalink == '/'){
    return
  }
  if(!(page.section.relativePermalink in menu)){
    menu[page.section.relativePermalink] = page.section
    menu[page.section.relativePermalink].subItems = []
  }
  menu[page.section.relativePermalink].subItems.push(page)
})

export function normaliseRelPath(relpath){
  // Ensure trailing and leading slashes
  relpath = relpath[0] === '/' ? relpath : '/' + relpath;
  relpath = relpath[-1] === '/' ? relpath : relpath + '/';
  return relpath
}
export {pages}
export {menu}
