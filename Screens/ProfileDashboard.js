import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import {loggingOut} from '../API/firebaseMethods';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProfileTabNav from './HomeTabNavi'
import Home from "./Home";
const Tab = createMaterialTopTabNavigator();

export default function Dashboard({ navigation }) {
  let currentUserUID = firebase.auth().currentUser.uid;
  const [firstName, setFirstName] = useState('');
  useEffect(() => {
    async function getUserInfo(){
      try {
        let ref = firebase
          .firestore()
          .collection('users')
          .doc(currentUserUID)

          let doc = await ref
          .get();

        if (!doc.exists){
          Alert.alert('No user data found!')
        } else {
          let dataObj = doc.data();
          setFirstName(dataObj.firstName)
        }
      } catch (err){
      Alert.alert('There is an error.', err.message)
      }
    }
    getUserInfo();
  }, [])

  const handlePress = () => {
    loggingOut();
    navigation.replace('Home');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Dashboard</Text>
      <View style={styles.container2}>
      <Text style={styles.text}>Hi {firstName}</Text>
      <TouchableOpacity style={styles.logbutton} onPress={handlePress}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    padding: 10,
    backgroundColor: '#FF0000',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
  },
  logbutton: {
    width: 150,
    padding: 10,
    backgroundColor: '#FF0000',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,

  },
  buttonText: {
    fontSize:20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  container2: {
    height: '50%',
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    flexDirection: "column",
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontStyle: 'italic',
    marginTop: '20%',
    marginBottom: '10%',
    fontWeight: 'bold',
    color: 'black',
  },
  titleText: {
    flexDirection: 'row',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E6194',
  },
  textInput: {
    width: 300,
    height: 200,
    fontSize:18,
    borderWidth: 1,
    borderColor:'#a4eddf',
    padding: 10,
    margin: 20,
  },
});