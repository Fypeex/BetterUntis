import React from "react"
import {AsyncStorage, StyleSheet, Text, View, TouchableOpacity, StatusBar} from "react-native";
import {weeklyView} from "./Components/WeeklyView"
import {DailyView} from "./Components/DailyView"
import {TimeGrid} from "./Components/TimeGrid"
import t from "../backend/modules/getTimeTable"
import l from "../backend/modules/accountHandling"
import {Ionicons} from "@expo/vector-icons";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeGridLeft: [
                <TimeGrid key={99}/>
            ],
            days: [

            ],
            view:[
                <DailyView key={98} day={20201209}/>
            ]
        }
    }
    async componentDidMount() {
        let school = JSON.parse(await AsyncStorage.getItem("School"))
        let session = JSON.parse(await AsyncStorage.getItem("Session"));
        //let TimeTable = await t.getTimeTable(school.serverUrl, session.sessionId, school.loginName)


    }
    render() {
        return(
            <View style={styles.container}>
                <StatusBar  barStyle="light-content" hidden={true} translucent={true} />
                <View style={styles.header} key={32}>
                    <TouchableOpacity onPress={
                        async () => {
                            await AsyncStorage.clear()
                            this.props.navigation.navigate("SchoolSearch")
                    }}>
                        <Ionicons name="md-arrow-back" style={styles.icon} size={32}/>
                    </TouchableOpacity>
                </View>
{
                        this.state.days.map((key) => {
                            return key
                        })
                    }
                <View style={styles.ttContainer}>
                    <View style={styles.LeftBar} key={0}>
                            <TimeGrid/>
                    </View>
                    <View style={styles.smallTTContainer} key={1}>
                        {
                            this.state.view.map((key) => {
                                return key
                            })
                        }
                    </View>

                </View>
            </View>
        )
    }
}


const styleVars = {
    backroundColor: "rgb(20,20,20)",
    secondaryColor: "rgb(60,60,60)",
    thirdColor: "rgb(75,75,75)",
    whiteColor:  "rgb(226, 226, 226)",
    accentColor: "rgb(83, 139, 85)",
}
const styles = StyleSheet.create({
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
        height:60,
        backgroundColor: styleVars.accentColor,
    }
})

export default Main