import React from "react"
import {AsyncStorage, StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions} from "react-native";
import {DailyView} from "./Components/DailyView"
import {TimeGrid} from "./Components/TimeGrid"
import {Calendar, CalendarList,Agenda} from "react-native-calendars"
import {Ionicons} from "@expo/vector-icons";
import {col} from './col';
import Day from "react-native-calendars/src/calendar/day";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calendar: [

            ],
            days:[

            ],
            daysForView: [
            ],
            view:[
            ]
        }
    }
    async componentDidMount() {
        let view = []
        let lastDay = JSON.parse(await AsyncStorage.getItem("lastViewedDay"))
        if(lastDay === null || lastDay === undefined) lastDay = new Date().toISOString().split('T')[0].replace("-", "").replace("-", "")
        console.log("LAST DAY")
        console.log(lastDay)
        view.push(<DailyView key={0} day={lastDay}/>)

        this.setState({view})
    }

    changeCalendarVisibility(setter) {

            let calendar = []
            if(setter === true) {
                calendar.push(
                    <TouchableOpacity style={styles.calendarLayer} onPress={() => {this.changeCalendarVisibility(false)}}
                                                 key={"calendar"}>
                    <Calendar style={styles.calendar} onDayPress={(day) => {
                        this.changeDay(day)
                    }}/>
                </TouchableOpacity>)

            }
            else calendar.push(<View key={"CalendarInvisible"}/>)
            this.setState({calendar})


    }
    changeDay(day) {
        let daysForView = []
        daysForView.push(day.dateString)
        this.setState({daysForView})

        let view = []

        daysForView.forEach(day =>  {
            let date = day.split("-")[0]+day.split("-")[1]+day.split("-")[2]
            view.push(<DailyView key={date} day={date}/>)
            AsyncStorage.setItem("lastViewedDay",JSON.stringify(date))
        })

        this.setState({view})
        this.changeCalendarVisibility(false)
    }
    render() {
        return(
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <View style={styles.header} key={32}>
                    <TouchableOpacity onPress={
                        async () => {
                            this.props.navigation.openDrawer()
                        }}>
                        <Ionicons name="md-options" style={styles.icon} size={32}/>
                    </TouchableOpacity>
                </View>
                {
                    this.state.calendar.map(key => {
                        return key
                    })
                }
                {
                    this.state.days.map((key) => {
                        return key
                    })
                }
                <View style={styles.ttContainer}>
                    <View style={styles.LeftBar} key={0}>
                        <TouchableOpacity style={styles.timeGridBlock}  key={65} onPress={() => {
                            this.changeCalendarVisibility(true)
                        }}>
                            <Ionicons name="md-calendar" style={[styles.icon,{paddingBottom:15}]} size={32}/>
                        </TouchableOpacity>
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

const styles = StyleSheet.create({
    calendarLayer: {
        position: "absolute",
        zIndex: 99,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    calendar: {
        position:"absolute",
        left:30,
        top:20,
        zIndex:100,
    },
    dailyView: {
        flex:1,
    },
    timeGridBlock:{
        borderColor: col.grey,
        borderBottomWidth:0.5,
        borderRightWidth:0.5,
        flex:1,
        flexDirection: "column",
        justifyContent: "center",
    },
    header: {
        height:60,
        backgroundColor: col.headerCol,
    },
    icon: {
        paddingTop:15,
        paddingLeft:20,
        color: col.white,
    },
    ttContainer: {
        backgroundColor: col.secbg,
        flexDirection: "row",
        flex:1,
        borderRadius:3,
    },
    smallTTContainer: {
        backgroundColor: col.secbg,
        borderTopRightRadius:6,
        borderBottomRightRadius:7,
        flexDirection: "row",
        flex:5/6,
    },
    LeftBar: {
        backgroundColor: col.secbg,
        flex:1/6,
        borderTopLeftRadius:6,
        borderBottomLeftRadius:6,
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
        backgroundColor: col.mainbg,
    },

})

export default Main
