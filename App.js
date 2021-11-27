import React from "react";
import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity, Platform, Alert } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavHolder from "./Screens/StackNavHolder";
import Home from "./Screens/Home";
import List from "./Screens/List";
import CreatePost from "./Screens/CreatePost";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import apiKeys from './config/keys';
import WelcomeScreen from './Screens/Welcome';
import SignUp from './Screens/SignUp';
import SignIn from './Screens/SignIn';
import LoadingScreen from './Screens/LoadingScreen';
import Dashboard from './Screens/ProfileDashboard';


// Initialize Firebase JS SDK
// https://firebase.google.com/docs/web/setup


//const [headerFont, setHeaderFont] = React.useState('Times New Roman');
// try {
//   firebase.initializeApp({
//     apiKey: "AIzaSyD408DGZ-QSVCiR4OjCdYUsXqTUGKLBPfM",
//     authDomain: "foodrank-635bd.firebaseapp.com",
//     databaseURL: "https://foodrank-635bd-default-rtdb.firebaseio.com",
//     projectId: "foodrank-635bd",
//     storageBucket: "foodrank-635bd.appspot.com",
//     messagingSenderId: "94700850281",
//     appId: "1:94700850281:web:fa5670b3afd098ff33e6f8",
//     measurementId: "G-MB8B3LKN2P"
//   });
// } catch (err) {
//   // ignore app already initialized error in snack
// }


// function defaultSave(){
//   const user = firebase.auth().currentUser.uid;

//   const dbh = firebase.firestore();
//   dbh.collection("Posts").doc("example").set({
//   employment: "plumber",
//   outfitColor: "red",
//   specialAttack: "fireball",
//   userID: user
//   })
// }

const Tab = createBottomTabNavigator();
function HomeTab() {
  var [headerFont, setHeaderFont] = React.useState('Berkshire');
  return (
  <Tab.Navigator>
  <Tab.Group screenOptions = {{headerStyle: {backgroundColor: '#EC2F2F'}, headerTitleStyle: {fontFamily: headerFont, color: '#FFF0E9', flexDirection: 'row', alignSelf: 'flex-start'}}}>
  <Tab.Screen 
  name="Foodrank" 
  component={StackNavHolder}
  options={{
    title: 'FoodRank',
    tabBarLabel: 'Categories',
    tabBarIcon: ({ color }) => (
      <MaterialCommunityIcons name="home" color={color} size={26} />
    )
  }}/>

  <Tab.Screen 
  name="CreatePost"
  component={CreatePost} 
  options={{
    title: "FoodRank",
    tabBarLabel: 'Create Post',
    tabBarIcon: ({ color }) => (
      <MaterialCommunityIcons name="post" color={color} size={26} />
    ),
  }}/>
  <Tab.Screen
  name="Profile"
  component={Dashboard}
  options= {{
    title: 'FoodRank',
    tabBarLabel: 'Profile'
  }}
  />
</Tab.Group>
</Tab.Navigator>
)
}


const Stack = createStackNavigator();

export default function App() {
  
  
  if (!firebase.apps.length) {
  console.log('Connected with Firebase')
  firebase.initializeApp(apiKeys.firebaseConfig);
}

loadFonts()

return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={'Loading'} component={LoadingScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Welcome' component={WelcomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Sign Up' component={SignUp} options={{ headerShown: false }}/>
        <Stack.Screen name='Sign In' component={SignIn} options={{ headerShown: false }}/>
        <Stack.Screen name='HomeTab' component={HomeTab} options={{ headerShown: false, headerLeft: null, gestureEnabled: false}}/>
      </Stack.Navigator>
    </NavigationContainer>

    )
}


async function loadFonts() {
  await Font.loadAsync({
    Berkshire: require('./assets/fonts/berkshire-swash.regular.ttf')
  })  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
