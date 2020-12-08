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
import { LinearGradient } from "expo-linear-gradient";
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
            <View style={styles.invalidIn} key={key}>
                <Text style={styles.invalidText}>Invalid username or password!</Text>
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
                    <LinearGradient 
                        colors={["rgb(50,50,50)", "rgb(20,20,20)"]}
                        start={[-0.66,0]}
                        style={styles.gradient}>
                    
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
                        <TextInput style={styles.username}placeholderTextColor = "rgb(150,150,150)" placeholder = "Username" onChangeText = {(text) => this.setState({username: text})}/>
                        <TextInput style={styles.password}placeholderTextColor = "rgb(150,150,150)" placeholder = "Password" onChangeText = {(password) => this.setState({password: password})}/>
                        {
                        this.state.valid.map((value, key) => {
                            return value
                        })
                    }
                        <LinearGradient  //Login Button + Gradient
                        //colors={["rgb(163,32,50)", "rgb(225,63,85)"]}
                        colors={["rgb(200,40,60)", "rgb(234,77,98)"]}
                        start={[1,0]}
                        style={styles.buttonGradient}>
                        <TouchableOpacity styles={styles.loginButton} onPress = {(key) => {
                            this.login(key)
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
    accentColor: "rgb(225,63,85)",
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
        paddingTop:40,
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
        fontSize: 27,
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
        height:80,
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
        shadowColor: "#fff",
        shadowOffset:{
            width: 0,
            height: 12,
        },
        shadowOpacity: 1,
        shadowRadius: 16.00,
        elevation: 10,
        minHeight:100,
        backgroundColor:styleVars.secondaryColor,
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