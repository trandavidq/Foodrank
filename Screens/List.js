import * as React from 'react';
import {
  Image,
  Text,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';

function fetchData() {
  //Use Firebase call in this function
  return [
    { id: 1, name: 'pizza', description:"jsafl;jaf;ldkja;ldf", rank: '1' },
    { id: 2, name: 'soup', description:"jsafl;jaf;ldkja;ldf", rank: '-1' },
    { id: 2, name: 'cocoa', description:"jsafl;jaf;ldkja;ldf", rank: '-1' },
    { id: 2, name: 'ice cream', description:"jsafl;jaf;ldkja;ldf", rank: '-1' },
  ];
}

function renderItem({ item }) {
  return (
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
  );
}

export default function List() {
  return (
    <SafeAreaView>
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
    fontSize: 32,
  },
});