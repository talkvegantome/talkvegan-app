import React from 'react';
import { Dimensions, AppState, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { _ } from 'lodash';


var fontScaleHelper = 1.2

export default class CarouselNav extends React.Component {
    
    constructor(props){
        super(props)
    }
    state = Dimensions.get('window');

    _handleAppStateChange = () => {
        console.log('App state change')
        this.setState(Dimensions.get('window'))
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    render () {
        return (
            <View onLayout={this._handleAppStateChange}>
            <Carousel
              enableMomentum={true}
              enableSnap={false}
              decelerationRate={0.9}
              firstItem={ this.props.randomiseHomepage ? _.random(0,this.props.items.length-1): 0}
              ref={(c) => { this._carousel = c; }}
              data={this.props.items}
              renderItem={(props) => <NavigationCard item={props.item} />}
              sliderWidth={this.state.width}
              itemWidth={this.state.width < 500 ? this.state.width-this.state.width/5 : 500}
            />
            </View>
        );
    }
}

export class NavigationCard extends React.Component{
    state = Dimensions.get('window');

    _handleAppStateChange = () => {
        this.setState(Dimensions.get('window'))
    }
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    render(){
        return (
            <Card onPress={this.props.item.navigateTo} style={this.props.style}>
                <Card.Content style={{height: 140 * this.state.fontScale*fontScaleHelper}}>
                <Title numberOfLines={2}>{this.props.item.title}</Title>
                    <Paragraph numberOfLines={5} style={{height: 110 * this.state.fontScale*fontScaleHelper}}>
                        {this.props.item.content}
                    </Paragraph>
                </Card.Content>
                <Card.Actions style={{height: 50 * this.state.fontScale*fontScaleHelper}}>
                    <Button>More...</Button>
                </Card.Actions>
            </Card>
        )
    }
}