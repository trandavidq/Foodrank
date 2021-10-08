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
      <TouchableOpacity onPress= {()=> navigation.navigate('ViewPost',{title: item.name})}>
        <View style={styles.item}>
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
      <Text style={styles.title}>You are on the {JSON.stringify(id).replace(/['"]+/g, '')}page</Text>
      <FlatList
        data={fetchData()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    textAlign: 'center',
    fontSize: 20,
  },
});