import * as React from 'react';
import {
  Image,
  Text,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from './List';
import Home from "./Home"
import ViewPostScreen from "./ViewPost";

const Stack = createStackNavigator();

export default function StackNavHolder(){
    return(
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FoodList" component={ListScreen} />
      <Stack.Screen name="ViewPost" component={ViewPostScreen} />
    </Stack.Navigator>
    )
}