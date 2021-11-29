import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  Keyboard,
  Alert,
} from 'react-native';
import * as firebase from "firebase";
import apiKeys from '../config/keys'

if (!firebase.apps.length) {
  console.log('Connected with Firebase')
  firebase.initializeApp(apiKeys.firebaseConfig);
}
const dbh = firebase.firestore();

export default function Post({navigation: {navigate}}) {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState(""); 
  const [thread,setThread] = React.useState("");
  const [restaurant, setRestaurant] = React.useState("");
  let [reset, setReset] = React.useState(false)
  React.useEffect(() => {
    if(reset) {
      setTitle("")
      setBody("")
      setThread("")
      setRestaurant("")
    }
  }, [reset])

  //TODO: Add navigation back to home after inserting post (can update to navigate to new post page if desired)
  function insertPostIntoFirebase(){
    //Read in state data and write post to firebase
    if(title == "") {
      Alert.alert("Please include a Title")
    }
    else if (restaurant == "") {
      Alert.alert("Please include a Restaurant")
    }
    else if (thread == "") {
      Alert.alert("Please include a Category")
    }
    else {
      var newPost = dbh.collection('Posts').doc()
      newPost.set({
        title: title,
        thread: thread,
        restaurant: restaurant,
        body: body,
        user: firebase.auth().currentUser.uid, //note this is a random string, TODO: set user by accessing database to get name
        votes: 0,
      });
      dbh.collection("users").doc(""+firebase.auth().currentUser.uid).collection("posts").doc(""+title).set({ //cannot use same title twice
        title: title,
        thread: thread,
        restaurant: restaurant,
        body: body, //note this is a random string, TODO: set user by accessing database to get name
        votes: 0,
        postID: newPost.id
      })
      let threadFound = false;
      dbh.collection("Threads").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            if(doc.data().thread === thread){
              threadFound = true;
            }
            //console.log(doc.id, " => ", doc.data().thread);
        });
        if(!threadFound){
          //Thread not found in DB, add it
          //TODO: Thread not found - submit for admin approval
          dbh.collection('Threads').add({
            thread: thread,
          });
        }
        Keyboard.dismiss();
        setReset(true)
        Alert.alert("Posted!")
        navigate('Home')
      });
    }
    
    //if(collection.includes(thread))
  }
  return (
    //TODO Make Food thread (and later restaurants) a dropdown tab, with an "add new" option
    <ScrollView scrollEnabled = {true}>
      <TextInput style = {styles.input} placeholder = "Post title" onChangeText = {setTitle} value = {title}></TextInput>

      <TextInput style = {styles.input} placeholder = "Category" onChangeText = {setThread} value = {thread}></TextInput>
      <TextInput style = {styles.input} placeholder = "Restaurant" onChangeText = {setRestaurant} value = {restaurant}></TextInput>
      <TextInput style = {styles.body} placeholder="Description (optional)" multiline = {true} onChangeText = {setBody} value = {body}></TextInput>

      <Button title= "Submit post" onPress = {insertPostIntoFirebase}> </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: '100%',
    backgroundColor: '#EFEFEF',
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  body: {
    height: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});