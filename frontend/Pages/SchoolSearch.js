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
import {useCardAnimation} from "@react-navigation/stack";
import {ScrollView} from "react-native-web";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
const ss = require("../backend/modules/schoolSearch")
const l = require("../backend/modules/accountHandling")

class SchoolSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textInput: [],
        }
    }
    addTextInput = async (key, text) => {
        try {
            let textInput = []

            let a = await ss.searchSchool(text).then(res => {
                return res.data
            }).catch(e => {
            })
            if (a.error || a.result.schools.length > 5) {
                textInput.push(
                    <View style={styles.schoolContainer} key={key}>
                        <Text style={styles.searchError}>Too many results, please be more specific</Text>
                    </View>,
                );
            } else if (a.result.schools.length < 5) {
                a.result.schools.forEach(school => {
                    key = key + 1
                    textInput.push(
                        <TouchableOpacity style={styles.schoolContainer} key={key} onPress={async (event) => {
                            await AsyncStorage.setItem("School", JSON.stringify(school));
                            let sessions = JSON.parse(await AsyncStorage.getItem('sessions'))
                            let sessionFound = false
                            let updated = false
                            if(sessions !== undefined && sessions !== null){
                                sessions.forEach(session => {
                                    if (session[0] === school.schoolId) {
                                        sessionFound = true;
                                    }
                                })
                            }else {
                                sessions = []
                            }
                            let cookies = await l.getCookies(school.serverUrl)
                            if (cookies!= null && cookies[0] !== undefined) {
                                if(sessionFound) {
                                    sessions.forEach(session => {
                                        if (session[0] === school.schoolId) session[1] = cookies
                                        updated = true;
                                    })
                                }
                                else sessions.push([school.schoolId, cookies])
                                await AsyncStorage.setItem("sessions", JSON.stringify(sessions));
                                this.props.navigation.navigate('LoginScreen')
                            } else if (sessionFound) {
                                await AsyncStorage.setItem("sessions", JSON.stringify(sessions));
                                this.props.navigation.navigate('LoginScreen')
                            } else {
                                alert("Couldn't create session")
                            }


                        }}>
                            <Text style={styles.schoolContainerTop}>{school.displayName}</Text>
                            <Text style={styles.schoolContainerBottom}>{school.address}</Text>
                        </TouchableOpacity>
                    );
                })
            }
            this.setState({textInput})
        } catch (e) {
            console.log(e)
        }
    }


    render(){
        return(
            <View style={styles.container}>
                <LinearGradient 
                    colors={["rgb(50,50,50)", "rgb(20,20,20)"]}
                    start={[-0.66,0]}
                    style={styles.gradient}>
                
                <View style = {styles.header}></View>
                <View style={styles.button}>
                    <TextInput style={styles.input}placeholderTextColor = "rgb(150,150,150)" placeholder='Search for your school' onChangeText={(text) => {
                        this.addTextInput(this.state.textInput.length,text)
                    }
                    }
                    />
                    <Ionicons style={styles.icon} name={"md-search"} size={32} color={"black"}/>
                </View>
                {
                    this.state.textInput.map((value, index) => {
                        return value
                    })
                }
                </LinearGradient>
            </View>
        )
    }
}

export default SchoolSearch;

const styleVars = {
    backroundColor: "rgb(20,20,20)",
    secondaryColor: "rgb(60,60,60)",
    thirdColor: "rgb(75,75,75)",
    whiteColor:  "rgb(226, 226, 226)",
    accentColor: "rgb(225,63,85)",
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: styleVars.backroundColor,
    },
    gradient:{
        width: '100%',
        height: '100%',
    },
    button: {
        padding:8,
        paddingLeft:10,
        marginTop:200,
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
        minHeight:50,
        backgroundColor: styleVars.secondaryColor,
        borderRadius:3,
    },
    input:{
        fontSize:20,
        color: styleVars.whiteColor,
        
    },
    searchError: {
        textAlign:"center",
        padding:3,
        maxHeight: 200,
        fontSize:15,
        fontWeight: "bold",
        color: styleVars.whiteColor,
    },
    schoolContainer: {
        maxHeight:200,
        marginLeft: 20,
        marginRight: 20,
    },
    schoolContainerTop: {
        borderTopLeftRadius:3,
        borderTopRightRadius:3,
        marginTop: 2,
        padding:3,
        maxHeight: 200,
        backgroundColor:styleVars.thirdColor,
        fontSize:20,
        fontWeight: "bold",
        color: styleVars.whiteColor,

    },
    schoolContainerBottom: {
        borderBottomLeftRadius:3,
        borderBottomRightRadius:3,
        padding:3,
        maxHeight:170,
        backgroundColor: styleVars.secondaryColor,
        fontSize:14,
        color: styleVars.whiteColor,
    },
    header: {
        height:80,

        backgroundColor: styleVars.secondaryColor,
    },
    icon: {
        position: 'absolute',
        right: 10,
        padding:8,
        color:"#fff",

    }
});