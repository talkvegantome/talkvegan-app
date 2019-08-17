import React from 'react';
import { Text, View } from 'react-native'
import { Searchbar, Card, Title, Paragraph, Button, IconButton} from 'react-native-paper';
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
            searchPending: false,
            query: '',
            results: [],
            resultsPlaceholder: '',
            storage: storage,
            ticksSinceQueryUpdated: 0,
            analytics: analytics,
            pagesObj: pagesObj,
            searchScoring: new SearchScoring({
                pages: pagesObj.getPages(), 
                pageTitles: pagesObj.getPageTitles(), 
            })
        }
    }

    _search = () =>  {
        results = this.state.searchScoring.getMatches(this.state.query)
        this.setState({
            results: results,
            resultsPlaceholder: results.length == 0 ? 'No Results for: ' + this.state.query: '',
            searchInProgress: false,
        })
    }
    _searchQueryUpdate = (query) => this.setState({query: query})

    
    render() {
        return (
            <Wrapper navigation={this.props.navigation} title={'Search'} style={{flex:1}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Searchbar
                        style={{marginTop: 10, width: '100%'}}
                        placeholder="Search"
                        onChangeText={this._searchQueryUpdate}
                        onSubmitEditing={() => {
                            this.setState({
                                searchInProgress: true
                            });
                            this._search()
                        }}
                        value={this.state.query}
                    />
                </View>
                <Results 
                    resultsPlaceholder={this.state.resultsPlaceholder} 
                    results={this.state.results}
                    pagesObj={this.state.pagesObj}
                />
            </Wrapper>
        )
    }
}

class Results extends React.Component {
    renderMatch = (key, result) => {
        let numMatches = result.topMatch.matches.length
        let contextMaxLength = numMatches == 1 ? {start: 90, end: 200} : {start: 100/numMatches, end: 100/numMatches}
        let title, body = ''
        if(result.topMatch.type === 'Title'){
            title = _.map(result.topMatch.matches, (match, index) => this.renderMatchText(match, contextMaxLength, index, false))
            body = RemoveMarkdown(this.props.pagesObj.getPageContent(result.path)).replace(/\n/g, ' ')
        }else{
            title = this.props.pagesObj.getPageTitle(result.path)
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
        let contextBefore = match.groups.contextBefore.replace(/\n/gm, ' ')
        let contextAfter = match.groups.contextAfter.replace(/\n/gm, ' ')
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

        if(this.props.resultsPlaceholder){
            return (
                <Text style={{marginTop: 20}}>{this.props.resultsPlaceholder}</Text>
            )
        }
        return _.map(this.props.results, (result, i) => this.renderMatch(i, result))
            
    }
}