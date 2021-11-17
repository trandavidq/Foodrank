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
import * as firebase from "firebase";

try {
  firebase.initializeApp({
    apiKey: "AIzaSyD408DGZ-QSVCiR4OjCdYUsXqTUGKLBPfM",
    authDomain: "foodrank-635bd.firebaseapp.com",
    databaseURL: "https://foodrank-635bd-default-rtdb.firebaseio.com",
    projectId: "foodrank-635bd",
    storageBucket: "foodrank-635bd.appspot.com",
    messagingSenderId: "94700850281",
    appId: "1:94700850281:web:fa5670b3afd098ff33e6f8",
    measurementId: "G-MB8B3LKN2P"
  });
} catch (err) {
  // ignore app already initialized error in snack
}
const dbh = firebase.firestore();



export default function Post() {
  const [title, setTitle] = React.useState();
  const [body, setBody] = React.useState(); 

  function insertPostIntoFirebase(){
    //Read in state data and write post to firebase
    console.log(title);
    console.log(body);
    dbh.collection('Posts').doc('example2').set({
      title: title,
      body: body,
    });
  }
  return (

    <SafeAreaView>
      <Text>Post title: </Text>
      <TextInput style = {styles.input} placeholder = "Post title" onChangeText = {setTitle} value = {title}></TextInput>

      <Text>Post body: </Text>
      <TextInput style = {styles.body} multiline = {true} onChangeText = {setBody} value = {body} ></TextInput>

      <Button title= "Submit post" onPress = {insertPostIntoFirebase}></Button>
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