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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import ListScreen from './List';
import Home from "./Home";
import CreatePost from "./CreatePost";
import ViewPostScreen from "./ViewPost";
import LoadingScreen from './LoadingScreen';
import Welcome from './Welcome';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Dashboard from './ProfileDashboard';

const Stack = createStackNavigator();
export default function StackNavHolder(){
  const [headerFont, setHeaderFont] = React.useState('Times New Roman');
    return(
      <Stack.Navigator>
        <Stack.Group screenOptions = {{headerStyle: {backgroundColor: '#F5FFFA'}}}>
          <Stack.Screen name="Home" component={Home} options = {{
            title: "Categories",
            headerLeft: null,
            gestureEnabled: false
          }}/>
          <Stack.Screen name="FoodList" component={ListScreen} options = {
            ({route}) => ({title: JSON.stringify(route.params.id).replace(/['"]+/g, '')})
          }
          />
           {/** For some reason stack navigator doesn't work with this screen? */}
          <Stack.Screen name="ViewPost" component={ViewPostScreen} options = {{headerShown: false}}/>
        </Stack.Group>
      </Stack.Navigator>
    )
}