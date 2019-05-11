import _ from 'lodash';
import {data as english} from '../assets/index.en.json'
import {data as french} from '../assets/index.fr.json'
import languages from './settings/Languages.js'

class Pages {
  constructor(settings){
    this.settings = settings
    this.languages = languages
    this.languages['en']['data'] = english
    this.languages['fr']['data'] = french

    this.generateMaps()
  }
  settings = {'language': 'en'}
  setDefaults(asyncStorageRes){
    let settings = asyncStorageRes ? JSON.parse(asyncStorageRes) : {language: 'en'}
    this.settings = settings
  }

  generateMaps(){
    _.forEach(this.languages, (language, short) => {
      language.pages = {}
      language.menu = {}
      language.data.map((page) => {
        page.friendlyName = page.friendlyName
        language.pages[page.relativePermalink] = page.rawContent
        if(page.section.relativePermalink.match(/^\/[^\/]+\/$/)){
          return
        }
        if(!(page.section.relativePermalink in language.menu)){
          language.menu[page.section.relativePermalink] = page.section
          language.menu[page.section.relativePermalink].subItems = []
        }
        language.menu[page.section.relativePermalink].subItems.push(page)
      })
    })
  }
  getMenu(){
    return this.languages[this.settings.language].menu
  }
  getPages(){
    return this.languages[this.settings.language].pages
  }
  getSplashPath(){
    return '/'+this.settings.language+'/splash/'
  }
  getPageMetadata(relPath){
    let pageMetadata = null
    this.languages[this.settings.language].data.forEach((page) => {

     if(page.relativePermalink === relPath){
       pageMetadata = page
     }
    })
    return pageMetadata
  }
  getFriendlyName(relPath){
    let friendlyName = null
     this.languages[this.settings.language].data.forEach((page) => {

      if(page.relativePermalink === relPath){
        friendlyName = page.friendlyName
      }
    })
    return friendlyName
  }

}


export function normaliseRelPath(relpath){
  // Ensure trailing and leading slashes
  relpath = relpath[0] === '/' ? relpath : '/' + relpath;
  relpath = relpath[-1] === '/' ? relpath : relpath + '/';
  return relpath
}
export default Pages
