import { AsyncStorage } from 'react-native'
import languages from './settings/Languages.js'
import _ from 'lodash'
import Pages from './Pages.js'

export class Storage {
  constructor(){
    this.triggerUpdateMethods = []
    this.refreshFromStorage().then(() => {
      // If it's been over a day since we loaded new data, load on start
      let pagesObj = new Pages(this)
      let daysSinceLastSync = 99
      daysSinceLastSync = pagesObj.getLastPageDataSync().diffNow('days').days * -1
      if(daysSinceLastSync > 1){
        pagesObj.pullPageDataFromSite()
      }
    })
  }


  pageData = _.merge({}, languages, {
    en: require('../assets/index.en.json'),
  })
  settings = {
    helpDeskUrl: 'https://talkvegantome.freshdesk.com/support/tickets/new',
    language: 'en'
  }

  refreshFromStorage(){
    let promises = []

    _.forEach(['pageData', 'settings'], (propertyName) => {
      let promise = AsyncStorage.getItem(propertyName).then(asyncStorageRes => {
        // Don't overwrite defaults with null if nothing exists in AsyncStorage!
        if(JSON.parse(asyncStorageRes)){
          this[propertyName] = JSON.parse(asyncStorageRes)
          return
        }

      })
      promises.push(promise)
    })
    return Promise.all(promises).then(() => {
        _.forEach(this.triggerUpdateMethods, (method) => {
          method(this)
        })
    })
  }

  updateSetting(settingName, value){
    this.settings[settingName] = value
    return AsyncStorage.setItem('settings', JSON.stringify(this.settings)).then(() =>{
      this.refreshFromStorage()
    });

  }
}
