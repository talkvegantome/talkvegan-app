import React from 'react';
import { Text, View} from 'react-native'
import { Searchbar, Button, Card, Title, Paragraph } from 'react-native-paper';
import RemoveMarkdown from 'remove-markdown';
import {_} from 'lodash';
import Wrapper from './Wrapper.js';
import Analytics, { PrivacyDialog } from '../analytics'
import Pages from '../Pages.js';
import { markdownRules } from '../MarkDownRules.js'
import { commonStyle } from '../styles/Common.style.js';

function multiIncludes(text, values){
    return _.map(values, (o) => {
        var re = new RegExp('(?<before>.{0,90})(?<match>' + o +')(?<after>.{0,200})', 'si');
        return text.match(re)
    })
    
}

export default class Search extends React.Component{
    constructor(props) {
        super(props);
        this.scrollRef= React.createRef();
        this.props.storage.triggerUpdateMethods.push(this.updateState)
        this.updateState(this.props.storage)
    }
    updateState = (storage) => {
        let analytics = new Analytics(this.props.storage.settings)
        let pagesObj = new Pages(this.props.storage)
        this.state = {
            analytics: analytics,
            pagesObj: pagesObj,
            pages: pagesObj.getPages(),
            pageTitles: pagesObj.getPageTitles(),    
            splashPath: pagesObj.getSplashPath(),
            settings: this.props.storage.settings,
            markdownRulesObj: new markdownRules(this.props.navigation, this.props.storage.settings),
            indexHistory: []
        };
        this.state.analytics.logEvent('Loaded Application')
    }
    componentDidMount() {
        let timer = setInterval(() => {
          this._searchTimer()
        }, 200);
        this.setState({ timer: timer });
      }
    componentWillUnmount() {
        this.clearInterval(this.state.timer);
    }
    state = {
        query: '',
        searchPending: false
    }
    _searchTimer = () => {
        if(!this.state.searchPending || this.state.query.length < 2){
            return
        }
        let searchScoring = new SearchScoring({pages: this.state.pages, pageTitles: pageTitles, query: this.state.query})
        this.setState({
            results: searchScoring.getMatches(),
            searchPending: false
        })
    }
    _search = (query) => {
        this.setState({
            query: query, 
            searchPending: true
        })
    }
    renderMatch = (key, result) => {
        console.log(result)
        let contextMaxLength = result.topMatch.length == 1 ? {start: 90, end: 200} : {start: 20, end: 20}
        return (
            <Card key={key} style={{marginTop: 10}}
                onPress={() => this.props.navigation.navigate('Home',{indexId: result.path})}>
                <Card.Content style={{height: 150}}>
                    <Title style={{height: 30}}>{this.state.pagesObj.getPageTitle(result.path)}</Title>
                    {_.map(result.topMatch.matches, (match) => this.renderMatchText(match, contextMaxLength))}
                </Card.Content>
                <Card.Actions>
                    <Button>More...</Button>
                </Card.Actions>
            </Card>
        )
    }
    renderMatchText = (match, contextMaxLength) => {
        console.log(match)
        let contextBefore = match.groups.contextBefore.replace(/\n/gms, ' ')
        let contextAfter = match.groups.contextAfter.replace(/\n/gms, ' ')
        contextBefore = contextBefore.slice(-contextMaxLength.start) // Limit length from the end
        contextAfter = contextAfter.slice(0, contextMaxLength.end) // Limit length from the beginning
        return (
            <Paragraph style={{height: 110}}>
                <Text>{contextBefore}</Text>
                <Text style={{color: commonStyle.primary}}>{match.groups.match}</Text>
                <Text>{contextAfter}</Text>
            </Paragraph>
        )
    }
    render() {
        return (
            <Wrapper navigation={this.props.navigation} title={'Search'} style={{flex:1}}>
                <Searchbar
                    style={{marginTop: 10}}
                    placeholder="Search"
                    onChangeText={this._search}
                    value={this.state.query}
                />
                {
                    _.map(this.state.results, (result, i) => this.renderMatch(i, result))
                }
            </Wrapper>
        )
    }
}

class SearchScoring {
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

    contextRegexBuilder = (needle, options='si') => {
        contextBeforePattern = '(?<contextBefore>.{0,' + this.contextBeforeLength + '})'
        contextAfterPattern = '(?<contextAfter>.{0,' + this.contextAfterLength + '})'
        return new RegExp(contextBeforePattern + '(?<match>' + needle +')' + contextAfterPattern, options);
    }

    appendResult = (path, matches, score) => {
        // matches is expected to be [{contextBefore: '', contextAfter: '', match: ''}]
        this.results[path].push({    
            matches: matches,
            score: score
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

            // Match against page content
            this.scoreExactMatch(pageContent, path, this.matchScores.exactContent);
            this.scoreMatchAllWords(pageContent, path, this.matchScores.allWordsContent);

            // Match against titles
            this.scoreExactMatch(this.pageTitles[path], path, this.matchScores.exactTitle);
            this.scoreMatchAllWords(pageContent, path, this.matchScores.allWordsTitle);
        })
        
    }

    scoreExactMatch = (content, path, score) => {
        re = this.contextRegexBuilder(this.query, 'sig')
        while (match = re.exec(content)) {
            if(!_.isNull(match[0])){
                this.appendResult(path, [match], score)
            }
        }
    }

    scoreMatchAllWords = (content, path, score) => {
        let queryWords = this.query.split(' ');
        let wordResults = {};
        if(queryWords.length < 2){
            return
        }

        _.forEach(queryWords, (queryWord) => {
            wordResults[queryWord] = []
            re = this.contextRegexBuilder(queryWord, 'si')
            let match = content.match(re)
            if(!_.isNull(match)){
                wordResults[queryWord].push()
            }
        })
        if(_.every(wordResults, (val) => val.length)){
            this.appendResult(path, _.map(wordResults, (o) => o[0]), score)
        }
    }
}