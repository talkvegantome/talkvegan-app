import React from 'react';
import { AsyncStorage } from 'react-native'
import _ from 'lodash'
export class Settings {
  constructor(){
    this.triggerUpdateMethods = []
    this.refreshSettings()
    this.settings = {
      language: 'en'
    }
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
          method(this.settings)
        })
    })
  }
}
