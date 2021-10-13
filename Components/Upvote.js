import React from 'react';
import {
    Text,
    View, StyleSheet
  } from 'react-native';
  import { Entypo } from '@expo/vector-icons'; 
  const up = 0;
  const down = 0;

class  Upvote extends React.Component {
    constructor(props) {
        super(props);
    
        this.upHandler = this.upHandler.bind(this);
    
        this.downHandler = this.downHandler.bind(this);
    
        this.state = {
          upCount: up,
          downCount: down
        };
      }


   render() {
        return (
            
            <View>
            <View style={styles.text}>
                <Entypo 
                name="arrow-bold-up"
                size={50} color="green"
                onPress={this.upHandler}/>
                <Text>{this.state.upCount}</Text>
                <Entypo 
                name="arrow-bold-down"
                size={50} color="red"
                onPress={this.downHandler}/>
                <Text>{this.state.downCount}</Text>
            </View>
            </View>
        );
   }
   upHandler() {
    if (this.state.upCount === up) {
      this.setState(state => ({
        upCount: state.upCount + 1,
        downCount: down
      }));
    }
  }
  downHandler() {
    if (this.state.downCount === down) {
      this.setState(state => ({
        downCount: state.downCount + 1,
        upCount: up
      }));
    }
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