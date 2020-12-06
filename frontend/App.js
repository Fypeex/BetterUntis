import 'react-native-gesture-handler';
import React from 'react';
import {Button, StyleSheet, View, Text, AsyncStorage} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SchoolSearch from './Pages/SchoolSearch.js';
import LoginScreen from "./Pages/LoginScreen";
import Loading from "./Pages/LoadingScreen"

const Stack = createStackNavigator();

class App extends React.Component {
    render() {
            return (
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Loading"
                            options={{headerShown: false}}
                            component={Loading}
                        />
                        <Stack.Screen
                            name="SchoolSearch"
                            options={{headerShown: false}}
                            component={SchoolSearch}
                        />
                        <Stack.Screen
                            name="LoginScreen"
                            options={{headerShown: false}}
                            component={LoginScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 200,
    }
});

export default App;