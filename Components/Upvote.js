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
  const [docPoster, updateDocPoster] = useState(null)
  const [thread, updateThread] = useState(null)
  const [score, updateScore] = useState(0)
  useEffect( () => {
    fetchData()
  }, [])

  async function fetchData() {
    var docRef = db.collection("Posts").doc(''+params.id)
    docRef.get().then((doc) => {
      if (doc.exists) { //post found
        updateVotes(doc.data().votes) //update post score
        updateDocPoster(doc.data().user) //update userID who made post
        if(doc.data().threadID != undefined) { //if post has a threadID saved
          updateThread(doc.data().threadID) //update thread ID

          var threadRef = db.collection("Threads").doc(""+doc.data().threadID)
        }
        else { //no threadID saved, need to find the appropriate thread
          var threadRef = db.collection("Threads")
          threadRef.get().then((querySnapshot) => {
            querySnapshot.forEach((threadDoc) => {
              if (threadDoc.data().thread === doc.data().thread) { //if thread found
                updateThread(threadDoc.id) //update thread ID
                docRef.update({ //save threadID to post
                  threadID: threadDoc.id
                })
              }
            })
          })
        }
        threadRef.get().then((threadDoc) => {
          if (threadDoc.data().score != undefined) { //if thread has a score value
            updateScore(threadDoc.data().score) //set the score state
          }
          else {
            threadRef.update({ //otherwise update the thread to have score field, use default state of 0
              score: 0
            })
          }
        })
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
          if(doc.data().likes.indexOf(params.id) != -1) {
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
          if(doc.data().dislikes.indexOf(params.id) != -1) {
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
      updateScore(score - 1)
      db.collection("Threads").doc(""+thread).update({
        score: score - 1
      })
      if(docPoster == firebase.auth().currentUser.uid) {
        db.collection("users").doc(''+firebase.auth().currentUser.uid).collection("posts").doc(params.title).update({
          votes: votes - 1
        })
      }
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
        updateScore(score + 2)
        db.collection("Threads").doc(""+thread).update({
          score: score + 2
        })
        if(docPoster == firebase.auth().currentUser.uid) {
          db.collection("users").doc(''+firebase.auth().currentUser.uid).collection("posts").doc(params.title).update({
            votes: votes + 2
          })
        }
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
        updateScore(score + 1)
        db.collection("Threads").doc(""+thread).update({
          score: score + 1
        })
        if(docPoster == firebase.auth().currentUser.uid) {
          db.collection("users").doc(''+firebase.auth().currentUser.uid).collection("posts").doc(params.title).update({
            votes: votes + 1
          })
        }
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
      updateScore(score + 1)
      db.collection("Threads").doc(""+thread).update({
        score: score + 1
      })
      if(docPoster == firebase.auth().currentUser.uid) {
        db.collection("users").doc(''+firebase.auth().currentUser.uid).collection("posts").doc(params.title).update({
          votes: votes + 1
        })
      }
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
        updateScore(score - 2)
        db.collection("Threads").doc(""+thread).update({
          score: score - 2
        })
        if(docPoster == firebase.auth().currentUser.uid) {
          db.collection("users").doc(''+firebase.auth().currentUser.uid).collection("posts").doc(params.title).update({
            votes: votes - 2
          })
        }
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
        updateScore(score - 1)
        db.collection("Threads").doc(""+thread).update({
          score: score - 1
        })
        if(docPoster == firebase.auth().currentUser.uid) {
          db.collection("users").doc(''+firebase.auth().currentUser.uid).collection("posts").doc(params.title).update({
            votes: votes - 1
          })
        }
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