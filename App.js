import * as React from "react";
import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity, Platform, Alert } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavHolder from "./Screens/StackNavHolder";
import Home from "./Screens/Home";
import List from "./Screens/List";
//mport CreatePost from "./Screens/CreatePost";
import CreatePost from "./Screens/CreatePost";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { render } from 'react-dom';

// Initialize Firebase JS SDK
// https://firebase.google.com/docs/web/setup
const Tab = createBottomTabNavigator();
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


function defaultSave(){
  const user = firebase.auth().currentUser.uid;

  const dbh = firebase.firestore();
  dbh.collection("Posts").doc("example").set({
  employment: "plumber",
  outfitColor: "red",
  specialAttack: "fireball",
  userID: user
  })
}


export default function App() {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [authenticatedState, setAuthenticatedState] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState();
  const [headerFont, setHeaderFont] = React.useState('Times New Roman');
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  const [message, showMessage] = React.useState((!firebaseConfig || Platform.OS === 'web')
    ? { text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device."}
    : undefined);
  if(!authenticatedState){
    return (
    
      <View style={{ padding: 20, marginTop: 50 }}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
        <Text style={{ marginTop: 20 }}>Enter phone number</Text>
        <TextInput
          style={{ marginVertical: 10, fontSize: 17 }}
          placeholder="+1 999 999 9999"
          autoFocus
    
          onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
        />
        <Button
          title="Send Verification Code"
          disabled={!phoneNumber}
          onPress={async () => {
            // The FirebaseRecaptchaVerifierModal ref implements the
            // FirebaseAuthApplicationVerifier interface and can be
            // passed directly to `verifyPhoneNumber`.
            try {
              const phoneProvider = new firebase.auth.PhoneAuthProvider();
              const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current
              );
              setVerificationId(verificationId);
              showMessage({
                text: "Verification code has been sent to your phone.",
              });
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: "red" });
            }
          }}
        />
        <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
        <TextInput
          style={{ marginVertical: 10, fontSize: 17 }}
          editable={!!verificationId}
          placeholder="123456"
          onChangeText={setVerificationCode}
        />
        <Button
          title="Confirm Verification Code"
          disabled={!verificationId}
          onPress={async () => {
            try {
              const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
              );
              await firebase.auth().signInWithCredential(credential);
              setAuthenticatedState(true);
              defaultSave()
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: "red" });
            }
          }}
        />
        {message ? (
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, { backgroundColor: 0xffffffee, justifyContent: "center" }]}
            onPress={() => showMessage(undefined)}>
            <Text style={{color: message.color || "blue", fontSize: 17, textAlign: "center", margin: 20, }}>
              {message.text}
            </Text>
          </TouchableOpacity>
        ) : undefined}
      </View>
    );

  }
  else{
    //Authenticated
    return (
      <NavigationContainer>
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
              ),
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
          </Tab.Group>
        </Tab.Navigator>
      </NavigationContainer>
    )
  }
  
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
