import React from 'react';
import { Text, Linking, View} from 'react-native';
import _ from 'lodash';
import {getUniqueID} from 'react-native-markdown-renderer';
import {normaliseRelPath} from './Pages.js'

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
 styleChildren(child, style){
   let grandChildren = []
   if(_.isNil(child)){
     return child
   }
   if('props' in child && 'children' in child.props){
     if(typeof(child.props.children) != 'object'){
       grandChildren = child.props.children
     }else{
       grandChildren = _.map(child.props.children, (grandChild) => {
         return this.styleChildren(grandChild, style)
       })
     }
   }
   return React.cloneElement(child, {
     style: style,
     children: grandChildren
   })
 }
 rules = {
    heading1: this.generateHeading,
    heading2: this.generateHeading,
    heading3: this.generateHeading,
    heading4: this.generateHeading,
    heading5: this.generateHeading,
    heading6: this.generateHeading,
    blockquote: (node, children, parent, styles) => {

      return (
         <View key={node.key} style={styles.blockquote}>
           {_.map(children, (child, index) => this.styleChildren(child, styles.blockquoteText))}
         </View>
       )
    },
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

export function preProcessMarkDown(markdown, settings){
  let patterns = [
    {
      // Replace hugo cross reference links' inner {{<ref>}} syntax as it prevents them from being recognised by
      //   the markdown formatter
      find: /\[([^\]\]]+)\]\([\s\{<]{3,}\s*ref\s*"([^"]+)"[\}>\s]{3,}\)/g,
      replacement: function(match, p1, p2){
        let relPath = '/' + settings.language + normaliseRelPath(p2)
        return "["+p1+"](REF:"+relPath+")"
      }
    }
  ]
  patterns.forEach((pattern) =>{
    markdown = markdown.replace(pattern.find, pattern.replacement)
  })
  return markdown
}
