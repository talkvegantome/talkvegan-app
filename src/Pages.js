import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import stringify from 'fast-stringify';
import { DateTime } from 'luxon';
import RemoveMarkdown from 'remove-markdown';

class Pages {
  constructor(storage) {
    this.storage = storage;
    this.settings = storage.settings;
    this.pageData = storage.pageData;
    this.generateMaps();
  }

  getPageData() {
    // if the language's data hasn't loaded yet return a default
    if (!('data' in this.pageData[this.settings.language])) {
      this.storage.analytics.logEvent('error', {
        errorDetail: 'Failed to load page in language' + this.settings.language,
      });
      this.pullPageDataFromSite();
      return [
        {
          friendlyName: 'Home',
          rawContent:
            'Sorry the page data for ' +
            this.settings.language +
            " hasn't loaded yet.",
          relativePermalink: normaliseRelPath(
            this.settings.language + '/splash'
          ),
          section: {
            friendlyName: 'TalkVeganToMe',
            relativePermalink: normaliseRelPath(this.settings.language),
          },
        },
      ];
    }
    return this.pageData[this.settings.language].data;
  }

  generateMaps() {
    _.forEach(this.pageData, (language) => {
      language.pages = {};
      language.menu = {};
      _.forEach(language['data'], (page) => {
        if (!_.isNil(page.displayInApp) && !page.displayInApp) {
          // Don't display this page if it has displayInApp=false
          return;
        }
        language.pages[page.relativePermalink] = page.rawContent;

        // If it's a top level page (e.g. splash, we don't want it appearing on the menu)
        if (page.section.relativePermalink.match(/^\/[^\/]+\/$/)) {
          return;
        }

        if (!(page.section.relativePermalink in language.menu)) {
          // clone page.section as a base for the menu
          language.menu[page.section.relativePermalink] = Object.assign(
            {},
            page.section
          );
          language.menu[page.section.relativePermalink].subItems = [];
        }
        language.menu[page.section.relativePermalink].subItems.push(page);
      });
    });
  }

  getMenu() {
    return this.pageData[this.settings.language].menu;
  }
  getPages() {
    if (!this.pages) {
      this.pages = _.pickBy(
        this.pageData[this.settings.language].pages,
        (o, i) => {
          o = this.getPageMetadata(i);
          let isTopLevel = o.relativePermalink.match(/^\/[^\/]*\/[^\/]*\/$/);
          return !isTopLevel && (_.isNil(o.displayInApp) || o.displayInApp);
        }
      );
    }
    return this.pages;
  }
  getPageTitles() {
    let pageTitles = {};
    _.forEach(this.getPages(), (content, index) => {
      pageTitles[index] = this.getPageTitle(index);
    });
    return pageTitles;
  }
  getSplashPath() {
    return '/' + this.settings.language + '/splash/';
  }
  getPageMetadata(relPath) {
    let pageMetadata = null;
    this.getPageData().forEach((page) => {
      if (page.relativePermalink === relPath) {
        pageMetadata = page;
      }
    });
    return pageMetadata;
  }
  getFriendlyName(relPath) {
    let friendlyName = null;
    this.getPageData().forEach((page) => {
      if (page.relativePermalink === relPath) {
        friendlyName = page.friendlyName;
      }
    });
    return friendlyName;
  }
  getPageTitle(pageIndex) {
    let pageMetadata = this.getPageMetadata(pageIndex);
    let pageTitle = pageMetadata
      ? pageMetadata['friendlyName']
      : 'TalkVeganToMe';
    // Exclude top level pages (e.g. /en/ or 'splash' pages) from having their friendlyName as header
    if (
      pageMetadata &&
      pageMetadata['section']['relativePermalink'].match(/^\/[^\/]+\/$/)
    ) {
      return 'TalkVeganToMe';
    }
    return pageTitle;
  }
  getPageDescription(indexId) {
    let pageMetadata = this.getPageMetadata(indexId);
    return pageMetadata.description
      ? pageMetadata.description
      : RemoveMarkdown(pageMetadata.rawContent).replace(/\n/g, ' ');
  }
  getLanguageUri() {
    return this.storage.config.apiUrl + this.settings.language;
  }
  getLanguageDataUri() {
    return this.getLanguage() + '/index.json';
  }
  getNotificationsUri() {
    return (
      this.storage.config.apiUrl +
      this.settings.language +
      '/notifications.json'
    );
  }
  getPagePermalink(pageIndex) {
    return this.pageExists(pageIndex)
      ? this.getPageMetadata(pageIndex).permalink
      : false;
  }
  getPageGitHubLink(pageIndex) {
    if (!this.pageExists(pageIndex)) {
      return false;
    }
    let pageMetadata = this.getPageMetadata(pageIndex);
    let languageName = this.storage.pageData[this.settings.language]
      .languageName;
    let gitHubPath = pageMetadata.relativePermalink;

    // Replace the language shortcode with the full name
    gitHubPath = gitHubPath.replace(
      /^\/[^\/]+\//,
      '/' + languageName.toLowerCase() + '/'
    );
    // Replace the trailing slash with .md
    gitHubPath = gitHubPath.replace(/\/$/, '.md');
    return this.storage.config.gitHubUrl + 'blob/master/content' + gitHubPath;
  }
  pageExists(pageIndex) {
    return Boolean(this.getPages()[pageIndex]);
  }
  getPageContent(pageIndex) {
    let pages = this.getPages();
    if (!this.pageExists(pageIndex)) {
      let errorMessage =
        'Error loading ' +
        pageIndex +
        '. Try refreshing data from the Settings page.';
      this.storage.analytics.logEvent('error', { errorDetail: errorMessage });
      return errorMessage;
    }
    return pages[pageIndex];
  }

  async pullPageDataFromSite() {
    this.storage.analytics.logEvent('pullPageDataFromSite', {
      language: this.settings.language,
    });
    return fetch(this.getLanguageDataUri(), {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.data) {
          responseJson.lastSyncDate = DateTime.local();
          return this.mergePageDataToStorage(
            this.settings.language,
            responseJson
          );
        }
        throw 'Failed';
      })
      .catch(() => {
        this.storage.analytics.logEvent('error', {
          errorDetail:
            'Failed to fetch page in language' + this.settings.language,
        });
      });
  }
  getPagesInCategory(categoryItem) {
    return _.filter(
      _.sortBy(categoryItem.subItems, ['weight', 'friendlyName']).map(
        (item) => {
          if (!_.isNil(item.displayInApp) && !item.displayInApp) {
            // Don't display this page if it has displayInApp=false
            return;
          }
          return item;
        }
      ),
      function(o) {
        return !_.isNil(o);
      }
    );
  }
  getPageOffsetInCategory(pageIndex, offset) {
    if (!this.pageExists(pageIndex)) {
      return false;
    }
    // Get the page's parent menu item
    const categoryIndexId = this.getPageMetadata(pageIndex).section
      .relativePermalink;
    const categoryItem = this.getMenu()[categoryIndexId];
    const pagesInCategory = this.getPagesInCategory(categoryItem);
    const curItemIndex = _.findIndex(pagesInCategory, {
      relativePermalink: pageIndex,
    });
    let indexToReturn = curItemIndex + offset;

    // Wrap around the array by returning elements from the end/beginning if the index is smaller/larger than the array
    if (indexToReturn > pagesInCategory.length - 1) {
      indexToReturn = indexToReturn - pagesInCategory.length;
    }
    if (indexToReturn < 0) {
      indexToReturn = pagesInCategory.length + indexToReturn;
    }
    return pagesInCategory[indexToReturn];
  }

  async mergePageDataToStorage(language, pageData) {
    this.pageData[language] = pageData;
    // Update pageData with the latest list of languages (We don't have or need the content yet)
    _.map(pageData.languages, (language) => {
      this.pageData[language.languageShortCode] = _.merge(
        this.pageData[language.languageShortCode],
        language
      );
    });
    return AsyncStorage.setItem('pageData', stringify(this.pageData)).then(
      () => {
        this.storage.refreshFromStorage();
      }
    );
  }

  getLastPageDataSync(duration) {
    // If never synced default to epoch start
    let lastSyncDate = this.pageData[this.settings.language].lastSyncDate
      ? DateTime.fromISO(this.pageData[this.settings.language].lastSyncDate)
      : DateTime.fromISO('1970-01-01');
    if (duration === 'auto') {
      let diff = DateTime.local().diff(lastSyncDate, [
        'years',
        'months',
        'days',
        'hours',
        'minutes',
      ]);
      if (isNaN(diff.minutes)) {
        return 'Never';
      }
      if (diff.years > 1) {
        return Math.round(diff.years) + ' years';
      }
      if (diff.months > 1) {
        return Math.round(diff.months) + ' months';
      }
      if (diff.days > 1) {
        return Math.round(diff.days) + ' days';
      }
      if (diff.hours > 1) {
        return Math.round(diff.hours) + ' hrs';
      }
      return Math.round(diff.minutes) + ' mins';
    }
    return lastSyncDate;
  }

  getContributors(relPath) {
    let metadata = this.getPageMetadata(relPath);
    let contributors = this.pageData[this.settings.language].contributors;
    return _.map(metadata.contributors, (contributorObj) => {
      let contributor = contributors[contributorObj.name];
      contributor.role = contributorObj.role;
      contributor.imageUrl = this.storage.config.apiUrl + contributor.image;
      return contributor;
    });
  }
}

export function normaliseRelPath(relpath) {
  // clear any .md at the end
  relpath = relpath.replace(/.md$/, '');
  // Ensure trailing and leading slashes
  relpath = _.first(relpath) === '/' ? relpath : '/' + relpath;
  relpath = _.last(relpath) === '/' ? relpath : relpath + '/';
  return relpath;
}
export default Pages;
