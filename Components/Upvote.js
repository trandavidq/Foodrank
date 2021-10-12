import React from 'react';
import {
    Text,
    View, StyleSheet
  } from 'react-native';
  import { Entypo } from '@expo/vector-icons'; 

class Upvote extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            upVote: 0,
            downVote: 0
        }
    }

    incrementCount = () => {
        this.setState({upVote: this.state.upVote + 1});
      }
    toggleDecrement = () => {
        this.setState({downVote: this.state.downVote + 1});
    }

    render() {
        return (
            <View style={styles.contain}>
            <View style={styles.text}>
                <Entypo 
                name="arrow-bold-up"
                size={50} color="green"
                onPress={this.incrementCount}/>
                <Text>{this.state.upVote}</Text>
                <Entypo 
                name="arrow-bold-down"
                size={50} color="red"
                onPress={this.toggleDecrement}/>
                <Text>{this.state.downVote}</Text>
            </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        display: 'flex',
        flexDirection: "row", 
        justifyContent:"flex-start",
    },
    contain:{
        position: "absolute",
        bottom: 0,
        right: 50
    }
})

export default Upvote;