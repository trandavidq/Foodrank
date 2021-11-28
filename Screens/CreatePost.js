import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  Keyboard,
  Alert,
  View,
  StatusBar,
  Image,
  Text
} from 'react-native';
import * as firebase from "firebase";
import apiKeys from '../config/keys'
import "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import uuid from "uuid";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [image, setImage] = React.useState(null)
  const [reset, setReset] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [imageUUID, setUUID] = React.useState(null)

  React.useEffect(() => {
    if(false) {
      setTitle("")
      setBody("")
      setThread("")
      setRestaurant("")
    }
  }, [reset])

  async function handleImageRequest() {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Could not access the camera roll");
      }
      else {
        _pickImage()
      }
    }
  }

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log({ pickerResult });

    _handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult) => {
    if (!pickerResult.cancelled) {
      setImage(pickerResult.uri)
    }
    else {
      console.log("Picker cancelled")
    }
  };

  _uploadImage = async (uri) => {
    try {
      setUploading(true)
      const uploadUrl = await uploadImageAsync(uri);
      setImage(uploadUrl)
    }
    catch(e) {
      console.log(e);
      alert("Upload failed...");
    }
    finally {
      setUploading(false)
    }
  }

  async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    id = uuid.v4()
    setUUID(id)
    // var postRef = firebase.storage().ref().child('postImages/'+id)
    // postRef.put(blob).then( (snapshot) => {
    //   console.log("Uploaded")
    // })  
    const fileRef = firestore.storage().ref();
    const result = await fileRef.uploadBytes(blob);

    // We're done with the blob, close and release it
    blob.close();
  
    return await getDownloadURL(fileRef);
  }

  _maybeRenderImage = () => {
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden",
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>
      </View>
    );
  };

  //TODO: Add navigation back to home after inserting post (can update to navigate to new post page if desired)
  function insertPostIntoFirebase(){
    //Read in state data and write post to firebase
    if(title == "") {
      Alert.alert("Please include a title")
    }
    else if (restaurant == "") {
      Alert.alert("Please include a Restaurant")
    }
    else if (thread == "") {
      Alert.alert("Please include a Category")
    }
    else {
      //handle storing image to storage
      _uploadImage(image)

      var newPost = dbh.collection('Posts').doc()
      newPost.set({
        title: title,
        thread: thread,
        restaurant: restaurant,
        body: body,
        user: firebase.auth().currentUser.uid, //note this is a random string, not username
        votes: 0,
      });
      dbh.collection("users").doc(""+firebase.auth().currentUser.uid).collection("posts").doc(""+title).set({ //TODO: cannot use same title twice;; this is currently a logical error (both posts will exist in main posts collection, but will override user previous post with same title)
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
  }
  return (
    //TODO Make Food thread (and later restaurants) a dropdown tab, with an "add new" option
    <ScrollView scrollEnabled = {true}>
      <TextInput style = {styles.input} placeholder = "Post title" onChangeText = {setTitle} value = {title}></TextInput>

      <TextInput style = {styles.input} placeholder = "Category" onChangeText = {setThread} value = {thread}></TextInput>
      <TextInput style = {styles.input} placeholder = "Restaurant" onChangeText = {setRestaurant} value = {restaurant}></TextInput>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}> 
        <Button onPress={handleImageRequest} title="Upload an Image"/>
        {_maybeRenderImage()}
        <StatusBar barStyle="default" />
      </View>
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