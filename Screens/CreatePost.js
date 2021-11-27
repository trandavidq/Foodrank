import * as React from 'react';
import {
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  Keyboard,
  Alert,
} from 'react-native';
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
const dbh = firebase.firestore();



export default function Post({navigation: {navigate}}) {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState(""); 
  const [thread,setThread] = React.useState("");
  const [user,setUser] = React.useState(""); //will use to try and get user info from db
  let [reset, setReset] = React.useState(false)
  React.useEffect(() => {
    if(reset) {
      setTitle("")
      setBody("")
      setThread("")
    }
  }, [reset])

  console.log("navigate: " + navigate)

  //TODO: Add navigation back to home after inserting post (can update to navigate to new post page if desired)
  function insertPostIntoFirebase(){
    //Read in state data and write post to firebase
    console.log(title);
    console.log(body);
    if(title == "") {
      Alert.alert("Please include a title")
    }
    else if (body == "") {
      Alert.alert("Please include a body")
    }
    else if (thread == "") {
      Alert.alert("Please include a Category")
    }
    else {
      dbh.collection('Posts').add({
        title: title,
        thread: thread,
        body: body,
        user: firebase.auth().currentUser.uid, //note this is a random string, TODO: set user by accessing database to get name
        upvote: 0,
        downvote: 0
      });
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
      <TextInput style = {styles.body} placeholder="Description" multiline = {true} onChangeText = {setBody} value = {body}></TextInput>

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