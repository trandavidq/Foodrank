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

  //post and thread scores
  const [votes, updateVotes] = useState(0)
  const [score, updateScore] = useState(0)

  //users like/dislike states:
  const [userLikes, updateLikes] = useState([])
  const [userDislikes, updateDislikes] = useState([])
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  //arrow states
  const [upIcon, setUpIcon] = useState("arrow-up-bold-outline")
  const [downIcon, setDownIcon] = useState("arrow-down-bold-outline")

  //user states
  const [docPoster, updateDocPoster] = useState(null)
  const [thread, updateThread] = useState(null)

  useEffect( () => {
    fetchData()
  }, [])

  async function fetchData() {
    var docRef = db.collection("Posts").doc(''+params.id)
    docRef.get().then((doc) => {
      if (doc.exists) { //post found
        updateVotes(doc.data().votes) //update post score
        updateDocPoster(doc.data().user) //update userID who made post
        updateThread(doc.data().threadID) //update thread ID

        var threadRef = db.collection("Threads").doc(""+doc.data().threadID)
        threadRef.get().then((threadDoc) => {
          if(threadDoc.exists) {
            //try to set score using thread's score, will error if no score value set yet
            updateScore(threadDoc.data().score) //set the score state
          }
          else {
            console.log("This posts threadID points to a thread which no longer exists.")
            let threadFound = false;
            //find actual thread
            db.collection("Threads").get().then((querySnapshot) => {
              querySnapshot.forEach((queryDoc) => {
                  // doc.data() is never undefined for query doc snapshots
                  if(queryDoc.data().thread === doc.data().thread){
                    threadFound = true;
                    docRef.update({
                      threadID: queryDoc.id
                    })
                    updateScore(queryDoc.data().score)
                    console.log("Updated threadID to point to appropriate thread :: resolved")
                  }
                  //console.log(doc.id, " => ", doc.data().thread);
              })
              if(!threadFound){
                console.log("Post has threadID which points to non-existent thread, and no approapriate thread could be found. - recommend deleting this point or creating a new thread.")
                console.log("Title: " + doc.data().title)
              }
            });
          }
        })
      }
      else {
        //doc doesn't exist
        console.log("Post doc doesn't exist")
      }
    })
    var userDoc = db.collection("users").doc(''+firebase.auth().currentUser.uid)
    userDoc.get().then((doc) => {
      if(doc.exists) { //user exists in db
        try { //if user has likes field, make updates
          updateLikes(doc.data().likes)
          if(doc.data().likes.indexOf(params.id) != -1) {
            setUpIcon("arrow-up-bold")
            setLiked(true)
          }
        }
        catch(e) { //user doesn't have likes field, need to update doc and use default state values
          console.log(e)
          db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
            likes: []
          })
        }
        try { //same thing with dislikes as with likes
          updateDislikes(doc.data().dislikes)
          if(doc.data().dislikes.indexOf(params.id) != -1) {
            setDownIcon("arrow-down-bold")
            setDisliked(true)
          }
        }
        catch(e) {
          console.log(e)
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

  //firebase.firestore.FieldValue.arrayUnion(""+params.id) :: add to user db
  //firebase.firestore.FieldValue.arrayRemove(""+params.id) :: remove from user db

  //.unshift(params.id) :: add to array
  //.splice(userLikes.indexOf(params.id), 1) :: remove from array

  function newButtonUp() {
    var offset = 0
    var dislikesChanged = false
    var newLikes = userLikes
    var newDislikes = userDislikes
    if(liked) {
      //if user already liked, need to unlike:
      offset = -1
      //remove likes from db
      db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
        likes: firebase.firestore.FieldValue.arrayRemove(""+params.id)
      })
      //update newLikes
      newLikes.splice(userLikes.indexOf(params.id), 1)
    }
    else {
      //user had not liked
      if(disliked) {
        //user had disliked, is now liking
        offset = 2
        //remove dislike and add like to db
        db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
          dislikes: firebase.firestore.FieldValue.arrayRemove(""+params.id)
        })
        dislikesChanged = true
        newDislikes.splice(userLikes.indexOf(params.id), 1)
      }
      else {
        //user had not liked nor disliked, is now liking
        offset = 1
      }
      db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
        likes: firebase.firestore.FieldValue.arrayUnion(""+params.id)
      })
      newLikes.unshift(params.id)
    }

    updates(offset, true, dislikesChanged, newLikes, newDislikes)
  }

  function newButtonDown() {
    var offset = 0
    var likesChanged = false
    var newLikes = userLikes
    var newDislikes = userDislikes
    if(disliked) {
      //if user already disliked, need to un-dislike:
      offset = 1
      //remove likes from db
      db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
        dislikes: firebase.firestore.FieldValue.arrayRemove(""+params.id)
      })
      //update newLikes
      newDislikes.splice(userLikes.indexOf(params.id), 1)
    }
    else {
      //user had not liked
      if(liked) {
        //user had liked, is now disliking
        offset = -2
        //remove like
        db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
          like: firebase.firestore.FieldValue.arrayRemove(""+params.id)
        })
        likesChanged = true
        newLikes.splice(userLikes.indexOf(params.id), 1)
      }
      else {
        //user had not liked nor disliked, is now liking
        offset = -1
      }
      //if user had already liked or not, either case need to add dislike to db and state
      db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
        dislikes: firebase.firestore.FieldValue.arrayUnion(""+params.id)
      })
      newDislikes.unshift(params.id)
    }

    updates(offset, likesChanged, true, newLikes, newDislikes)
  }

  function updates(offset, likesChanged, dislikesChanged, newLikes, newDislikes) {
    updateStates(offset, likesChanged, dislikesChanged, newLikes, newDislikes)
    updateDatabase(offset)
  }

  function updateStates(offset, likesChanged, dislikesChanged, newLikes, newDislikes) {
    //update post and thread scores
    updateVotes(votes + offset)
    updateScore(score + offset)
    if(likesChanged) {//if likes changed
      //fill or unfill arrow and update list of likes and liked state
      if(liked) {
        setUpIcon("arrow-up-bold-outline")
        setLiked(false)
      }
      else {
        setUpIcon("arrow-up-bold")
        setLiked(true)
      }
      updateLikes(newLikes)
    }
    if(dislikesChanged) {
      if(disliked) {
        setDownIcon("arrow-down-bold-outline")
        setDisliked(false)
      }
      else {
        setDownIcon("arrow-down-bold")
        setDisliked(true)
      }
      updateDislikes(newDislikes)
    }
  }

  function updateDatabase(offset) {
    //update post and thread scores
    db.collection("Posts").doc(''+params.id).update({
      votes: votes + offset
    })
    db.collection("Threads").doc(""+thread).update({
      score: score + offset
    })
    //update post score under user's collection
    if(docPoster == firebase.auth().currentUser.uid) {
      db.collection("users").doc(''+firebase.auth().currentUser.uid).collection("posts").doc(params.title).update({
        votes: votes + offset
      })
    }
  }

  return (
      <View>
        <View style={styles.voteContainer}>
            <MaterialCommunityIcons 
              name={upIcon}
              size={30} color="green"
              onPress={newButtonUp}/>
            
            <Text>{votes}</Text>

            <MaterialCommunityIcons 
              name={downIcon}
              size={30} color="red"
              onPress={newButtonDown}/>
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