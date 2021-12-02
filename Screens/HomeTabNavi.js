import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import ListScreen from './List';
import Home from "./Home";
import ViewPostScreen from "./ViewPost";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
export default function TopTabNavi(){
  const [headerFont, setHeaderFont] = React.useState('Times New Roman');
    return(
      <Tab.Navigator>
        <Tab.Group screenOptions = {{headerStyle: {backgroundColor: '#F5FFFA'}}}>
            <Tab.Screen name="Categories" component={Home} options = {{
                title: "Categories",
                headerLeft: null,
                gestureEnabled: false
            }}/>
        </Tab.Group>
      </Tab.Navigator>
    )
}