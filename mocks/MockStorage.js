export class MockStorage{
  constructor(){
    this.triggerUpdateMethods = []
    this.settings = {
      language: 'en',
    }
    this.pageData = {
      en: {
        data: [{
          friendlyName: "Test Page",
          rawContent: "# Test Page",
          relativePermalink: "/en/test-parent/test-page/",
          weight: null,
          permalink: "https://talkveganto.me/en/test-parent/test-page/",
          section: {
            friendlyName: "Test Parent",
            relativePermalink: "/en/test-parent/",
            weight: 1000
          }
        }],
        date: "2019-05-12T16:07:45.281077+01:00"
      }
    }
  }

  getLastPageDataSync(){
    return '1 minute'
  }
}
