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

if (!firebase.apps.length) {
  console.log('Connected with Firebase')
  firebase.initializeApp(apiKeys.firebaseConfig);
}
const db = firebase.firestore();

export default function ViewPost({navigation,route}) {
  let id = route.params.id;
  const [data, setPostData] = React.useState([])
  React.useEffect(()=>{
    fetchData()
  },[])

  async function fetchData() {
    //console.log("(viewpost)ID: " + id);
    const postCollection = await db.collection('Posts').where(firebase.firestore.FieldPath.documentId(),'==',id).get();
    let postData = []
    postCollection.forEach((doc) =>{
      console.log(doc.data().title);
      postData.push({
        id: doc.id,
        thread: doc.data().thread,
        body: doc.data().body,
        title: doc.data().title,
        uid: doc.data().user,
      })  
    })
    //console.log(postData)
    setPostData(postData)
    console.log("uid: " + postData[0].uid)
  }

  function renderPost({item}) {
    return (
      <View style = {{width: '100%'}}>
        <Text style={styles.title}> {item.title} </Text>
        <Text style={styles.user}>Post created by {item.uid}</Text>
        <Text style={styles.description}> {item.body} </Text>
      </View>

    );
  }

  //TODO Return post screen not as scroll view, but simply a single post page
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