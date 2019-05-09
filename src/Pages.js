import React from 'react';
import {AsyncStorage } from 'react-native';
import _ from 'lodash';
import {data as english} from '../assets/index.en.json'
import {data as french} from '../assets/index.fr.json'


class Pages {
  constructor(settings){
    this.settings = settings
    this.generateMaps()
  }
  setDefaults(asyncStorageRes){
    let settings = asyncStorageRes ? JSON.parse(asyncStorageRes) : {language: 'fr'}
    this.settings = settings
  }

  languages = {
    en: {
      name: 'English',
      data: english,
      pages: {},
      menu: {}
    },
    fr: {
      name: 'French',
      data: french,
      pages: {},
      menu: {}
    }
  }
  generateMaps(){
    _.forEach(this.languages, (language, short) => {
      language.pages = {}
      language.maps = {}
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
}


export function normaliseRelPath(relpath){
  // Ensure trailing and leading slashes
  relpath = relpath[0] === '/' ? relpath : '/' + relpath;
  relpath = relpath[-1] === '/' ? relpath : relpath + '/';
  return relpath
}
export default Pages
