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
        <Stack.Group screenOptions = {{headerStyle: {backgroundColor: '#F5FFFA'}}}>
          <Stack.Screen name="Home" component={Home} options = {{
            title: "Categories"
          }}/>
          <Stack.Screen name="FoodList" component={ListScreen} options = {
            ({route}) => ({title: JSON.stringify(route.params.id).replace(/['"]+/g, '')})
          }
          />
          <Stack.Screen name="ViewPost" component={ViewPostScreen} />
        </Stack.Group>
      </Stack.Navigator>
    )
}