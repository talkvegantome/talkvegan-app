import React from 'react';
import { Text } from 'react-native'
import { Searchbar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { _ } from 'lodash';
import Wrapper from '../wrapper/Wrapper.js';
import Analytics from '../analytics'
import Pages from '../Pages.js';
import SearchScoring from './SearchScoring.js';
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
        this.props.storage.triggerUpdateMethods.push((storage) => this.setState(this.returnState(storage)))
        this.state = this.returnState(this.props.storage)
    }
    returnState = (storage) => {
        let analytics = new Analytics(storage.settings)
        let pagesObj = new Pages(storage)
        return {
            storage: storage,
            analytics: analytics,
            pagesObj: pagesObj,
        }
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
        if(!this.state.searchPending){
            return
        }
        if(this.state.query.length < 2){
            this.setState({
                results: [],
                searchPending: false
            })
            return
        }
        let searchScoring = new SearchScoring({
            pages: this.state.pagesObj.getPages(), 
            pageTitles: this.state.pagesObj.getPageTitles(), 
            query: this.state.query
        })
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
        let numMatches = result.topMatch.matches.length
        let contextMaxLength = numMatches == 1 ? {start: 90, end: 200} : {start: 100/numMatches, end: 100/numMatches}
        return (
            <Card key={key} style={{marginTop: 10}}
                onPress={() => this.props.navigation.navigate('Home',{indexId: result.path})}>
                <Card.Content style={{height: 150}}>
                    <Title style={{height: 30}}>{this.state.pagesObj.getPageTitle(result.path)}</Title>
                    <Paragraph style={{maxHeight: 110}}>
                        <Text> ...</Text>
                        {_.map(result.topMatch.matches, (match, index) => this.renderMatchText(match, contextMaxLength, index))}
                        </Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button>More...</Button>
                </Card.Actions>
            </Card>
        )
    }
    renderMatchText = (match, contextMaxLength, key) => {
        let contextBefore = match.groups.contextBefore.replace(/\n/gms, ' ')
        let contextAfter = match.groups.contextAfter.replace(/\n/gms, ' ')
        contextBefore = contextBefore.slice(-contextMaxLength.start) // Limit length from the end
        contextAfter = contextAfter.slice(0, contextMaxLength.end) // Limit length from the beginning
        return (
            <Text key={key}>
                <Text>{contextBefore}</Text>
                <Text style={{color: commonStyle.primary}}>{match.groups.match}</Text>
                <Text>{contextAfter} ... </Text>
            </Text>
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