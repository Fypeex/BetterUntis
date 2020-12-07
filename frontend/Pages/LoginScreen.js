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

class LoginScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data:[]
        }
    }
    async componentDidMount() {
        let data = [];
        const value = JSON.parse(await AsyncStorage.getItem('School'));
        if (value !== null) {
            data.push(
                <View style={styles.container} key={0}>
                    <View style={styles.infobox}>
                        <Text>{value.displayName}</Text>
                        <Text>{value.address}</Text>
                    </View>
                    <View style={styles.loginContainer}>
                        <TextInput style={styles.username} placeholder = "Username"/>
                        <TextInput style={styles.password} placeholder = "Password"/>
                    </View>

                </View>
            )
        }
        this.setState({data})
    }
    render(){
       return (
           this.state.data.map((key,value) => {
               return key
           })
       )
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
    backArrow: {
        padding:20,
        backgroundColor:"green",
        marginTop:40,
        marginLeft:20,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loginContainer: {
        minHeight: 150,
        marginLeft: 20,
        marginRight: 20,
    },
    username:{
        borderWidth:1,
    },
    password:{
        borderWidth:1,
    },
    header: {
        height:80,
        backgroundColor:"#0030db",
    },
    infobox: {
        padding:8,
        paddingLeft:10,
        marginTop:150,
        marginLeft:20,
        marginRight:20,
        shadowColor: "#000",
        shadowOffset:{
            width: 0,
            height: 12,
        },
        shadowOpacity: 1,
        shadowRadius: 16.00,
        elevation: 10,
        minHeight:100,
        backgroundColor:"lightgray",
        borderBottomWidth:2,
        borderColor:"#0030db",
    }
});