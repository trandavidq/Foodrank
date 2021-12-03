import * as React from 'react';
import {
  Image,
  Text,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Keyboard
} from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import Upvote from './Upvote';
import { getRandomBytes } from 'expo-random';
import * as firebase from "firebase";
import apiKeys from '../config/keys'

if (!firebase.apps.length) {
  console.log('Connected with Firebase')
  firebase.initializeApp(apiKeys.firebaseConfig);
}
const db = firebase.firestore();

export default function List({navigation, route, params}) {
  const [data, setCommentsData] = React.useState([])
  const [comment, setComment] = React.useState(null)
  const id = params.id

  React.useEffect(()=>{
    fetchData()
  },[])

  //Get all comments under a specific post
  async function fetchData() {
    var ref = db.collection("Posts").doc(""+id).collection("Comments")
    
    ref.onSnapshot(querySnapshot => {
      var commentsData = []
      querySnapshot.forEach( (doc) => {
        if(doc.exists) {
          db.collection("users").doc(""+doc.data().user).get().then((userDoc) => {
            let name = userDoc.data().firstName + " " + userDoc.data().lastName
            commentsData.push({
              body: doc.data().body,
              user: name,
              id: doc.id
            }) 
          }) 
        }
      })
      setCommentsData(commentsData)
    })
  }
    //console.log(postCollection);

  function renderItem({ item }) {
    return (
      <View style = {styles.listItemContainer}>
          <View style={styles.item}>
            <Text> 
              {item.body}
            </Text>
            <Text style = {styles.user}>
              {"By " + item.user}
            </Text>
          </View>
      </View>
    );
  }

  function postComment() {
    db.collection("Posts").doc(""+id).collection("Comments").add({
      body: comment,
      user: firebase.auth().currentUser.uid
    })

    //reset add comment section and dismiss keyboard
    setComment("")
    Keyboard.dismiss();
  }
  // Space text input horizontally to the left of button (a plus symbol) to the right
  return (
    <SafeAreaView>
      <View style={{flexDirection: "row"}}>
        <TextInput style = {styles.input} placeholder = "Add a comment" onChangeText = {setComment} value = {comment}></TextInput>
        <Button title= "Add Comment" onPress = {postComment}> </Button>
      </View>
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
  user: {
    fontSize: 10,
    opacity: 0.3,
    textAlign: 'left',
    marginBottom: 50,
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
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 6,
  },
});