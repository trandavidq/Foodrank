import * as React from 'react';
import {
  Image,
  Text,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import * as firebase from 'firebase'
import apiKeys from '../config/keys'
import Upvote from '../Components/Upvote';

if (!firebase.apps.length) {
  console.log('Connected with Firebase')
  firebase.initializeApp(apiKeys.firebaseConfig);
}
const db = firebase.firestore();

export default function ViewPost({navigation,route}) {
  let id = route.params.id;
  const [postData, setPostData] = React.useState([])
  const [userData, setUserData] = React.useState(null)
  const [validUser, setValidUser] = React.useState(false)
  React.useEffect(()=>{
    fetchData()
  },[])

  async function fetchData() {
    //console.log("(viewpost)ID: " + id);
    var postRef = db.collection('Posts').doc(""+id)
    var userID = ""
    postRef.get().then((doc) => {
      setPostData(doc.data())
      userID = doc.data().user

      var userRef = db.collection('users').doc(""+userID)
      userRef.get().then((doc) => {
        if(doc.exists) {
          setValidUser(true)
          setUserData({
            name: doc.data().firstName + " " + doc.data().lastName
          })
        }
        else {
          setUserData({
            name: ""
          })
        }
      })
    })
    
  }

  //TODO Return post screen not as scroll view, but simply a single post page
  return (
    <SafeAreaView>
      <View style = {{width: '100%'}}>
        <View style={styles.header}>
          <Upvote params={{id: id, title: postData.title}} style={{justifyContent: "left"}}/>
          <Text style={styles.title}> {postData.title} </Text>
        </View>
        <Text style={styles.user}>{userData != null ? userData.name != "" ? "Post created by " + userData.name: "": ""}</Text>
        <Text style={styles.description}> {postData.body} </Text>
      </View>
    </SafeAreaView>
  );

}
const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      justifyContent: "center"
    },
    user: {
      fontSize: 10,
      opacity: 0.3,
      textAlign: 'center',
      marginBottom: 50,
    },
    description: {
      textAlign: 'center',
      fontSize: 20,
    },
    image: {
      width: 100,
      height: 100,
    },
    title: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: "bold",
      paddingBottom: 7,
      marginTop: 10,
    },
  });