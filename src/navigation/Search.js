import React from 'react';
import { Text, View} from 'react-native'
import { Searchbar, Button, Card, Title, Paragraph } from 'react-native-paper';


import {_} from 'lodash';
import Wrapper from './Wrapper.js';
import Analytics, { PrivacyDialog } from '../analytics'
import Pages from '../Pages.js';
import { markdownRules } from '../MarkDownRules.js'
import { commonStyle } from '../styles/Common.style.js';
function multiIncludes(text, values){
    return _.map(values, (o) => {
        var re = new RegExp('(?<before>.{0,20})(?<match>' + o +')(?<after>.{0,20})');
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
                    matches: multiIncludes(o, split_query)
                }
            })
        }
        this.setState({
            query: query, 
            results: results
        })
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
                        return(
                            <Card key={i} style={{marginTop: 10}}>
                                <Card.Content style={{height: 150}}>
                                <Title>{this.state.pagesObj.getPageTitle(result.path)}</Title>
                                <Paragraph style={{height: 100}}>
                                <Text>
                                    <Text>{result.matches[0].groups.before}</Text>
                                    <Text 
                                        style={{
                                            color: commonStyle.primary
                                        }}
                                    >
                                        {result.matches[0].groups.match}
                                    </Text>
                                    <Text>{result.matches[0].groups.after}</Text>
                                </Text>
                                </Paragraph>
                                </Card.Content>
                                <Card.Actions>
                                <Button onPress={() => this.props.navigation.navigate('Home',{indexId: result.path})}>More...</Button>
                                </Card.Actions>
                            </Card>
                            
                        )
                        
                    })
                }
            </Wrapper>
        )
    }
}