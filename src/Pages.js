import { AsyncStorage } from 'react-native'
import { DateTime } from 'luxon'
import _ from 'lodash';

let defaultPageData = {
  en: require('../assets/index.en.json'),
  fr: require('../assets/index.fr.json')
};

import languages from './settings/Languages.js'

class Pages {
  constructor(settings){
    this.settings = settings
    this.pageData = _.merge({}, languages, defaultPageData)
    this.loadData()
    this.generateMaps()
  }

  loadData(){
    this.loadPageDataFromStorage(this.settings.language)
  }

  getLanguageDataUri(){
    return 'https://talkveganto.me/' + this.settings.language + '/index.json'
  }

  async refreshData(){
    return fetch(this.getLanguageDataUri(), {
      method: 'GET',
    }).then((response) => response.json()).then((responseJson) => {
      if(responseJson.data){
        this.pageData[this.settings.language] = responseJson
        this.pageData[this.settings.language].lastSyncDate = DateTime.local()
        this.generateMaps()
        this.savePageDataToStorage()
        return responseJson.data
      }
      return null
    }).catch((error)=>{
      console.error(error)
    })
  }

  loadPageDataFromStorage(language){
    AsyncStorage.getItem('pageData').then(asyncStorageRes => {
      if(!asyncStorageRes){
        this.savePageDataToStorage()
        return
      }
      pageData = JSON.parse(asyncStorageRes)
      currentDataDate = DateTime.fromISO(this.pageData[language]['date'])
      storageDataDate = 'date' in pageData ? DateTime.fromISO(pageData['date']) : null
      // Don't overwrite defaults with null if nothing exists in AsyncStorage!
      if(pageData && pageData[language] && storageDataDate > currentDataDate){
        this.pageData[language] = JSON.parse(asyncStorageRes)
        return
      }
      this.savePageDataToStorage()
    })
  }

  returnJSON(){
    let jsonOutput = {}
    _.forEach(this.pageData,(language, shortCode) => {
      jsonOutput[shortCode] = {
        data: language['data'],
        date: language['date']
      }
    })
    return JSON.stringify(jsonOutput)
  }

  savePageDataToStorage(pageData){
      AsyncStorage.setItem('x', this.returnJSON())
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
  getLastSync(duration){
    // If never synced default to content generation date
    let lastSyncDate = this.pageData[this.settings.language].lastSyncDate ?
      this.pageData[this.settings.language].lastSyncDate :
      DateTime.fromISO(this.pageData[this.settings.language].date)
    if(duration==='hours'){
      return Math.floor(DateTime.local().diff(lastSyncDate, 'hours').hours) + ' hours ago'
    }
    return lastSyncDate
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
