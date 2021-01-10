import React from "react"
import {StyleSheet, Text, TouchableOpacity, View,Switch} from "react-native";
import {Ionicons} from "@expo/vector-icons";

class Settings extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: false
        };
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header} key={32}>
                    <TouchableOpacity onPress={
                        async () => {
                            this.props.navigation.openDrawer()
                        }}>
                        <Ionicons name="md-options" style={styles.icon} size={32}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
export default Settings


const styleVars = {
    backroundColor: "rgb(20,20,20)",
    secondaryColor: "rgb(60,60,60)",
    thirdColor: "rgb(75,75,75)",
    fourthColor: "rgb(100,100,100)",
    whiteColor:  "rgb(226, 226, 226)",
    accentColor: "rgb(83, 139, 85)",
}
const styles = StyleSheet.create({
    lesson: {
        margin:5,
        flex:1,
    },
    day: {
        flex:1,
    },
    timetable:{
        borderWidth: 1,
        flex:1,
    },
    date:{
        backgroundColor: styleVars.backroundColor,
        flex:1,
        borderWidth: 0.4,
        borderColor: styleVars.whiteColor,
        borderRightWidth: 0,
        borderBottomWidth:0,
    },
    dateText: {
        paddingLeft: 7.5,
        paddingTop: 3,
        color: styleVars.whiteColor,
        fontSize:25,
    },
    breakBlock: {
        backgroundColor: styleVars.backroundColor,
        height:10,

        borderWidth: 0.4,
        borderColor: styleVars.whiteColor,
        borderRightWidth:0,
    },
    timeGridBlock:{
        flex:1,
        backgroundColor: styleVars.secondaryColor,
        borderLeftWidth: 0.4,
        borderLeftColor: styleVars.whiteColor,

        borderTopWidth: 0.4,
        borderTopColor: "rgba(0,0,0,0)",
    },
    lessonInfo:{
        fontSize: 7,
    },
    icon:{
        paddingTop:30,
        paddingLeft:10,
    },
    buttonGradient:{
        marginTop: 20,
        borderRadius: 90,
    },
    startTime:{
        fontSize: 9,
        textAlign:"left",
    },
    ttContainer: {
        flexDirection: "row",
        flex:1,
    },
    smallTTContainer: {
        flexDirection: "row",
        flex:5/6,
    },
    TopBar: {
        flexDirection:"row",
        height:100,
    },
    LeftBar: {
        backgroundColor:"gray",
        flex:1/6,
    },
    gradient:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: styleVars.backroundColor,
    },

    header: {
        height:80,
        backgroundColor: styleVars.secondaryColor,
    }
})