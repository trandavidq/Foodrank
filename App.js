import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./Screens/Home"
import List from "./Screens/List"
import Post from "./Screens/Post"


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="FoodList" component={List} />
        <Tab.Screen name="Post" component={Post} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}