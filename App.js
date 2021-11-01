import * as React from 'react';
import { Text, View ,Button, StyleSheet, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavHolder from "./Screens/StackNavHolder"
import Home from "./Screens/Home"
import List from "./Screens/List"
import CreatePost from "./Screens/CreatePost"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { render } from 'react-dom';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import * as SecureStore from 'expo-secure-store';


const firebaseConfig = {
  apiKey: "AIzaSyD408DGZ-QSVCiR4OjCdYUsXqTUGKLBPfM",
  authDomain: "foodrank-635bd.firebaseapp.com",
  projectId: "foodrank-635bd",
  storageBucket: "foodrank-635bd.appspot.com",
  messagingSenderId: "94700850281",
  appId: "1:94700850281:web:fa5670b3afd098ff33e6f8",
  measurementId: "G-MB8B3LKN2P"
};

firebase.initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfigs);
}


// Initialize Firebase


const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      headerFont: 'Times New Roman'
    }
  }
  

  async checkForToken() {
    let token = await SecureStore.getItemAsync('token');
    this.setState({
      token: token,
      loading: false,
    });
  }

  async saveTokenToSecureStorage(token){
    SecureStore.setItemAsync("token", token)
    this.setState({
      token: token
    })
 }

  componentDidMount() {
    loadFonts().then( () => {
    this.setState({
      headerFont: 'Berkshire'
    })})
  }

  render() {
    if(!this.state.token){
      return (
        <View style={styles.container}>
          <Button title="Login With Facebook" onPress={() => this.logIn()} />
        </View>
      );
    }
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Group screenOptions = {{headerStyle: {backgroundColor: '#EC2F2F'}, headerTitleStyle: {fontFamily: this.state.headerFont, color: '#FFF0E9', flexDirection: 'row', alignSelf: 'flex-start'}}}>
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
    );
  }
  async logIn() {
    try {
      //Seed documentation on course site at mobileappdev.teachable.com
      //For default user names and passwords.
      await Facebook.initializeAsync('225724646319548');
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        this.saveTokenToSecureStorage(token)
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
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