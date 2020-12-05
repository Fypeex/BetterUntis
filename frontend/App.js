import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TouchableOpacity, ImageBackground, StyleSheet, Text, View } from 'react-native';
import {RNTesterThemeContext} from "react-native/RNTester/js/components/RNTesterTheme";

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: "https://i.imgur.com/hMG7oyM.jpeg" }} style={styles.logo}>
        <Text style={styles.instructions}>
          To share a photo from your phone with a friend, just press the button below!
        </Text>
      <TouchableOpacity
        onPress={()=>{alert("Hello World")}}
        style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    flex:1,
    resizeMode: "cover",
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
  },
  button: {
    flex:0.05,
    width:200,
    backgroundColor: "orange",
    borderRadius:10,
  },
  buttonText: {
    fontSize:20,
  }
});
