import React, {useState, useEffect} from 'react';
import {
    Text,
    View, StyleSheet
  } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
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
  const [userLikes, updateLikes] = useState([])
  const [userDislikes, updateDislikes] = useState([])
  const [upIcon, setUpIcon] = useState("arrow-up-bold-outline")
  const [downIcon, setDownIcon] = useState("arrow-down-bold-outline")
  useEffect( () => {
    fetchData()
  }, [])

  async function fetchData() {
    var docRef = db.collection("Posts").doc(''+params.id)
    docRef.get().then((doc) => {
      if (doc.exists) {
        updateVotes(doc.data().votes)
      }
      else {
        //doc doesn't exist
        console.log("Post doc doesn't exist")
      }
    })
    var userDoc = db.collection("users").doc(''+firebase.auth().currentUser.uid)
    userDoc.get().then( (doc) => {
      if(doc.exists) {
        //user exists in db
        if(doc.data().likes != undefined) {
          //user likes established
          updateLikes(doc.data().likes)
          if(userLikes.indexOf(params.id) != -1) {
            setUpIcon("arrow-up-bold")
          }
        }
        else {
          //setting up user likes
          db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
            likes: []
          })
        }
        if(doc.data().dislikes != undefined) {
          //user dislikes established (load them)
          updateDislikes(doc.data().dislikes)
          if(userDislikes.indexOf(params.id) != -1) {
            setDownIcon("arrow-down-bold")
          }
        }
        else {
          //setting up user dislikes in db
          db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
            dislikes: []
          })
        }
      }
      else {
        console.log("Current user not found in database")
      }
    })
  }

  function buttonUp() {
    var new_likes = userLikes
    var new_dislikes = userDislikes
    if(userLikes.indexOf(params.id) != -1) {
      //the user has liked this already, is unliking
      //TODO change image coloring to default
      setUpIcon("arrow-up-bold-outline")
      updateVotes(votes - 1)
      db.collection("Posts").doc(''+params.id).update({
        votes: votes - 1
      })
      db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
        likes: firebase.firestore.FieldValue.arrayRemove(""+params.id)
      })
      new_likes.splice(userLikes.indexOf(params.id), 1)
    }
    else {
      setUpIcon("arrow-up-bold")
      //the user has not liked this already
      if(userDislikes.indexOf(params.id) != -1) {
        setDownIcon("arrow-down-bold-outline")
        //user has disliked, and now is liking
        updateVotes(votes + 2)
        db.collection("Posts").doc(''+params.id).update({
          votes: votes + 2
        })
        db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
          dislikes: firebase.firestore.FieldValue.arrayRemove(""+params.id)
        })
        new_dislikes.splice(userDislikes.indexOf(params.id), 1)
      }
      else {
        //user is liking, and has not disliked
        updateVotes(votes + 1)
        db.collection("Posts").doc(''+params.id).update({
          votes: votes + 1
        })
      }
      new_likes.unshift(params.id)
      db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
        likes: firebase.firestore.FieldValue.arrayUnion(""+params.id)
      })
    }
    updateLikes(new_likes)
    updateDislikes(new_dislikes)
  }

  function buttonDown() {
    var new_likes = userLikes
    var new_dislikes = userDislikes
    //user disliked
    if(userDislikes.indexOf(params.id) != -1) {
      setDownIcon("arrow-down-bold-outline")
      //the user has disliked this already, is now un-disliking
      //TODO change image coloring to default
      updateVotes(votes + 1)
      db.collection("Posts").doc(''+params.id).update({
        votes: votes + 1
      })
      db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
        dislikes: firebase.firestore.FieldValue.arrayRemove(""+params.id)
      })
      new_dislikes.splice(userDislikes.indexOf(params.id), 1)
    }
    else {
      setDownIcon("arrow-down-bold")
      //the user has not disliked this already
      if(userLikes.indexOf(params.id) != -1) {
        setUpIcon("arrow-up-bold-outline")
        //user has liked, and now is disliking
        updateVotes(votes - 2)
        db.collection("Posts").doc(''+params.id).update({
          votes: votes - 2
        })
        db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
          likes: firebase.firestore.FieldValue.arrayRemove(""+params.id)
        })
        new_likes.splice(userLikes.indexOf(params.id), 1)
      }
      else {
        //user is disliking, and has not liked
        updateVotes(votes - 1)
        db.collection("Posts").doc(''+params.id).update({
          votes: votes - 1
        })
      }
      new_dislikes.unshift(params.id)
      db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
        dislikes: firebase.firestore.FieldValue.arrayUnion(""+params.id)
      })
    }
    updateLikes(new_likes)
    updateDislikes(new_dislikes)
  }

  return (
      <View>
        <View style={styles.voteContainer}>
            <MaterialCommunityIcons 
              name={upIcon}
              size={30} color="green"
              onPress={buttonUp}/>
            
            <Text>{votes}</Text>

            <MaterialCommunityIcons 
              name={downIcon}
              size={30} color="red"
              onPress={buttonDown}/>
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