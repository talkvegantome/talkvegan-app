import {_} from 'lodash'
import RemoveMarkdown from 'remove-markdown';

export default class SearchScoring {
    contextBeforeLength = 90
    contextAfterLength = 200
    matchScores = {
        'exactTitle': 200,
        'allWordsTitle': 40,
        'exactContent': 100,
        'allWordsContent': 20,
    }
    results = {}
    constructor(props){
        this.pages = props.pages
        this.query = props.query
        this.pageTitles = props.pageTitles
        _.forEach(this.pages, (o, i) => this.results[i] = [])
    }

    contextRegexBuilder = (needle, options='i') => {
        contextBeforePattern = '(.*)'
        contextAfterPattern = '(.*)'
        let regexString = contextBeforePattern + '(' + _.escapeRegExp(needle) +')' + contextAfterPattern
        try{
            regex = new RegExp(regexString, options)
        }catch(e){
            throw "Some error about " + regexString + "\n" + e
        }
        return regex;
    }

    simulateNameGroups(matches){
        // At the time of writing it seems like hermes doesn't support regex named matching
        // groups, seeing the question mark in the ?<name pattern as a repeater and throwing an error
        return _.map(matches, (match) => {
            return {
                groups: {
                    contextBefore: match[1],
                    match: match[2],
                    contextAfter: match[3]
                }
            }
        })
    }

    appendResult = (path, matches, score, type) => {
        this.results[path].push({    
            matches: this.simulateNameGroups(matches),
            score: score,
            type: type
        })
    }

    getMatches = () => {
        this.createScores()
        return this.aggregateScoresByPage()
    }
    
    aggregateScoresByPage = () => {
        let sortedResults = _.map(this.results, (matches, path) => {
            return {
                path: path,
                totalScore: this.totalScores(matches),
                topMatch: _.last(_.sortBy(matches, ['score']))
            }
        })
        return _.reverse(_.sortBy(_.filter(sortedResults, (result) => result.totalScore!=0), ['totalScore']))
    }

    totalScores = (matches) => {
        return _.sum(_.map(matches, (match) => match.score))
    }

    createScores = () => {
        _.forEach(this.pages, (pageContent, path) => {
            pageContent = RemoveMarkdown(pageContent).replace(/\n/g,'')
            // Match against page content
            this.scoreExactMatch(pageContent, path, this.matchScores.exactContent, 'Content');
            //this.scoreMatchAllWords(pageContent, path, this.matchScores.allWordsContent, 'Content');

            // Match against titles
            this.scoreExactMatch(this.pageTitles[path], path, this.matchScores.exactTitle, 'Title');
            //this.scoreMatchAllWords(this.pageTitles[path], path, this.matchScores.allWordsTitle, 'Title');
        })
        
    }

    scoreExactMatch = (content, path, score, type) => {
        re = this.contextRegexBuilder(this.query, 'gi')
        while (match = re.exec(content)) {
            if(!_.isNull(match[0])){
                this.appendResult(path, [match], score, type)
            }
        }
    }

    scoreMatchAllWords = (content, path, score, type) => {
        let queryWords = _.filter(this.query.split(' '), (o) => o.length > 0);
        if(queryWords.length < 2){
            return
        }
        let wordResults = {};
        _.forEach(queryWords, (queryWord) => {
            if(_.isNull(queryWord)){return}
            wordResults[queryWord] = []
            re = this.contextRegexBuilder(queryWord, 'i')
            let match = content.match(re)
            if(!_.isNull(match)){
                wordResults[queryWord].push(match)
            }
        })
        if(_.every(wordResults, (val) => val.length)){
            this.appendResult(path, _.map(wordResults, (o) => o[0]), score, type)
        }
    }
}