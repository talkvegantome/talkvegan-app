import { primary, secondary, light, highlight, dark, headerFont, paragraphFont} from './commonStyling.js'
import React, {Component} from 'react';
import {StyleSheet, Text, Platform, Linking} from 'react-native';
import {getUniqueID} from 'react-native-markdown-renderer';
import {NavigationActions, StackActions} from 'react-navigation';
import {normaliseRelPath} from './pages.js'
export const markdownStyles =  StyleSheet.create({
  heading1: {
    textAlign:'left',
    fontSize: 25,
    fontWeight: 'bold',
    color: primary,
    fontFamily: headerFont,
    marginTop: 15,
    marginBottom: 10,
    lineHeight: 35,
  },
  heading2: {
    textAlign:'left',
    fontSize: 22,
    fontWeight: 'bold',
    color: primary,
    fontFamily: headerFont,
    marginVertical: 10,
  },
  heading3: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: primary,
    fontFamily: headerFont,
    marginVertical: 10,
  },
  paragraph: {
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    textAlign: 'justify'
  },
  text: {
    fontFamily: paragraphFont,
    fontSize: 18,
    textAlign: 'justify',
    lineHeight: 28,
  },
  listUnorderedItemIcon: {
    marginLeft: 10,
    marginRight: 10,
    lineHeight: Platform.OS === 'ios' ? 15 : 15
  },
  listOrderedItemIcon: {
    marginLeft: 10,
    marginRight: 10,
    lineHeight: Platform.OS === 'ios' ? 15 : 15
  },
});




export class markdownRules {
  constructor(navigation) {
    this.navigation = navigation
  }
  generateHeading(node, children, parent, styles){

     return (
       <Text key={getUniqueID()} style={styles[node.type]}>
          {children[0].props.children}
       </Text>
     )
 }
 openUrl(url){
     // If it's an internal link reformatted by preProcessMarkDown, navigate!
     if(url.match(/^REF:/)){
       let indexId = url.replace(/REF:/,'')
       this.navigation.navigate('Home', {indexId: normaliseRelPath(indexId)});
       return
     }
     Linking.openURL(url)
 }
 rules = {
    heading1: this.generateHeading,
    heading2: this.generateHeading,
    heading3: this.generateHeading,
    heading4: this.generateHeading,
    heading5: this.generateHeading,
    heading6: this.generateHeading,
    link: (node, children, parent, styles) => {
      return (
        <Text key={node.key} style={styles.link} onPress={() => this.openUrl(node.attributes.href)}>
          {children}
        </Text>
      );
    }
  }
  returnRules(){
    return this.rules
  }
}



export function preProcessMarkDown(markdown){
  let patterns = [
    {
      // Replace hugo cross reference links' inner {{<ref>}} syntax as it prevents them from being recognised by
      //   the markdown formatter
      find: /\[([^\]\]]+)\]\(\{\{\<\s*ref\s*"(.+)"\s*>\}\}\)/,
      replacement: function(match, p1, p2){
        return "["+p1+"](REF:"+p2+")"
      }
    }
  ]
  patterns.forEach((pattern) =>{
    markdown = markdown.replace(pattern.find, pattern.replacement)
  })
  return markdown
}
