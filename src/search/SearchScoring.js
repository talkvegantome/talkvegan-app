import { _ } from 'lodash';
import RemoveMarkdown from 'remove-markdown';

export default class SearchScoring {
  contextBeforeLength = 90;
  contextAfterLength = 200;
  matchScores = {
    exactTitle: 200,
    allWordsTitle: 40,
    eachWordTitle: 10,
    exactContent: 100,
    allWordsContent: 20,
    eachWordContent: 1,
  };
  results = {};
  constructor(props) {
    this.pages = {};
    _.forEach(props.pages, (p, i) => {
      this.pages[i] = RemoveMarkdown(p).replace(/\n/g, ' ');
    });
    this.pageTitles = props.pageTitles;
    this.results = this.resetResults();
  }
  resetResults() {
    this.results = {};
    _.forEach(this.pages, (o, i) => (this.results[i] = []));
  }
  contextRegexBuilder = (needle, options = 'i') => {
    let regexString =
      '(.{0,200})' + '(' + _.escapeRegExp(needle) + ')' + '(.{0,200})';
    let regex;
    try {
      regex = new RegExp(regexString, options);
    } catch (e) {
      throw 'Some error about ' + regexString + '\n' + e;
    }
    return regex;
  };

  simulateNameGroups(matches) {
    // At the time of writing it seems like hermes doesn't support regex named matching
    // groups, seeing the question mark in the ?<name pattern as a repeater and throwing an error
    return _.map(matches, (match) => {
      return {
        groups: {
          contextBefore: match[1],
          match: match[2],
          contextAfter: match[3],
        },
      };
    });
  }

  appendResult = (path, matches, score, type) => {
    // Remove null results
    let filteredMatches = _.filter(matches, (o) => o);
    this.results[path].push({
      matches: this.simulateNameGroups(filteredMatches),
      score: score,
      type: type,
    });
  };

  getMatches = async (query) => {
    this.resetResults();
    this.query = query;
    this.createScores();
    return this.aggregateScoresByPage();
  };

  aggregateScoresByPage = () => {
    let sortedResults = _.map(this.results, (matches, path) => {
      return {
        path: path,
        totalScore: this.totalScores(matches),
        topMatch: _.last(_.sortBy(matches, ['score'])),
      };
    });
    return _.reverse(
      _.sortBy(_.filter(sortedResults, (result) => result.totalScore != 0), [
        'totalScore',
      ])
    );
  };

  totalScores = (matches) => {
    return _.sum(_.map(matches, (match) => match.score));
  };

  createScores = () => {
    _.forEach(this.pages, (pageContent, path) => {
      // Match against page content
      this.scoreExactMatch(
        pageContent,
        path,
        this.matchScores.exactContent,
        'Content'
      );
      this.scoreMatchFuzzy({
        content: pageContent,
        path: path,
        scores: {
          allWords: this.matchScores.allWordsContent,
          eachWord: this.matchScores.eachWordContent,
        },
        type: 'Content',
      });

      // Match against titles
      this.scoreExactMatch(
        this.pageTitles[path],
        path,
        this.matchScores.exactTitle,
        'Title'
      );
      this.scoreMatchFuzzy({
        content: this.pageTitles[path],
        path: path,
        scores: {
          allWords: this.matchScores.allWordsTitle,
          eachWord: this.matchScores.eachWordTitle,
        },
        type: 'Title',
      });
    });
  };

  scoreExactMatch = (content, path, score, type) => {
    let regex = this.contextRegexBuilder(this.query, 'gi');
    let match;
    while ((match = regex.exec(content))) {
      // eslint-disable-line no-cond-assign
      if (!_.isNull(match[0])) {
        this.appendResult(path, [match], score, type);
      }
    }
  };

  scoreMatchFuzzy = (props) => {
    let queryWords = _.filter(this.query.split(' '), (o) => o.length > 0);
    if (queryWords.length < 2) {
      // If it's only one word, it will be covered by scoreExactMatch
      return;
    }
    let wordResults = {};
    _.forEach(queryWords, (queryWord) => {
      if (_.isNull(queryWord)) {
        return;
      }
      wordResults[queryWord] = [];
      let regex = this.contextRegexBuilder(queryWord, 'i');
      let match = props.content.match(regex);
      if (!_.isNull(match)) {
        wordResults[queryWord].push(match);
      }
    });
    if (_.every(wordResults, (val) => val.length)) {
      this.appendResult(
        props.path,
        _.map(wordResults, (o) => o[0]),
        props.scores.allWords,
        props.type
      );
      return;
    }
    if (_.some(wordResults, (val) => val.length)) {
      this.appendResult(
        props.path,
        _.map(wordResults, (o) => o[0]),
        props.scores.eachWord,
        props.type
      );
    }
    return wordResults;
  };
}
