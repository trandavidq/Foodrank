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
const db = firebase.firestore();

export default function ViewPost({navigation,route}) {
  const [data, setPostData] = React.useState([])
  React.useEffect(()=>{
    fetchData()
  },[])
  async function fetchData() {
    const postCollection = await db.collection('Posts').get();
    let postData = []
    postCollection.forEach((doc) =>{
      postData.push({
        id: doc.id,
        thread: doc.data().thread,
        body: doc.data().body,
        title: doc.data().title
      })  
    })
    console.log(postData)
    setPostData(postData)
  }
  function renderPost({ item }) {
      return (
        <View style = {{width: '100%'}}>
          <Text style={styles.title}> {item.title} </Text>
          <Text style={styles.description}> {item.body} </Text>
        </View>

      );
    }
    return (
      <SafeAreaView>
        <FlatList
          data={data}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
        />
      </SafeAreaView>
    );

}
const styles = StyleSheet.create({
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
      paddingBottom: 35,
    },
  });