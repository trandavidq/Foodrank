import * as React from 'react';
import {
  Image,
  Text,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
//import { TextInput } from 'react-native-gesture-handler';





export default function Post() {


  return (

    <SafeAreaView>
      <Text>Post title: </Text>
      <TextInput style = {styles.input} placeholder = "Post title"></TextInput>

      <Text>Post body: </Text>
      <TextInput style = {styles.body}></TextInput>

      <Button title= "Submit post"></Button>
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
    justifyContent: "flex-start",
    alignItems: "center"
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  body: {
    height: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});