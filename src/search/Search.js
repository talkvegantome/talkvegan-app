import React from 'react';
import { Text } from 'react-native'
import { Searchbar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { _ } from 'lodash';
import RemoveMarkdown from 'remove-markdown';

import Wrapper from '../wrapper/Wrapper.js';
import Analytics from '../analytics'
import Pages from '../Pages.js';
import SearchScoring from './SearchScoring.js';
import { commonStyle } from '../styles/Common.style.js';

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
        let title, body = ''
        if(result.topMatch.type === 'Title'){
            title = _.map(result.topMatch.matches, (match, index) => this.renderMatchText(match, contextMaxLength, index, false))
            body = RemoveMarkdown(this.state.pagesObj.getPageContent(result.path)).replace(/\n/g, ' ')
        }else{
            title = this.state.pagesObj.getPageTitle(result.path)
            body = _.map(result.topMatch.matches, (match, index) => this.renderMatchText(match, contextMaxLength, index))
        }
        
        return (
            <Card key={key} style={{marginTop: 10}}
                onPress={() => this.props.navigation.navigate('Home',{indexId: result.path})}>
                <Card.Content style={{height: 150}}>
                    <Title style={{height: 30}}>{title}</Title>
                    <Paragraph style={{maxHeight: 110}}>
                        {body}
                    </Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button>More...</Button>
                </Card.Actions>
            </Card>
        )
    }
    renderMatchText = (match, contextMaxLength, key, showEllipsis=true) => {
        let contextBefore = match.groups.contextBefore.replace(/\n/gms, ' ')
        let contextAfter = match.groups.contextAfter.replace(/\n/gms, ' ')
        contextBefore = contextBefore.slice(-contextMaxLength.start) // Limit length from the end
        contextAfter = contextAfter.slice(0, contextMaxLength.end) // Limit length from the beginning
        return (
            <Text key={key}>
                {showEllipsis && <Text> ...</Text>}
                <Text key={key}>
                    <Text>{contextBefore}</Text>
                    <Text style={{color: commonStyle.primary}}>{match.groups.match}</Text>
                    <Text>{contextAfter} {showEllipsis && '...'} </Text>
                </Text>
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