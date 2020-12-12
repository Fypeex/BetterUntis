import React from "react"
import {AsyncStorage, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {weeklyView} from "./Components/WeeklyView"
import {DailyView} from "./Components/DailyView"
import {TimeGrid} from "./Components/TimeGrid"
import t from "../backend/modules/getTimeTable"
import l from "../backend/modules/accountHandling"

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
                <DailyView key={98}/>
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
                <View style={styles.header}/>
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
    accentColor: "rgb(225,63,85)",
}
const styles = StyleSheet.create({
    topLeft:{
        flex:1/6
    },
    buttonGradient:{
        marginTop: 20,
        borderRadius: 90,
    },
    breakBlock: {
        height:20,
        borderWidth:0.3,
    },
    timeGridBlock:{
        flex:1/13,
        borderWidth:0.8,
    },
    startTime:{
        fontSize: 9,
        textAlign:"left",
    },
    endTime:{
        fontSize: 9,
        textAlign:"right",
    },
    periodNumber: {
        textAlign:"center",
        fontSize:11,
    },
    ttContainer: {
        flexDirection: "row",
        flex:1,
    },
    smallTTContainer: {
        flexDirection: "row",
        flex:11/12,
    },
    TopBar: {
        flexDirection:"row",
        height:100,
        flex:0.1,
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
    timetable:{
        borderWidth: 1,
        flex:5/6,
    },
    lesson: {
        flex:1/5,
        borderWidth: 1,
    },
    text: {
        fontSize:10,
    },
    header: {
        height:80,
        backgroundColor: styleVars.secondaryColor,
    },
    date:{
        flex:1/6,
        borderWidth:0.3,
    },
    dateText: {
        color:"white",
        fontSize:8,
    }
})

export default Main