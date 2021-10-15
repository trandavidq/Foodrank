import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavHolder from "./Screens/StackNavHolder"
import Home from "./Screens/Home"
import List from "./Screens/List"
import CreatePost from "./Screens/CreatePost"
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        
        <Tab.Screen 
        name="Foodrank" 
        component={StackNavHolder}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}/>

        <Tab.Screen 
        name="Create Post" 
        component={CreatePost} 
        options={{
          tabBarLabel: 'CreatePost',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="post" color={color} size={26} />
          ),
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}