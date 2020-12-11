import React from 'react';
import {
    AsyncStorage,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Text,
    View,
    StatusBar,
} from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
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
        const sessions = JSON.parse(await AsyncStorage.getItem('sessions'))
        console.log(sessions)
        if (value !== null) {
            data.push([
                <View key={0}><Text style={styles.infoTop} >{value.displayName}</Text></View>,
                <View key={1}><Text style={styles.infoBot} >{value.address}</Text></View>,
            ])
        }
        this.setState({data})
    }
    login = async (key) => {
        let cookies = [undefined]
        const value = JSON.parse(await AsyncStorage.getItem('School'));
        const sessions = JSON.parse(await AsyncStorage.getItem('sessions'));

        sessions.forEach(session => {
            if(session[0] === value.schoolId) cookies = session[1]
        })

        if(cookies[0] === undefined) {
            alert("Session not found")
            this.props.navigation.navigate("SchoolSearch")
        }

        let valid = [];
        let invalidIn = [
            <View style={styles.invalidIn} key={key}>
                <Text style={styles.invalidText}>Invalid username or password!</Text>
            </View>
        ]

        if(this.state.username !== "" && this.state.password !== "") {
            let url = value.serverUrl.split("?")[0] + "/j_spring_security_check"
            console.log(url)
            l.login(url,value,cookies[0],cookies[1],cookies[3],this.state.username,this.state.password).then(r => {
                switch(r.state) {
                    case "SUCCESS":
                        alert("Login success")
                        break;
                    case "LOGIN_ERROR":
                        valid = invalidIn
                        break;
                }
            })
        }
        else {
            valid = invalidIn
        }
        this.setState({valid})
    }
    render(){
       return (
           

                <View style={styles.container} key={0}>
                    <StatusBar  barStyle="light-content" hidden={true} translucent={true} />
                    <LinearGradient 
                        colors={["rgb(60,60,60)", "rgb(15,15,15)"]}
                        start={[-0.66,0]}
                        style={styles.gradient}>
                    
                    <View style={styles.header}>
                        <TouchableOpacity onPress={async () => {
                            await AsyncStorage.removeItem("School")
                            console.log(await AsyncStorage.getAllKeys())
                            this.props.navigation.navigate("SchoolSearch")
                        }}>
                            <Ionicons name="md-arrow-back" style={styles.icon} size={32}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infobox}>
                        {
                        this.state.data.map((key) => {
                            return key
                        })
                        }
                    </View>
                    <View style={styles.loginContainer}>
                        <TextInput style={styles.username} placeholderTextColor = "rgb(150,150,150)" placeholder = "Username" onChangeText = {(text) => this.setState({username: text})}/>
                        <TextInput style={styles.password} placeholderTextColor = "rgb(150,150,150)" placeholder = "Password" onChangeText = {(password) => this.setState({password: password})}/>
                        {
                        this.state.valid.map((value) => {
                            return value
                        })
                    }
                        <LinearGradient  //Login Button + Gradient
                        //colors={["rgb(163,32,50)", "rgb(225,63,85)"]}
                        colors={["rgb(53,130,55)", "rgb(62,156,65)"]}
                        start={[1,0]}
                        style={styles.buttonGradient}>
                        <TouchableOpacity styles={styles.loginButton} onPress = {(key) => {
                            this.login(key).catch(e => console.log(e))
                        }}>
                            <Text style={styles.loginButton}>Login</Text>
                        </TouchableOpacity>
                        </LinearGradient>

                    </View>
                    </LinearGradient>

                </View>
            )
    }
}
/* Replaced with Touchable Opacity for styling
<Button color="rgb(225,63,85)" title = "Login" onPress = {(key) => {
    this.login(key)
}}/>
*/
export default LoginScreen;

const styleVars = {
    backroundColor: "rgb(20,20,20)",
    secondaryColor: "rgb(60,60,60)",
    thirdColor: "rgb(75,75,75)",
    whiteColor:  "rgb(226, 226, 226)",
    accentColor: "rgb(62,156,65)",
}
  
const styles = StyleSheet.create({
    backArrow: {
        padding:20,
        //backgroundColor: styleVars.whiteColor,
        color: styleVars.whiteColor,
        marginTop:40,
        marginLeft:20,
        
    },
    gradient:{
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: styleVars.backroundColor,
    },
    loginContainer: {
        minHeight: 150,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 100,
        alignItems: "center",
    },
    icon: {
        paddingTop:15,
        paddingLeft:20,
        color: styleVars.whiteColor,
    },
    username:{
        width: "80%",
        fontSize: 20,
        height: 40,
        paddingLeft:5,
        borderRadius: 3,
        backgroundColor: styleVars.secondaryColor,
        color: styleVars.whiteColor,
    },
    password:{
        width: "80%",
        fontSize: 20,
        height:40,
        marginTop: 7,
        marginBottom: 30,
        paddingLeft:5,
        borderRadius: 3,
        backgroundColor: styleVars.secondaryColor,
        color: styleVars.whiteColor,
    },
    loginButton:{
        padding: 5,
        paddingHorizontal: 35,
        width: "100%",
        fontSize: 23,
        borderRadius: 90,
        textAlign: "center",
        color: styleVars.whiteColor,
        //backgroundColor: "rgba(100,100,100,0.5)",
    },
    buttonGradient:{
        marginTop: 20,
        borderRadius: 90,
    },
    header: {
        height:60,
        backgroundColor: styleVars.secondaryColor,
    },
    infobox: {
        justifyContent:"center",
        alignItems:"center",
        padding:8,
        paddingLeft:10,
        marginTop:25,
        marginLeft:20,
        marginRight:20,
        marginBottom:75,
        minHeight:100,
        //backgroundColor:styleVars.secondaryColor,
        borderRadius: 3,

    },
    infoTop: {
        fontSize:20,
        color: styleVars.whiteColor,
    },
    infoBot: {
        fontSize:16,
        color: styleVars.whiteColor,
    },
    invalidIn:{
        position: "absolute",
        left: "50%",
        bottom: "29%",
        
    },
    invalidText:{
        position: "relative",
        left: "-50%",
        color: styleVars.whiteColor,
        backgroundColor: styleVars.secondaryColor,
        borderRadius:3,
        padding:6,
        paddingHorizontal:10,
        fontSize: 15,
    },
});