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
import apiKeys from '../config/keys'


if (!firebase.apps.length) {
  console.log('Connected with Firebase')
  firebase.initializeApp(apiKeys.firebaseConfig);
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
    //console.log(postCollection);
    let postData = []
    postCollection.forEach((doc) =>{
      postData.push({
        id: doc.id,
        thread: doc.data().thread,
        body: doc.data().body,
        title: doc.data().title,
        votes: doc.data().votes
      })  
    })

    setPostData(postData)
  }
  function renderItem({ item }) {
    return (
      <View style = {styles.listItemContainer}>
        <Upvote params={{id: item.id, title: item.title}}/>
        <TouchableOpacity onPress= {()=> navigation.push('ViewPost', {id: item.id})}>
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
        data={data.sort((a,b) => b.votes - a.votes)}
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