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
        count: 0
      };
    }


   render() {
        return (
            <View>
              <View style={styles.voteContainer}>
                  <Entypo 
                    name="arrow-bold-up"
                    size={30} color="green"
                    onPress={this.upHandler}
                  />
                  <Text>{this.state.count}</Text>
                  <Entypo 
                    name="arrow-bold-down"
                    size={30} color="red"
                    onPress={this.downHandler}
                  />
              </View>
            </View>
        );
   }
  upHandler() {
    this.setState(state => ({
      count: state.count + 1
    }));
  }
  downHandler() {
    this.setState(state => ({
      count: state.count - 1
    }))
  }
}
const styles = StyleSheet.create({
    voteContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginRight: 5
    }
})

export default Upvote;