import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Holder from "./Screens/Holder"
import Home from "./Screens/Home"
import List from "./Screens/List"
import CreatePost from "./Screens/CreatePost"

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Holder" component={Holder} />
        <Tab.Screen name="CreatePost" component={CreatePost} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}