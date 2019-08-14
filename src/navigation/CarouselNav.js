import React from 'react';
import { View, Text, Dimensions} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';


var {height, width} = Dimensions.get('window');
export default class CarouselNav extends React.Component {
    
    _renderItem ({item, index}) {
        return (
            <Card onPress={item.navigateTo}>
                <Card.Content style={{height: 150}}>
                <Title>{item.title}</Title>
                <Paragraph style={{height: 100}}>{item.content}</Paragraph>
                </Card.Content>
                <Card.Actions>
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
              renderItem={this._renderItem}
              sliderWidth={width}
              itemWidth={width-width/5}
            />
        );
    }
}