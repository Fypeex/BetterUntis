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
const l = require("../backend/modules/accountHandling")

class LoginScreen extends React.Component {
    constructor(props){
        super(props);
            this.state = {
                valid:[],
                data: [],
                isLoggedIn : false,
                username :"",
                password : ""
            };
        }
    async componentDidMount() {
        //AsyncStorage.clear()
        let data = [];
        const value = JSON.parse(await AsyncStorage.getItem('School'));
        if (value !== null) {
            data.push([
                <View key={0}><Text style={styles.infoTop} >{value.displayName}</Text></View>,
                <View key={1}><Text style={styles.infoBot} >{value.address}</Text></View>,
            ])
        }
        this.setState({data})
    }
    login = async (key) => {
        const value = JSON.parse(await AsyncStorage.getItem('School'));

        let valid = [];
        let invalidIn = [
            <View key={key}>
                <Text>Invalid username or password</Text>
            </View>
        ]
        let validIn = [
            <View key={key}>
                <Text>Logging in</Text>
            </View>
        ]

        if(this.state.username !== "" && this.state.password !== "") {
            let url = value.serverUrl.split("?")[0] + " j_spring_security_check"
            let school = value.loginName
            valid = validIn
        }
        else {
            valid = invalidIn
        }
        this.setState({valid})
    }
    render(){
       return (
                <View style={styles.container} key={0}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate("SchoolSearch")
                        }}>
                            <Ionicons name="md-arrow-back" style={styles.icon} size={32}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infobox}>
                        {
                        this.state.data.map((key,value) => {
                            return key
                        })
                        }
                    </View>
                    <View style={styles.loginContainer}>
                        <TextInput style={styles.username} placeholder = "Username" onChangeText = {(text) => this.setState({username: text})}/>
                        <TextInput style={styles.password} placeholder = "Password" onChangeText = {(password) => this.setState({password: password})}/>
                        {
                            this.state.valid.map((value, key) => {
                                return value
                            })
                        }
                        <Button title = "Test" onPress = {(key) => {
                            this.login(key)
                        }}/>
                    </View>

                </View>
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
    icon: {
        paddingTop:40,
        paddingLeft:20,
    },
    username:{
        borderWidth:1,
        paddingLeft:15,
    },
    password:{
        borderWidth:1,
        paddingLeft:15,
    },
    header: {
        height:80,
        backgroundColor:"#0030db",
    },
    infobox: {
        justifyContent:"center",
        alignItems:"center",
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
    },
    infoTop: {
        fontSize:20,

    },
    infoBot: {
        fontSize:16,
    }
});