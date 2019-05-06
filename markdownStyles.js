import { primary, secondary, light, highlight, dark, headerFont, paragraphFont} from './commonStyling.js'
import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {getUniqueID} from 'react-native-markdown-renderer';


export const markdownStyles =  StyleSheet.create({
  heading1: {
    textAlign:'left',
    fontSize: 250,
    fontWeight: 'bold',
    color: primary,
    fontFamily: headerFont,
    marginVertical: 10,
    lineHeight: 35,
  },
  heading2: {
    textAlign:'left',
    fontSize: 220,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlign: 'center'
  },
  text: {
    fontFamily: paragraphFont,
    fontSize: 18,
    textAlign: 'justify',
    lineHeight: 28,
  },
  listItemText: {
    textAlign: 'left'
  },
  listItem: {
    flexDirection: 'row',
  }
});

function generateHeading(node, children, parent, styles){

  return (
    <Text key={getUniqueID()} style={styles[node.type]}>
      {children}
    </Text>
  )
}

export const markdownRules = {
  heading1: generateHeading,
}
