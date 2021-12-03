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
import * as firebase from "firebase";
import apiKeys from '../config/keys'
import onSnapshot from "firebase/firestore"
import * as Font from 'expo-font';

const Stack = createStackNavigator();

if (!firebase.apps.length) {
  console.log('Connected with Firebase')
  firebase.initializeApp(apiKeys.firebaseConfig);
}
const dbh = firebase.firestore();


export default function Home(props) {
  const [data, setData]= React.useState([])
  const [rest, setRest] = React.useState(false)

  React.useEffect(()=>{
    fetchData()
  },[])
  React.useEffect(() => {
    loadFonts()
  }, [])
  // const [loaded] = useFonts({
  //   Montserrat: require('../assets/fonts/OpenSans.ttf'),
  // });
  

  async function fetchData() {
    //Use Firebase call in this function
    let isRest = false
    if(props.route.name == "Restaurants") {
      var ref = await dbh.collection('Restaurants')
      setRest(true)
      isRest = true
    }
    else { //else its "Home", list threads
      var ref = await dbh.collection('Threads')
    }
    ref.onSnapshot((querySnapshot) => {
      var data = [];
      querySnapshot.forEach((doc) => {
        if(isRest) {
          data.push({
            id: doc.id,
            name: doc.data().name,
          });
        }
        else {
          data.push({
            id: doc.id,
            thread: doc.data().thread,
            score: doc.data().score
          });
        }
      })
      setData(data);
    });

    //data.forEach(element => console.log(element));
  }
  

  function renderItem({ item }) { 
    //console.log(props.navigation)
    
    if(rest) {
      var list_type = "restaurant"
      var title = item.name
    }
    else {
      var list_type = "thread"
      var title = item.thread
    }
    var icon = require('../assets/favicon.png');
    if(!rest){
      //Only display for threads
      switch(title){
        case 'Chinese':
          icon = require('../assets/chinese.jpg');
          break;
        case 'Burgers':
          icon = require('../assets/burger.jpg');
          break;
        case 'Pizza':
          icon = require('../assets/pizza.jpg');
          break;
        case 'Bagel':
          icon = require('../assets/Bagels.jpg');
          break;
        default: 
          icon = require('../assets/favicon.png');
          break;
      }
    }
    else if(rest){
      switch(title){
        case 'Papa Johns':
          icon = require('../assets/papajohns.png');
          break;
        case 'Panera':
          icon = require('../assets/panera.png');
          break;
        case "Einstein's Bagels":
          icon = require('../assets/einsteinbros.png');
          break;
        case 'Five Guys':
          icon = require('../assets/fiveguys.png');
          break;
        default:
          icon = require('../assets/favicon.png');
          break;
      }
    }
    return (
      <TouchableOpacity onPress= {() => props.navigation.push('FoodList', { type: list_type, id : title})}>
      <View style={styles.item}>
        {/* <Text style={{paddingRight: 30}}>Rank: {item.rank}</Text> */}
        <Image
          style={styles.image}
          //require('../assets/favicon.png')
          source={icon}
          
          // source = {require('../assets/burger.jpg')}
        />
        <View style = {{flexDirection: 'row'}}>
          <Text style= {{fontSize: 16, fontWeight: 'bold', fontFamily: 'OpenSans', paddingLeft: 20}}>{title}</Text>
          <Text style = {{fontSize: 16, fontWeight: 'bold', color: 'green',}}>{rest ? "" : ": "+item.score}</Text>
          {/* <Text> {item.description} </Text> */}
        </View> 
      </View>
      </TouchableOpacity>
    );
  }

  return (
    
    <SafeAreaView style = {{flex: 1, backgroundColor: '#F5FFFA'}}>
      <FlatList
        data={rest ? data : data.sort((a,b) => b.score - a.score)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}
async function loadFonts() {
  await Font.loadAsync({
    Berkshire: require('../assets/fonts/berkshire-swash.regular.ttf')
  })  
  await Font.loadAsync({
    OpenSans: require('../assets/fonts/OpenSans-SemiBold.ttf')
  })  
}

const styles = StyleSheet.create({
  item: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 2,
    marginVertical: 5,
    marginHorizontal: 5,
    width: '95%',
    backgroundColor: '#F0F8FF',
    flexDirection: "row", 
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 4,
    shadowOffset: {
      width: 8,
      height: 10
    },
    shadowOpacity: .5,
    shadowRadius: 8
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
  },
});