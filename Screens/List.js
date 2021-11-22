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
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import Upvote from '../Components/Upvote';
import { getRandomBytes } from 'expo-random';
import * as firebase from "firebase";


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
const db = firebase.firestore();


export default function List({navigation, route}) {
  const [data, setPostData] = React.useState([])
  const id = route.params.id;

  React.useEffect(()=>{
    fetchData()
  },[])
  //Filter by thread
  async function fetchData() {
    const postCollection = await db.collection('Posts').where("thread","==",id).get();
    console.log(id);
    //console.log(postCollection);
    let postData = []
    postCollection.forEach((doc) =>{
      console.log(doc.data().title);
      postData.push({
        id: doc.id,
        thread: doc.data().thread,
        body: doc.data().body,
        title: doc.data().title
      })  
    })
    console.log(postData)
    setPostData(postData)
  }
  function renderItem({ item }) {
    return (
      <View style = {styles.listItemContainer}>
        <Upvote/>
        <TouchableOpacity onPress= {()=> navigation.navigate('ViewPost', {id: item.id})}>
          <View style={styles.item}>
              <Text> 
                {item.title}
              </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <SafeAreaView style = {{flex: 1, backgroundColor: '#F5FFFA',}}>
      <FlatList style = {styles.list}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    //component placement
    flexDirection: "row", 
    justifyContent: "center",
    alignItems: "center",

    //spacing
    padding: 5,

    //size
    minWidth: '90%',
    height: '100%',

    //coloring
    backgroundColor: '#F0F8FF',
    
    //curved border
    borderRadius: 40,
    
    shadowOffset: {
      width: 8,
      height: 10
    },
    shadowOpacity: .5,
    shadowRadius: 8
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    margin: 5,
    padding: 5,
    flex: 1
  },
  list: {
    height: 50
  }
});