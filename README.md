# TalkVeganToMe App [![Build Status](https://travis-ci.org/talkvegantome/talkvegan-app.svg?branch=master)](https://travis-ci.org/talkvegantome/talkvegan-app)

**Website:** [TalkVeganTo.Me](https://talkveganto.me)  
**Website Repo:** [TalkVegan-Hugo](https://github.com/talkvegantome/talkvegan-hugo)

## Introduction

The app is written in [React Native](https://facebook.github.io/react-native/) which means it can be built to run on both iOS and Android with little to no effort from a development perspective.

The app relies on cached json files containing the content under `./assets/` but has the ability to update these from the settings page using `fetch()` to `https://talkveganto.me/<lang>/index.json`.

These json files contain the content that app displays rendered in MarkDown, which is then rendered on navigation to the `Home` screen depending on which page was requested.

## Testing

```
npm run ios
npm run android
```

### Testing pre-reqs

You must have the necessary virtual machines setup for iOS and Android

## Refreshing index jsons from website

As the content in the website evolves, the default cached data in assets will grow ever more out of date.  

In order to update the cache run the following commands:

```
rm assets/index.en.json* && wget -O assets/index.en.json http://talkveganto.me/en/index.json
rm assets/index.fr.json* && wget -O assets/index.fr.json http://talkveganto.me/fr/index.json
```

Now that the app reloads the latest content on launch this matters less and less.

## Building production iOS to test outside expo

```
npm run ios --variant=release
npm run android --variant=release
```

This will install the app within the simulator so you can test it actually works prior to pushing to appstoreconnect

## Building Production to upload to Android Playstore
1. Export the following environment variables
```
export ANDROID_KEYSTORE_FILE=
export ANDROID_KEYSTORE_PASSWORD=
export ANDROID_KEYSTORE_KEY_ALIAS=
export ANDROID_KEYSTORE_KEY_PASSWORD=
```
2. Update version details in `android/fastlane/Fastfile`
3. `cd android`
4. `fastlane beta`

## react native upgrade guide
upgrade gradle, gradle plugin, upgrade android studio...
check `build.gradle` in https://react-native-community.github.io/upgrade-helper/?from=0.60.0&to=0.60.5 against your version

## Manual linking  
https://facebook.github.io/react-native/docs/linking-libraries-ios.html#manual-linking  
Automatic linking and cocoapods seem a bit... flakey