import React from 'react';
import { AsyncStorage } from 'react-native'
import _ from 'lodash'
export class Settings {
  constructor(){
    this.settings = {
      language: 'en'
    }
    this.triggerUpdateMethods = []
    this.refreshSettings()
  }

  refreshSettings(){
    AsyncStorage.getItem('settings').then(asyncStorageRes => {
      this.settings =  JSON.parse(asyncStorageRes)
    }).then(() => {
        _.forEach(this.triggerUpdateMethods, (method) => {
          method(this.settings)
        })
    })
  }
}
