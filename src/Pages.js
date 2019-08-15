import { AsyncStorage } from 'react-native'
import _ from 'lodash';
import stringify from 'fast-stringify'
import {DateTime} from 'luxon';

import Analytics from './analytics'

class Pages {
  constructor(storage){
    this.analytics = new Analytics(storage.settings)
    this.storage = storage
    this.settings = storage.settings
    this.pageData = storage.pageData
    this.setDefault()
    this.generateMaps()
  }

  setDefault(){
    // if the language's data hasn't loaded yet return a default
    if(!('data' in this.pageData[this.settings.language])){
      this.pageData[this.settings.language].data = [
        {
          friendlyName: 'Home',
          rawContent: 'Sorry the page data for ' + this.settings.language + " hasn\'t loaded yet.",
          relativePermalink: normaliseRelPath(this.settings.language + '/splash'),
          section: {
            friendlyName: 'TalkVeganToMe',
            relativePermalink: normaliseRelPath(this.settings.language)
          }
        }
      ]
      this.analytics.logEvent('error',
        {errorDetail: "Failed to load page in language" + this.settings.language})
      this.pullPageDataFromSite()
    }
  }

  generateMaps(){
    _.forEach(this.pageData, (language) => {
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
  getPageTitles(){
    pageTitles = {}
    _.forEach(this.getPages(), (content, index) => {
      pageTitles[index] = this.getPageTitle(index)
    })
    return pageTitles
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
  getPageTitle(indexId) {
    let pageMetadata = this.getPageMetadata(indexId)
    let pageTitle = pageMetadata ? pageMetadata['friendlyName'] : 'TalkVeganToMe'
    return pageTitle
  }

  getLanguageDataUri(){
    return this.storage.config.apiUrl + this.settings.language + '/index.json'
  }

  async pullPageDataFromSite(){
    this.analytics.logEvent('pullPageDataFromSite',
      {language: this.settings.language})
    return fetch(this.getLanguageDataUri(), {
      method: 'GET',
    }).then((response) => response.json()).then((responseJson) => {

      if(responseJson.data){
        responseJson.lastSyncDate = DateTime.local()
        return this.mergePageDataToStorage(this.settings.language, responseJson)
      }
      throw 'Failed'
    }).catch(()=>{
      // Amplitude.logEventWithProperties('error',
      //   {errorDetail: "Failed to fetch page in language" + this.settings.language})
    })
  }

  async mergePageDataToStorage(language, pageData){
    this.pageData[language] = pageData
    // Update pageData with the latest list of languages (We don't have or need the content yet)
    _.map(pageData.languages, (language) => {
      this.pageData[language.languageShortCode] = _.merge(
        this.pageData[language.languageShortCode],
        language
      )
    })
    return AsyncStorage.setItem('pageData', stringify(this.pageData)).then(()=>{
      this.storage.refreshFromStorage(['pageData'])
    })
  }

  getLastPageDataSync(duration){
    // If never synced default to content generation date
    let lastSyncDate = this.pageData[this.settings.language].lastSyncDate ?
      DateTime.fromISO(this.pageData[this.settings.language].lastSyncDate) :
      DateTime.fromISO(this.pageData[this.settings.language].date)
    if(duration==='auto'){
      let diff = DateTime.local().diff(lastSyncDate, ['years','months','days','hours', 'minutes'])
      if(isNaN(diff.minutes)){
        return 'Never'
      }
      if(diff.years > 1){
        return Math.round(diff.years) + ' years'
      }
      if(diff.months > 1){
        return Math.round(diff.months) + ' months'
      }
      if(diff.days > 1){
        return Math.round(diff.days) + ' days'
      }
      if(diff.hours > 1){
        return Math.round(diff.hours) + ' hours'
      }
      return Math.round(diff.minutes) + ' minutes'
    }
    return lastSyncDate
  }
}


export function normaliseRelPath(relpath){
  // clear any .md at the end
  relpath = relpath.replace(/.md$/,'')
  // Ensure trailing and leading slashes
  relpath = _.first(relpath) === '/' ? relpath : '/' + relpath;
  relpath = _.last(relpath) === '/' ? relpath : relpath + '/';
  return relpath
}
export default Pages
