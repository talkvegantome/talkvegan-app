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
        contextBeforePattern = '(?<contextBefore>.{0,' + this.contextBeforeLength + '})'
        contextAfterPattern = '(?<contextAfter>.{0,' + this.contextAfterLength + '})'
        return new RegExp(contextBeforePattern + '(?<match>' +  _.escapeRegExp(needle) +')' + contextAfterPattern, options);
    }

    appendResult = (path, matches, score, type) => {
        // matches is expected to be [{contextBefore: '', contextAfter: '', match: ''}]
        this.results[path].push({    
            matches: matches,
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
            pageContent = RemoveMarkdown(pageContent)
            // Match against page content
            this.scoreExactMatch(pageContent, path, this.matchScores.exactContent, 'Content');
            this.scoreMatchAllWords(pageContent, path, this.matchScores.allWordsContent, 'Content');

            // Match against titles
            this.scoreExactMatch(this.pageTitles[path], path, this.matchScores.exactTitle, 'Title');
            this.scoreMatchAllWords(this.pageTitles[path], path, this.matchScores.allWordsTitle, 'Title');
        })
        
    }

    scoreExactMatch = (content, path, score, type) => {
        re = this.contextRegexBuilder(this.query, 'ig')
        while (match = re.exec(content)) {
            if(!_.isNull(match[0])){
                this.appendResult(path, [match], score, type)
            }
        }
    }

    scoreMatchAllWords = (content, path, score, type) => {
        let queryWords = this.query.split(' ');
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