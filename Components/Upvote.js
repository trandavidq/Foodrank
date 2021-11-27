import React, {useState, useEffect} from 'react';
import {
    Text,
    View, StyleSheet
  } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as firebase from 'firebase'
import apiKeys from '../config/keys'

if (!firebase.apps.length) {
  console.log('Connected with Firebase')
  firebase.initializeApp(apiKeys.firebaseConfig);
}
 
const db = firebase.firestore()

export default function Upvote({params}) {
  //setup state using hooks:
  const [votes, updateVotes] = useState(0)
  useEffect( () => {
    fetchData()
  }, [])
  //console.log("params: " + JSON.stringify(params.id))
  //console.log("user: " + firebase.auth().currentUser.uid)

  async function fetchData() {
    var docRef = db.collection("Posts").doc(''+params.id)
    docRef.get().then((doc) => {
      if (doc.exists) {
        updateVotes(doc.data().votes)
      }
      else {
        //doc doesn't exist
        console.log("Doc doesn't exist")
      }
    })
  }

  return (
      <View>
        <View style={styles.voteContainer}>
            <Entypo 
              name="arrow-bold-up"
              size={30} color="green"
              onPress={ () => {
                updateVotes(votes + 1)
                db.collection("Posts").doc(''+params.id).update({
                  votes: votes + 1
                })
              }}/>
            
            <Text>{votes}</Text>
            <Entypo 
              name="arrow-bold-down"
              size={30} color="red"
              onPress={ () => {
                updateVotes(votes - 1)
                db.collection("Posts").doc(''+params.id).update({
                  votes: votes - 1
                })
              }}/>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
    voteContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginRight: 5
    }
})