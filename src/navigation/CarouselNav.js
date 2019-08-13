import React from 'react';
import { View, Text, Dimensions} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';


var {height, width} = Dimensions.get('window');
export default class MyCarousel extends React.Component {
    
    state = {
        entries: [
            {
                title: "Without farming there would be no animals",
                content: "Without farming we would have no animals! You can’t want a world with no sheep, cows, pigs, or chickens? Fine they are killed at the end of their lives, but they still get to live!"
            },
            {
                title: "Veganism is too awkward",
                content: "Veganism is too counter-cultural. I don’t want to be that awkward person at a party going imitates nasal voice err, I’m a vegan, is your cake vegan?"
            },
            {
                title: "Animals are slaughtered humanely",
                content: "Animals don’t suffer when they’re slaughtered because we do it humanely."
            },
            {
                title: "Animals aren't sapient",
                content: "It’s okay to kill animals because they aren’t sentient/sapient"
            }
        ]
    }
    _renderItem ({item, index}) {
        return (
            <Card>

                <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.content}</Paragraph>
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
              data={this.state.entries}
              renderItem={this._renderItem}
              sliderWidth={width}
              itemWidth={width-width/10}
            />
        );
    }
}