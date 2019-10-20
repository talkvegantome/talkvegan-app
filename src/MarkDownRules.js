import React from 'react';
import { Text, Linking, View } from 'react-native';
import _ from 'lodash';
import { getUniqueID, hasParents } from 'react-native-markdown-renderer';

import { normaliseRelPath } from './Pages.js';

export class markdownRules {
  constructor(props) {
    this.props = props;
  }
  generateHeading(node, children, parent, styles) {
    return (
      <Text key={getUniqueID()} style={styles[node.type]}>
        {children[0].props.children}
      </Text>
    );
  }
  openUrl(url) {
    this.props.storage.analytics.logEvent('openUrl', { url: url });
    // If it's an internal link reformatted by preProcessMarkDown, navigate!
    if (url.match(/^REF:/)) {
      let indexId = url.replace(/REF:/, '');
      this.props.navigation.navigate(
        'home',
        { indexId: normaliseRelPath(indexId) },
        'markdownLink'
      );
      return;
    }
    Linking.openURL(url).catch((err) => {
      this.props.storage.analytics.logEvent('error', { errorDetail: err });
    });
  }
  styleChildren(child, style) {
    let grandChildren = [];
    let childStyle = {};
    if (_.isNil(child) || !_.isObject(child)) {
      return child;
    }
    if ('props' in child && 'children' in child.props) {
      if (typeof child.props.children != 'object') {
        grandChildren = child.props.children;
      } else {
        grandChildren = _.map(child.props.children, (grandChild) => {
          return this.styleChildren(grandChild, style);
        });
      }
      if (child.props.style) {
        childStyle = child.props.style;
      }
    }

    return React.cloneElement(child, {
      key: getUniqueID(),
      style: { ...childStyle, ...style },
      children: grandChildren,
    });
  }
  rules = {
    heading1: this.generateHeading,
    heading2: this.generateHeading,
    heading3: this.generateHeading,
    heading4: this.generateHeading,
    heading5: this.generateHeading,
    heading6: this.generateHeading,
    textgroup: (node, children, parent, styles) => {
      return (
        <Text key={node.key} style={styles.text} selectable={true}>
          {children}
        </Text>
      );
    },
    blockquote: (node, children, parent, styles) => {
      return (
        <View key={node.key} style={styles.blockquote}>
          {_.map(children, (child) =>
            this.styleChildren(child, styles.blockquoteText)
          )}
        </View>
      );
    },
    link: (node, children, parent, styles) => {
      return (
        <Text
          key={node.key}
          style={styles.link}
          onPress={() => this.openUrl(node.attributes.href)}>
          {children}
        </Text>
      );
    },
    list_item: (node, children, parent, styles) => {
      if (hasParents(parent, 'bullet_list')) {
        let listUnorderedItemIconStyle = hasParents(parent, 'blockquote')
          ? styles.quotedListUnorderedItemIcon
          : styles.listUnorderedItemIcon;
        return (
          <View key={node.key} style={styles.listUnorderedItem}>
            <Text style={listUnorderedItemIconStyle}>{'\u00B7'}</Text>
            <View style={[styles.listItem]}>{children}</View>
          </View>
        );
      }

      if (hasParents(parent, 'ordered_list')) {
        let listOrderedItemIconStyle = hasParents(parent, 'blockquote')
          ? styles.quotedListOrderedItemIcon
          : styles.listOrderedItemIcon;
        return (
          <View key={node.key} style={styles.listOrderedItem}>
            <Text style={listOrderedItemIconStyle}>
              {node.index + 1}
              {node.markup}
            </Text>
            <View style={[styles.listItem]}>{children}</View>
          </View>
        );
      }

      return (
        <View key={node.key} style={[styles.listItem]}>
          {children}
        </View>
      );
    },
  };
  preProcessMarkDown(markdown) {
    let patterns = [
      {
        // Replace hugo cross reference links' inner {{<ref>}} syntax as it prevents them from being recognised by
        //   the markdown formatter
        find: /\[([^\]\]]+)\]\([\s\{<]{2,}\s*ref[:]*\s*"([^"]+)"[\}>\s]{2,}\)/g,
        replacement: (match, p1, p2) => {
          let relPath =
            '/' + this.props.storage.settings.language + normaliseRelPath(p2);
          return '[' + p1 + '](REF:' + relPath + ')';
        },
      },
    ];
    patterns.forEach((pattern) => {
      markdown = markdown.replace(pattern.find, pattern.replacement);
    });
    return markdown;
  }

  returnRules() {
    return this.rules;
  }
}
