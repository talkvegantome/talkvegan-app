import { AsyncStorage } from 'react-native'

import _ from 'lodash';

class Pages {
  constructor(storage){
    this.settings = storage.settings
    this.pageData = storage.pageData
    this.generateMaps()
  }

  generateMaps(){
    _.forEach(this.pageData, (language, short) => {
      language.pages = {}
      language.menu = {}
      _.forEach(language['data'], (page) => {
        language.pages[page.relativePermalink] = page.rawContent

        // If it's a top level page (e.g. splash, we don't want it appearing on the menu)
        if(page.section.relativePermalink.match(/^\/[^\/]+\/$/)){
          return
        }

        if(!(page.section.relativePermalink in language.menu)){
          // clone page.section as a base for the menu
          language.menu[page.section.relativePermalink] = Object.assign({}, page.section)
          language.menu[page.section.relativePermalink].subItems = []
        }
        language.menu[page.section.relativePermalink].subItems.push(page)
      })
    })
  }

  getMenu(){
    return this.pageData[this.settings.language].menu
  }
  getPages(){
    return this.pageData[this.settings.language].pages
  }
  getSplashPath(){
    return '/'+this.settings.language+'/splash/'
  }
  getPageMetadata(relPath){
    let pageMetadata = null
    this.pageData[this.settings.language].data.forEach((page) => {

     if(page.relativePermalink === relPath){
       pageMetadata = page
     }
    })
    return pageMetadata
  }
  getFriendlyName(relPath){
    let friendlyName = null
     this.pageData[this.settings.language].data.forEach((page) => {

      if(page.relativePermalink === relPath){
        friendlyName = page.friendlyName
      }
    })
    return friendlyName
  }

}


export function normaliseRelPath(relpath){
  // Ensure trailing and leading slashes
  relpath = _.first(relpath) === '/' ? relpath : '/' + relpath;
  relpath = _.last(relpath) === '/' ? relpath : relpath + '/';
  return relpath
}
export default Pages
