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

    return (
      <TouchableOpacity onPress= {() => props.navigation.push('FoodList', { type: list_type, id : title})}>
      <View style={styles.item}>
        {/* <Text style={{paddingRight: 30}}>Rank: {item.rank}</Text> */}
        <Image
          style={styles.image}
          source={require('../assets/favicon.png')}
        />
        <View>
          <Text> {title} </Text>
          {/* <Text> {item.description} </Text> */}
        </View> 
      </View>
      </TouchableOpacity>
    );
  }

  return (
    
    <SafeAreaView style = {{flex: 1, backgroundColor: '#F5FFFA'}}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 2,
    marginVertical: 5,
    marginHorizontal: 5,
    width: '95%',
    backgroundColor: '#F0F8FF',
    flexDirection: "row", 
    justifyContent: "center",
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