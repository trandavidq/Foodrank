import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import ListScreen from './List';
import Home from "./Home";
import ViewPostScreen from "./ViewPost";
import HomeTabNavi from './HomeTabNavi'

const Stack = createStackNavigator();
export default function StackNavHolder(){
  const [headerFont, setHeaderFont] = React.useState('Times New Roman');
    return(
      <Stack.Navigator>
        <Stack.Group screenOptions = {{headerStyle: {backgroundColor: '#F5FFFA'}}}>
          <Stack.Screen name="Home" component={HomeTabNavi} options = {{
            title: "Home",
            headerLeft: null,
            gestureEnabled: false,
            headerShown: false
          }}/>
          <Stack.Screen name="FoodList" component={ListScreen} options = {
            ({route}) => ({title: route.params.id})
          }
          />
           {/** For some reason stack navigator doesn't work with this screen? */}
          <Stack.Screen name="ViewPost" component={ViewPostScreen} options = {{headerShown: false}}/>
        </Stack.Group>
      </Stack.Navigator>
    )
}