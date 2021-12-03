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
import * as firebase from "firebase";
import apiKeys from '../config/keys'
import { DrawerActions } from '@react-navigation/routers';

if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig);
  }
  const dbh = firebase.firestore();

export default function ProfileListCreated(props){
    const [createdPosts, setCreatedPosts] =  React.useState(false)
    const [data, setData] =  React.useState([])
    React.useEffect(()=>{
            fetchData()
        },[])
        async function fetchData() {
            let createdPosts = false
            var likes = []
            if(props.route.name == "Created") {  
              var postRef = dbh.collection('users').doc(''+firebase.auth().currentUser.uid).collection('posts')
              setCreatedPosts(true)
              createdPosts = true
              postRef.onSnapshot((querySnapshot)=>{
                    var data = []
                    querySnapshot.forEach((doc)=> {
                        data.push({
                            id: doc.id,
                            title: doc.data().title,
                            body : doc.data().body,
                            thread: doc.data().thread
                          })
                    })
                    setData(data)
              })
            } else if (props.route.name == "Liked"){
                var postRef = dbh.collection('Posts')
                dbh.collection('users').doc(''+firebase.auth().currentUser.uid).get().then((doc)=>{
                    if(doc.exists){
                        try { //if user has likes field, make updates
                            likes = doc.data().likes
                          }
                          catch(e) { //user doesn't have likes field, need to update doc and use default state values
                            console.log(e)
                            db.collection("users").doc(''+firebase.auth().currentUser.uid).update({
                              likes: []
                            })
                          }
                          postRef.onSnapshot((querySnapshot) => {
                            var data = [];
                            querySnapshot.forEach((doc) => {
                                  if(likes.indexOf(doc.id) != -1){
                                      data.push({
                                          id: doc.id,
                                          title: doc.data().title,
                                          body : doc.data().body,
                                          thread: doc.data().thread
                                        })
                                  }
                             
                            })
                            setData(data);
                          });
                    }else {
                        console.log("Doc does not exist")
                    }
                    
                })
            } else {
                console.log("Invaild route name")
            }
        
          }
        
          function renderItem({ item }) {
            return (
              <View style = {styles.listItemContainer}>
                <TouchableOpacity onPress= {() => console.log("Remember to implement navigate from user profile")}>
                  <View style={styles.item}>
                    <Text styles={{fontSize: 40}}>
                        Title: {" "} 
                      {item.title}
                      </Text>
                      <Text styles={styles.thread}>
                      Caterory: {" "} 
                      {item.thread}
                      </Text>
                      <Text styles ={styles.body}>
                      {item.body}
                      </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }
          return (
            <SafeAreaView style = {{flex: 1, backgroundColor: '#F5FFFA',}}>
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
      flexDirection: "column", 
      justifyContent: "flex-start",
  
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
      fontSize: 40,
    },
    thread: {
        textAlign: 'center',
        fontSize: 20,
    }, 
    body: {
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


