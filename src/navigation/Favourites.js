import React from 'react'
import { ListItem } from 'react-native-elements';
import { _ } from 'lodash';
import Wrapper from '../wrapper/Wrapper'

export default class Favourites extends React.Component {
    constructor(props){
        super(props)
        this.props.storage.addOnRefreshListener(
            (storage) => {
                this.setState({favourites: storage.getFavourites()})
            },
            ['favourites']
        )
        this.state = {favourites: this.props.storage.getFavourites()}
    }
    render(){
        return (
            <Wrapper
                navigation={this.props.navigation} 
                title="Favourites"
                style={{paddingTop:20}}
            >
                {_.map(this.state.favourites, (favourite) => {
                    return (
                        <ListItem key={favourite.indexId}
                            title={favourite.displayName}
                            onPress={()=>{this.props.navigation.navigate(
                                favourite.pageKey,
                                {indexId: favourite.indexId}
                            )}}
                        />
                    )
                })}
                
            </Wrapper>
        )
    }
}