import React from 'react';
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
        console.log('Saving response for ' + this.settings.language + ' to this.pageData')
        this.pageData[this.settings.language] = responseJson
        this.pageData[this.settings.language].lastSyncDate = DateTime.local()
        return this.savePageDataToStorage()
      }
      return null
    }).catch((error)=>{
      console.error(error)
    })
  }

  loadPageDataFromStorage(language){
    return AsyncStorage.getItem('pageData').then(asyncStorageRes => {
      if(!asyncStorageRes){
        console.log('no storage')
        return this.savePageDataToStorage()
      }
      storagePageData = JSON.parse(asyncStorageRes)
      currentDataDate = DateTime.fromISO(this.pageData[language]['date'])
      console.log('Got from storage: dataDate: ' + storagePageData['en']['lastSyncDate'])
      storageDataDate = 'date' in storagePageData[language] ? DateTime.fromISO(storagePageData[language]['date']) : null
      console.log('Storage dataDate: ' + storageDataDate.toISO())
      // Don't overwrite defaults with null if nothing exists in AsyncStorage!
      if(storagePageData && storagePageData[language] && storageDataDate > currentDataDate){
        console.log('Storage is newer than current class data')
        this.pageData[language] = storagePageData
        return
      }
      //console.log(currentDataDate.toISO() + ' - ' + storageDataDate.toISO())
      console.log('current class data is newer than Storage')
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
    console.log('ReturningJson: lastSyncDate for en: ' + jsonOutput['en']['lastSyncDate'] )
    return JSON.stringify(jsonOutput)
  }

  async savePageDataToStorage(){
    let debug = JSON.parse(this.returnPageDataJson())
    console.log('Saving to storage: DataDate: ' +debug['en']['date'])
    console.log('Saving to storage: SyncDate: ' + debug['en']['lastSyncDate'])

    return AsyncStorage.setItem('pageData', this.returnPageDataJson()).catch((err) => {console.error(err)})
    .then((response) => {console.log('Saved!' + response)})
  }

  getLastPageDataSync(duration){
    // If never synced default to content generation date
    console.log('getLastSync')
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
        return math.round(diff.days) + ' days'
      }
      if(diff.hours > 1){
        return Math.round(diff.hours) + ' hours'
      }
      return Math.round(diff.minutes) + ' minutes'
    }
    return lastSyncDate
  }
}
