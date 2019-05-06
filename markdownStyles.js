import { primary, secondary, light, highlight, dark, headerFont, paragraphFont} from './commonStyling.js'
import React, {Component} from 'react';
import {StyleSheet, Text, Platform} from 'react-native';
import {getUniqueID} from 'react-native-markdown-renderer';


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

function generateHeading(node, children, parent, styles){

  return (
    <Text key={getUniqueID()} style={styles[node.type]}>
       {children[0].props.children}
    </Text>
  )
}

export const markdownRules = {
  heading1: generateHeading,
  heading2: generateHeading,
  heading3: generateHeading,
  heading4: generateHeading,
  heading5: generateHeading,
  heading6: generateHeading,
}
