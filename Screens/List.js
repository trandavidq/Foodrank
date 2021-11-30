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
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
  const id = route.params.id;

  React.useEffect(()=>{
    fetchData()
  },[])
  //Filter by thread
  async function fetchData() {
    const postCollection = db.collection('Posts').where("thread","==",id)
    .onSnapshot(querySnapshot => {
      var postData = []
      querySnapshot.forEach(doc => {
        postData.push({
          id: doc.id,
          thread: doc.data().thread,
          body: doc.data().body,
          title: doc.data().title,
          votes: doc.data().votes
        })  
      })
      setPostData(postData)
    })
  }
    //console.log(postCollection);

  function renderItem({ item }) {
    return (
      <View style = {styles.listItemContainer}>
        <TouchableOpacity onPress= {()=> navigation.push('ViewPost', {id: item.id})}>
          <View style={styles.item}>
          <Upvote params={{id: item.id, title: item.title}}/>
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
    justifyContent: "flex-start",
    alignItems: "center",

    //spacing
    padding: 0,

    //size
    minWidth: '100%',
    height: '100%',

    //coloring
    backgroundColor: '#F0F8FF',
    
    //curved border
    borderRadius: 4,
    
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
    padding: 0,
    flex: 1
  },
  list: {
    height: 50
  }
});