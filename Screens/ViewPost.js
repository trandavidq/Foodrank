import * as React from 'react';
import {
  Image,
  Text,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';



export default function ViewPost({navigation,route}) {
  
  function fetchData() {
    //Use Firebase call in this function
    return [
      { id: 1, title: route.params.title, description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dignissim tincidunt viverra. Pellentesque sed diam massa. Proin ultricies vehicula porta. Donec risus justo, blandit nec elit sit amet, mattis mollis risus. Proin imperdiet velit felis, quis maximus ligula egestas id. Pellentesque id mi eget dolor euismod viverra ac et tortor. Sed vel blandit metus." }
    ];
  }
  function renderPost({ item }) {
      return (
        <View style = {{width: '100%'}}>
          <Text style={styles.title}> {item.title} </Text>
          <Text style={styles.description}> {item.description} </Text>
        </View>

      );
    }
    return (
      <SafeAreaView>
        <FlatList
          data={fetchData()}
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