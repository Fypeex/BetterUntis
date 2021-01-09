import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SchoolSearch from "./Pages/SchoolSearch"
import LoginScreen from "./Pages/LoginScreen";
import LoadingScreen from "./Pages/LoadingScreen"
import Main from "./Pages/Main";
import Settings from "./Pages/Settings";
import {createDrawerNavigator} from "@react-navigation/drawer";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

class App extends React.Component {

    render() {
            return (
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="LoadingScreen"
                            options={{headerShown: false}}
                            component={LoadingScreen}
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
                        <Stack.Screen
                            name="DrawerNav"
                            options={{headerShown: false}}
                            component={DrawerNav}

                        />
                        </Stack.Navigator>
                    </NavigationContainer>
            )
    }


    
}
function DrawerNav() {
    return(
            <Drawer.Navigator>
                <Drawer.Screen
                    name="Main"
                    options={{headerShown: false}}
                    component={Main}
                />
                <Drawer.Screen
                    name="Settings"
                    options={{headerShown: false}}
                    component={Settings}
                />
            </Drawer.Navigator>
    );
}



export default App;