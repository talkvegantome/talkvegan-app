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
            splashPath: pagesObj.getSplashPath(),
            settings: this.props.storage.settings,
            markdownRulesObj: new markdownRules(this.props.navigation, this.props.storage.settings),
            indexHistory: []
        };
        this.state.analytics.logEvent('Loaded Application')
    }
    state = {
        query: ''
    }
    
    _search = (query) => {
        let results = []

        if(query.length > 0){
            let split_query = query.split(' ')
            results = _.map(this.state.pages, (o, i) => {  
                return {
                    path: i,
                    matches: multiIncludes(RemoveMarkdown(o), split_query)
                }
            })
        }
        this.setState({
            query: query, 
            results: results
        })
    }
    renderMatch = (key, result) => {
        return (
            <Card key={key} style={{marginTop: 10}}
                onPress={() => this.props.navigation.navigate('Home',{indexId: result.path})}>
                <Card.Content style={{height: 150}}>
                    <Title style={{height: 30}}>{this.state.pagesObj.getPageTitle(result.path)}</Title>
                    <Paragraph style={{height: 110}}>
                        <Text>{result.matches[0].groups.before.replace(/\n/gms,' ')}</Text>
                        <Text 
                            style={{
                                color: commonStyle.primary
                            }}
                        >
                            {result.matches[0].groups.match}
                        </Text>
                        <Text>{result.matches[0].groups.after.replace(/\n/gms,' ')}</Text>
                    </Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button>More...</Button>
                </Card.Actions>
            </Card>
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
                    _.map(this.state.results, (result, i) => {
                        if(_.isNull(result.matches[0])){
                            return
                        }
                        return this.renderMatch(i, result)
                        
                    })
                }
            </Wrapper>
        )
    }
}