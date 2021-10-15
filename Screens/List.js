import * as React from 'react';
import {
  Image,
  Text,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import Upvote from '../Components/Upvote';
import { getRandomBytes } from 'expo-random';

function fetchData() {
  //Use Firebase call in this function
  return [
    { id: 1, name: 'First Sample Item', description:"", rank: '1' },
    { id: 2, name: 'Second Sample Item', description:"", rank: '2' },
    { id: 3, name: 'Third Sample Item', description:"", rank: '3' },
    { id: 4, name: 'Fourth Sample Item', description:"", rank: '4' },
  ];
}



export default function List({navigation, route}) {
  const id = route.params.id;

  

  function renderItem({ item }) {
    return (
      <TouchableOpacity onPress= {()=> navigation.navigate('ViewPost', {title: item.name})}>
        <View style={styles.item}>
          {/* <Image
            style={styles.image}
            source={require('../assets/favicon.png')}
          /> */}
          <Upvote style = {styles.voting}/>
            <Text> {item.name} </Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    
    <SafeAreaView style = {{flex: 1, backgroundColor: '#F5FFFA'}}>
      <FlatList
        data={fetchData()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 0,
    width: '95%',
    backgroundColor: '#F0F8FF',
    flexDirection: "row", 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 40,
    shadowOffset: {
      width: 8,
      height: 10
    },
    shadowOpacity: .5,
    shadowRadius: 8

  },
  image: {
    width: 100,
    height: '50%',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
  },
  voting: {
    alignSelf: 'flex-start',
    width: 'auto'
  }
});