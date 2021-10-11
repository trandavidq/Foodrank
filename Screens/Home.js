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
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from './List';

const Stack = createStackNavigator();

function fetchData() {
  //Use Firebase call in this function
  return [
    { id: 1, name: 'Pizza ', description:"", rank: '1' },
    { id: 2, name: 'Chinese', description:"", rank: '2' },
    { id: 3, name: 'Ice cream', description:"", rank: '3' },
    { id: 4, name: 'Salad', description:"", rank: '4' },
  ];
}


export default function Home(props) {


  function renderItem({ item }) { 
    //console.log(props.navigation)
    return (
      <TouchableOpacity onPress= {() => props.navigation.navigate('FoodList', { id : item.name})}>
      <View style={styles.item}>
        <Text style={{paddingRight: 30}}>Rank: {item.rank}</Text>
        <Image
          style={styles.image}
          source={require('../assets/favicon.png')}
        />
        <View>
          <Text> {item.name} </Text>
          <Text> {item.description} </Text>
        </View> 
      </View>
      </TouchableOpacity>
    );
  }

  
  return (
    <SafeAreaView>
      <Text style= {styles.title}>Food threads</Text>
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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: '100%',
    backgroundColor: '#EFEFEF',
    flexDirection: "row", 
    justifyContent:"flex-start",
    alignItems:"center"
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,

  },
});