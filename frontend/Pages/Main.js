import React from "react"
import {AsyncStorage, Dimensions, StatusBar, StyleSheet, TouchableOpacity, View} from "react-native";
import {DailyView} from "./Components/DailyView"
import {TimeGrid} from "./Components/TimeGrid"
import {Calendar} from "react-native-calendars"
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {col} from './col';
import {LinearGradient} from "expo-linear-gradient";

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
            ],
            icon:[
                <MaterialIcons key={"viewday"} name={"view-day"} size={32} color={"darkgray"}/>
            ],
            iconTheme:"",
            selectedDay:"",
        }
    }
    async componentDidMount() {
        this.state.selectedDay = JSON.parse(await AsyncStorage.getItem("lastViewedDay"))
        let iconTheme = await AsyncStorage.getItem("iconTheme")
        if(iconTheme === null) iconTheme = "day"
        this.setState({iconTheme})
        let view = (this.state.iconTheme === "day")? this.renderDay(this.state.selectedDay):this.renderWeek(this.state.selectedDay)
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
    renderDay(day) {
        day = day.dateString
        if(day === undefined) day = new Date(Date.now()).toISOString().split("T")[0]
        let date = day.split("-")[0]+day.split("-")[1]+day.split("-")[2]
        return [<DailyView key={date} day={date}/>]
    }
    renderWeek(day) {
        let today = new Date(day.timestamp)
        let week = []
        for(let i=0;i<5;i++) {

            week.push(new Date(today - ((today.getDay() - 1 - i) * 86400000)).toISOString().split("T")[0].replace("-","").replace("-",""))

        }
        console.log(week)
        let view = []
        week.forEach(date => {
            view.push(<DailyView key={date} day={date}/>)
        })

        return view
    }
    changeDay(day) {
        this.state.selectedDay = day
        AsyncStorage.setItem("lastViewedDay",JSON.stringify(day))
        this.changeCalendarVisibility(false)

        let view = (this.state.iconTheme === "day")? this.renderDay(day):this.renderWeek(day)
        this.setState({view})

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
                <View style={styles.buttonTrayBottom}>
                    <LinearGradient
                        colors={["rgb(30,30,30)", "rgb(15,15,15)"]}
                        start={[-0.66,0]}
                        style={styles.buttonTrayBottom}>
                    <TouchableOpacity onPress = {async () => {

                        let icon = (this.state.iconTheme === "week")?
                            [<MaterialIcons key={"viewday"} name={"view-day"} size={32} color={"darkgray"}/>]
                            :
                            [<MaterialIcons key={"viewweek"} name={"view-week"} size={32} color={"darkgray"}/>]


                        this.setState({icon})
                        this.state.iconTheme = (this.state.iconTheme === "day") ? "week" : "day"

                        let view = (this.state.iconTheme === "day")? this.renderDay(this.state.selectedDay):this.renderWeek(this.state.selectedDay)
                        this.setState({view})

                        await AsyncStorage.setItem("iconTheme",(this.state.iconTheme === "day") ? "day" : "week")

                    }} >

                        {
                            this.state.icon.map((key) => {
                                return key
                            }
                        )}
                    </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonTrayBottom: {
      position:"absolute",
        right:10,
        bottom:20,
        padding:10,
        borderRadius: 26,
    },
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
        margin: 6,
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
