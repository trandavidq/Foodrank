import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import ListScreen from './List';
import Home from "./Home";
import ViewPostScreen from "./ViewPost";
import ProfileDashboard from "./ProfileDashboard"
import ProfileListCreated from './ProfileListCreated';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
export default function TopTabNavi(){
  const [headerFont, setHeaderFont] = React.useState('Times New Roman');
    return(
      <Tab.Navigator>
        <Tab.Group screenOptions = {{headerStyle: {backgroundColor: '#F5FFFA'}}}>
            <Tab.Screen name="Dashboard" component={ProfileDashboard} options = {{
                title: "Dashboard"
            }}/>
            <Tab.Screen name="Liked" component={ProfileListCreated} options = {{
                title: "Liked Posts"
            }}/>
            <Tab.Screen name="Created" component={ProfileListCreated} options = {{
                title: "My Posts"
            }}/>
        </Tab.Group>
      </Tab.Navigator>
    )
}