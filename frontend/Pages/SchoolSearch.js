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
const ss = require("../backend/modules/schoolSearch.js")

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
                    console.log(e)
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

                                this.props.navigation.navigate('LoginScreen')
                            }}>
                                <Text style={styles.schoolContainerTop}>{school.displayName}</Text>
                                <Text style={styles.schoolContainerBottom}>{school.address}</Text>
                            </TouchableOpacity>
                        );
                    })
                }
                this.setState(textInput)
            } catch (e) {
                console.log(e)
            }
        }
    
    render(){
        return(
            <View style={styles.container}>
                <View style = {styles.header}></View>
                <View style={styles.button}>
                    <TextInput style={styles.input} placeholder='Search for your school' onChangeText={(text) => {
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
            </View>
        )
    }
}

export default SchoolSearch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        backgroundColor:"lightgray",
        borderBottomWidth:2,
        borderColor:"#0030db",
    },
    input:{
        fontSize:20,
    },
    searchError: {
        textAlign:"center",
        padding:3,
        maxHeight: 200,
        fontSize:15,
        fontWeight: "bold"
    },
    schoolContainer: {
        maxHeight:200,
        marginLeft: 20,
        marginRight: 20,
    },
    schoolContainerTop: {
        borderTopWidth:1,
        padding:3,
        maxHeight: 200,
        backgroundColor:"#91cfff",
        fontSize:20,
        fontWeight: "bold"
    },
    schoolContainerBottom: {
        padding:3,
        maxHeight:170,
        backgroundColor: "#cfeaff",
        fontSize:14,
    },
    header: {
        height:80,
        backgroundColor:"#0030db",
    },
    icon: {
        position: 'absolute',
        right: 10,
        padding:8,
    }
});