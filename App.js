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
import { StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { render } from 'react-dom';


const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      headerFont: 'Times New Roman'
    }
  }

  async componentDidMount() {
    await loadFonts()
    this.setState({
      headerFont: 'Berkshire'
    })
  }

  render() {
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
}
async function loadFonts() {
  await Font.loadAsync({
    Berkshire: require('./assets/fonts/berkshire-swash.regular.ttf')
  })
}