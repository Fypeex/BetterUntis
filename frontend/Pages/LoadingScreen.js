import React from 'react';
import {
    AsyncStorage,
    TouchableOpacity,
    TextInput,
    Button,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import validate from "react-native-web/dist/exports/StyleSheet/validate";
const ss = require("../backend/modules/schoolSearch.js")

class LoadingScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    checkState = async () => {
        let state = await AsyncStorage.getItem("State")

        switch (state) {
            case "LOGGED_IN":
                this.props.navigation.navigate("Main")
                break;
            case "SEARCH_SCHOOL":
                this.props.navigation.navigate("SchoolSearch")
                break;
            case "LOGGED_OUT":
                this.props.navigation.navigate("LoginScreen")
                break;
            default:
                this.props.navigation.navigate("SchoolSearch")
        }
    }

    async componentDidMount() {
        await this.checkState()
        this.props.navigation.addListener(
            'focus',
            () => {
                this.checkState()
            }
        );

    }
    render(){
        return (

            <LinearGradient 
                colors={["rgb(60,60,60)", "rgb(15,15,15)"]}
                start={[-0.66,0]}
                style={styles.gradient}>
                <View key = {0} style={styles.container}>
                    <ActivityIndicator size="large" color="rgb(200,200,200)"/>
                </View>
            </LinearGradient>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        justifyContent:"center",
        alignItems:"center",
        flex: 1,
    },    
    gradient:{
        width: '100%',
        height: '100%',
    },
})
export default LoadingScreen;

