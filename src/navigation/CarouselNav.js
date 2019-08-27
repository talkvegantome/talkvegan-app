import React from 'react';
import { Dimensions, AppState } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Button, Card, Title, Paragraph } from 'react-native-paper';

var fontScaleHelper = 1.2

export default class CarouselNav extends React.Component {
    state = Dimensions.get('window');
    
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = () => {
        this.setState(Dimensions.get('window'))
    }
    
    _renderItem = ({item}, fontScale) => {
        return (
            <Card onPress={item.navigateTo}>
                <Card.Content style={{height: 140 * fontScale*fontScaleHelper}}>
                <Title numberOfLines={2}>{item.title}</Title>
                    <Paragraph numberOfLines={5} style={{height: 110 * fontScale*fontScaleHelper}}>
                        {item.content}
                    </Paragraph>
                </Card.Content>
                <Card.Actions style={{height: 50 * fontScale*fontScaleHelper}}>
                    <Button>More...</Button>
                </Card.Actions>
            </Card>
        );
    }

    render () {
        return (
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.props.items}
              renderItem={(props) => this._renderItem(props, this.state.fontScale)}
              sliderWidth={this.state.width}
              itemWidth={this.state.width-this.state.width/5}
            />
        );
    }
}