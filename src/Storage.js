import { AsyncStorage } from 'react-native'
import languages from './settings/Languages.js'
import _ from 'lodash'
import { DateTime } from 'luxon'
let defaultPageData = {
  en: require('../assets/index.en.json'),
  fr: require('../assets/index.fr.json')
};

export class Storage {
  constructor(){
    this.triggerUpdateMethods = []
    this.pageData = _.merge({}, languages, defaultPageData)
    this.settings = {
      language: 'en'
    }
    this.refreshSettings()
  }
  settings = {
    language: 'en'
  }
  refreshSettings(){
    AsyncStorage.getItem('settings').then(asyncStorageRes => {
      // Don't overwrite defaults with null if nothing exists in AsyncStorage!
      if(JSON.parse(asyncStorageRes)){
        this.settings = JSON.parse(asyncStorageRes)
      }
    }).then(() => {
        _.forEach(this.triggerUpdateMethods, (method) => {
          method(this)
        })
    })
  }
  loadData(){
    this.loadPageDataFromStorage(this.settings.language)
  }

  getLanguageDataUri(){
    return 'https://talkveganto.me/' + this.settings.language + '/index.json'
  }

  async refreshPageData(){
    return fetch(this.getLanguageDataUri(), {
      method: 'GET',
    }).then((response) => response.json()).then((responseJson) => {
      if(responseJson.data){
        this.pageData[this.settings.language] = responseJson
        this.pageData[this.settings.language].lastSyncDate = DateTime.local()
        return this.savePageDataToStorage()
      }
      return null
    }).catch(()=>{

      // TODO: Make this a real error
    })
  }

  loadPageDataFromStorage(language){
    return AsyncStorage.getItem('pageData').then(asyncStorageRes => {
      if(!asyncStorageRes){
        return this.savePageDataToStorage()
      }
      let storagePageData = JSON.parse(asyncStorageRes)
      let currentDataDate = DateTime.fromISO(this.pageData[language]['date'])
      let storageDataDate = 'date' in storagePageData[language] ? DateTime.fromISO(storagePageData[language]['date']) : null
      // Don't overwrite defaults with null if nothing exists in AsyncStorage!
      if(storagePageData && storagePageData[language] && storageDataDate > currentDataDate){
        this.pageData[language] = storagePageData
        return
      }
      return this.savePageDataToStorage()
    })
  }

  returnPageDataJson(){
    let jsonOutput = {}
    _.forEach(this.pageData,(language, shortCode) => {
      jsonOutput[shortCode] = {
        data: language['data'],
        date: language['date'],
        lastSyncDate: this.getLastPageDataSync().toISO()
      }
    })
    return JSON.stringify(jsonOutput)
  }

  async savePageDataToStorage(){
    return AsyncStorage.setItem('pageData', this.returnPageDataJson())
  }

  getLastPageDataSync(duration){
    // If never synced default to content generation date
    let lastSyncDate = this.pageData[this.settings.language].lastSyncDate ?
      this.pageData[this.settings.language].lastSyncDate :
      DateTime.fromISO(this.pageData[this.settings.language].date)
    if(duration==='auto'){
      let diff = DateTime.local().diff(lastSyncDate, ['years','months','days','hours', 'minutes'])
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
