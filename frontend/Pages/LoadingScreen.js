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
            <View key = {0} style={styles.container}>
                <ActivityIndicator size="large" color="gray"/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        justifyContent:"center",
        alignItems:"center",
        flex: 1,
        backgroundColor: '#fff',
    },
})
export default LoadingScreen;

