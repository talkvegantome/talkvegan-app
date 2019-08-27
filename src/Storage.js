import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash'
import Pages from './Pages.js'

export class Storage {
  constructor() {
    //AsyncStorage.clear()
    this.onRefreshListeners = []
    this.refreshFromStorage().then(() => {
      // If it's been over a day since we loaded new data, load on start
      let pagesObj = new Pages(this)
      let daysSinceLastSync = pagesObj.getLastPageDataSync().diffNow('days').days * -1
      if (daysSinceLastSync > 1) {
        pagesObj.pullPageDataFromSite()
      }
    })
  }

  favourites = {}
  pageData = {
    en: require('../assets/index.en.json'),
  }
  settings = {
    language: 'en',
    analyticsPromptAnswered: false,
    analyticsEnabled: false,
    loading: true,
  }
  config = {
    apiUrl: "https://talkveganto.me/",
    gitHubUrl: "https://github.com/talkvegantome/talkvegan-hugo/",
    privacyPolicyUrl: 'https://talkveganto.me/en/privacy-policy',
    helpDeskUrl: 'https://talkvegantome.freshdesk.com/support/tickets/new',
    twitterUrl: 'https://twitter.com/TalkVeganApp'
  }

  refreshFromStorage(keysToRefresh = ['pageData', 'settings', 'favourites']) {
    let promises = []
    this.loading = true
    _.forEach(keysToRefresh, (propertyName) => {
      let promise = AsyncStorage.getItem(propertyName).then(asyncStorageRes => {
        // Don't overwrite defaults with null if nothing exists in AsyncStorage!
        if (JSON.parse(asyncStorageRes)) {
          this[propertyName] = JSON.parse(asyncStorageRes)
          return
        }
      })
      promises.push(promise)
    })
    return Promise.all(promises).then(() => {
      this.loading = false
      _.forEach(this.onRefreshListeners, (methodObj) => {
        // If the listener cares about the keys we refreshed, call it!
        if(_.intersectionWith(methodObj['listenForKeys'], keysToRefresh).length > 0){
          methodObj['method'](this)
        }
      })
    })
  }

  updateSetting(settingName, value) {
    this.settings[settingName] = value
    return AsyncStorage.setItem('settings', JSON.stringify(this.settings)).then(() => {
      this.refreshFromStorage()
    });
  }

  addOnRefreshListener(method,listenForKeys=['settings', 'pageData']){
    this.onRefreshListeners.push({
      method: method,
      listenForKeys: listenForKeys
    })
  }
  toggleFavourite(props) {
    if(this.isFavourite(props)){ 
      this.favourites[this.settings.language] = _.filter(
        this.getFavourites(), (o) => {
          return !(o.indexId === props.indexId && o.pageKey === props.pageKey)
        })
    }else{
      this.favourites[this.settings.language].push({
        pageKey: props.pageKey,
        indexId: props.indexId,
        displayName: props.displayName
      })
    }
    return AsyncStorage.setItem('favourites', JSON.stringify(this.favourites)).then(() => {
      this.refreshFromStorage(['favourites'])
    });
  }
  getFavourites(){
    this._initialiseLanguage('favourites', [])
    return this.favourites[this.settings.language]
  }
  isFavourite(props){
    return _.filter(this.getFavourites(), {
      indexId: props.indexId,
      pageKey: props.pageKey
    }).length > 0
  }
  _initialiseLanguage(key, value){
    if(_.isNil(this[key])){
      this[key] = {}
    }
    if(_.isNil(this[key][this.settings.language])){
      this[key][this.settings.language] = value
    }
  }
}
