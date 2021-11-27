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
const Stack = createStackNavigator();


try {
  firebase.initializeApp({
    apiKey: "AIzaSyD408DGZ-QSVCiR4OjCdYUsXqTUGKLBPfM",
    authDomain: "foodrank-635bd.firebaseapp.com",
    databaseURL: "https://foodrank-635bd-default-rtdb.firebaseio.com",
    projectId: "foodrank-635bd",
    storageBucket: "foodrank-635bd.appspot.com",
    messagingSenderId: "94700850281",
    appId: "1:94700850281:web:fa5670b3afd098ff33e6f8",
    measurementId: "G-MB8B3LKN2P"
  });
} catch (err) {
  // ignore app already initialized error in snack
}
const dbh = firebase.firestore();



export default function Home(props) {
  const [data, setData]= React.useState([])
  console.log("home id: " + JSON.stringify(props))

  React.useEffect(()=>{
    fetchData()
  },[])

  async function fetchData() {
    //Use Firebase call in this function
    if(props.route.name == "Resaurants") {
      var threadCollection = await dbh.collection('Restaurants').get();
    }
    else {
      var threadCollection = await dbh.collection('Threads').get();
    }
    let threadData = [];
    threadCollection.forEach((doc) => {
      threadData.push({
        id: doc.id,
        thread: doc.data().thread,
      });
    });
    console.log(threadData);

    //threadData.forEach(element => console.log(element));
    setData(threadData);
  }


  function renderItem({ item }) { 
    //console.log(props.navigation)
    return (
      <TouchableOpacity onPress= {() => props.navigation.push('FoodList', { id : item.thread})}>
      <View style={styles.item}>
        {/* <Text style={{paddingRight: 30}}>Rank: {item.rank}</Text> */}
        <Image
          style={styles.image}
          source={require('../assets/favicon.png')}
        />
        <View>
          <Text> {item.thread} </Text>
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
        keyExtractor={(item) => item.thread}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 2,
    marginVertical: 8,
    marginHorizontal: 5,
    width: '95%',
    backgroundColor: '#F0F8FF',
    flexDirection: "row", 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
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
    fontSize: 20,

  },
});