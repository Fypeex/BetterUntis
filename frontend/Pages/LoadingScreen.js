import React from "react";
import {AsyncStorage, ActivityIndicator, StyleSheet, Text, View } from "react-native";

class LoadingScreen extends React.Component {
    async componentDidMount() {
        await AsyncStorage.getItem("School").then(
            r => {
                if(r !== null) this.props.navigation.navigate('LoginScreen')
                else {this.props.navigation.navigate('SchoolSearch')}
            }
        )
    }

    render() {
    return (
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="gray"/>
        </View>
    )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
});

export default LoadingScreen;