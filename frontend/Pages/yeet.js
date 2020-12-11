// import React 
import React, { Component } from "react";
// import Expo Font module 
import * as Font from "expo-font";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
import DetailScreen from "./src/screens/DetailScreen";
// import AppLoading helper 
//https://docs.expo.io/versions/latest/sdk/app-loading/
import { AppLoading } from "expo";

const appNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailScreen
  },
  {
    initialRouteName: "Home"
  }
);

// instead of immediately exporting the AppNavigator component we assign in to a constant. 
const RootApp = createAppContainer(appNavigator);


// we create and export our own custom App component 
export default class App extends Component {

  state = {
    loaded: false
  };
// create a helper function to load the font 
  _loadFontsAsync = async () => {
// loadAsync returns true | error
    let isLoaded = await Font.loadAsync({
      // add as many fonts as you want here .... 
      Montserrat: require("./assets/fonts/montserrat.ttf")
    });
    this.setState({ loaded: isLoaded });
  };

// call _loadFontsAsync 
  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    if (!this.state.loaded) {
      return <AppLoading />;
    }
    // from the custom App we return the component we assigned to RootApp.
    return <RootApp />;
  }
}