import React from "react"
import {AsyncStorage, Dimensions, StatusBar, StyleSheet, TouchableOpacity, View,Animated,Easing} from "react-native";
import {DailyView} from "../Components/DailyView"
import {TimeGrid} from "../Components/TimeGrid"
import {Calendar} from "react-native-calendars"
import {Ionicons, MaterialIcons,FontAwesome} from "@expo/vector-icons";
import {col} from './col';
import {LinearGradient} from "expo-linear-gradient";
import {getDayTimeTable} from "../../backend/modules/getTimeTable";
import {getGrid, getNewSession, getSchool, getSession} from "./StorageHandler";


class Main extends React.Component {
    constructor(props) {
        //AsyncStorage.clear()
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
            spinValue:new Animated.Value(0),
            icon:[
                <MaterialIcons key={"viewday"} name={"view-day"} size={32} color={"darkgray"}/>
            ],
            popup:[
            ],
            popupshown:false,
            iconTheme:"",
            selectedDay:"",
            gesture:true
        }
        this.animation = Animated.timing(
            this.state.spinValue,
            {
                toValue: 1,
                duration: 24000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        )
    }
    async componentDidMount() {
        let popup = [
            <LinearGradient
                colors={["rgb(30,30,30)", "rgb(15,15,15)"]}
                start={[-0.66,0]}
                style={styles.spinner}
                key={"gradient"}>
                <Animated.View style={{transform:[{rotate:this.state.spinValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '2880deg']
                        })}]}}>
                    <FontAwesome color={"white"} key={"spinner"} name={"spinner"} size={50} contentStyle={{backgroundColor: "rgba(1,1,1,0)"}}/>
                </Animated.View>
            </LinearGradient>
        ]
        this.setState({popup})
        this.animation.start()
        this.state.selectedDay = JSON.parse(await AsyncStorage.getItem("lastViewedDay"))
        let iconTheme = await AsyncStorage.getItem("iconTheme")
        if(iconTheme === null) iconTheme = "day"
        this.setState({iconTheme})
        await this.switchIcon()
        let view = (this.state.iconTheme === "day")? await this.renderDay(this.state.selectedDay):await this.renderWeek(this.state.selectedDay)
        this.setState({view})
    }

    changeCalendarVisibility(setter) {

            let calendar = []
            if(setter === true) {
                calendar.push(
                    <TouchableOpacity style={styles.calendarLayer} onPress={() => {this.changeCalendarVisibility(false)}}
                                                 key={"calendar"}>
                    <Calendar firstDay={1} style={styles.calendar} onDayPress={async (day) => {
                        await this.changeDay(day)
                    }}/>
                </TouchableOpacity>)

            }
            else calendar.push(<View key={"CalendarInvisible"}/>)
            this.setState({calendar})


    }
    async getTimeTable(day) {

        let school = await getSchool()
        if (school === null) {
            this.props.nav.navigate("SchoolSearch")
            return
        }


        let session = await getSession()
        if (session === null) {
            this.props.nav.navigate("SchoolSearch")
            return
        }

        let grid = await getGrid(school)

        let timeTableData = await getDayTimeTable(day, session, school)
        if(timeTableData.error || timeTableData === 400) return [grid,400]
        if (timeTableData.data.isSessionTimeout) {
            session = await getNewSession(school)
            if (session === null) this.props.nav.navigate("SchoolSearch")
            timeTableData = await getDayTimeTable(day, session, school)

        }

        return [grid,timeTableData]
    }
    async renderDay(day) {
        this.setState({popupshown:true})
        this.animation.start()
        let today = (day)? new Date(day.timestamp):new Date(Date.now())
        let date = new Date(today).toISOString().split("T")[0].replace("-","").replace("-","")
        let data = await this.getTimeTable(date)
        if(!data) return []
        this.setState({popupshown:false})
        this.animation.stop()
        return [<DailyView key={date} day={date} timeTable={data[1]} grid={data[0]} x={0} />]
    }
    async renderWeek(day) {
        this.setState({popupshown:true})
        this.animation.start()
        let today = (day)? new Date(day.timestamp):new Date(Date.now())
        let week = []
        for(let i=0;i<5;i++) {

            week.push(new Date(today - ((today.getDay() - 1 - i) * 86400000)).toISOString().split("T")[0].replace("-","").replace("-",""))

        }
        let view = []
        let x= 0
        for(const date of week) {

            let data = await this.getTimeTable(date)
            if(!data) return []
            view.push(<DailyView key={date} day={date} timeTable={data[1]} grid={data[0]} x={x}/>)
            x++
        }
        this.setState({popupshown:false})
        this.animation.stop()
        return view
    }
    async changeDay(day) {
        this.state.selectedDay = day
        AsyncStorage.setItem("lastViewedDay", JSON.stringify(day))
        this.changeCalendarVisibility(false)

        let view = (this.state.iconTheme === "day") ? await this.renderDay(day) : await this.renderWeek(day)
        this.setState({view})

    }
    async switchIcon() {
        let icon = (this.state.iconTheme === "week")?
            [<MaterialIcons key={"viewweek"} name={"view-week"} size={32} color={"darkgray"}/>]
            :
            [<MaterialIcons key={"viewday"} name={"view-day"} size={32} color={"darkgray"}/>]
        this.setState({icon})
    }
    render() {
        let touchstartX = 0;
        let touchendX = 0;

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
                    <View style={styles.smallTTContainer} key={1} onTouchStart={(event) => {
                        touchstartX = event.nativeEvent.pageX;
                    }}
                          onTouchEnd={async (event) => {
                              touchendX = event.nativeEvent.pageX;
                              if(this.state.gesture) {
                                  if (touchendX < touchstartX && touchstartX - touchendX > 50) {
                                      let amount = (this.state.iconTheme === "day") ? 1 : 7
                                      let day = {
                                          dateString: undefined,
                                          timestamp: (this.state.selectedDay !== null)? this.state.selectedDay.timestamp + amount * 86400000:Date.now() + amount * 86400000
                                      }
                                      await this.changeDay(day)
                                  } else if (touchendX > touchstartX && touchendX - touchstartX > 50) {
                                      let amount = (this.state.iconTheme === "day") ? 1 : 7
                                      let day = {
                                          dateString: undefined,
                                          timestamp: (this.state.selectedDay !== null)? this.state.selectedDay.timestamp - amount * 86400000:Date.now() - amount * 86400000
                                      }
                                      await this.changeDay(day)
                                  }
                              }
                          }}>


                        {
                            this.state.view.map((key) => {
                                return key
                            })
                        }
                        {
                            this.state.popupshown? this.state.popup.map((key) => {
                                return key
                            }): this.state.popup.map((key) => {})
                        }
                    </View>

                </View>
                <View style={styles.buttonTrayBottom}>
                    <LinearGradient
                        colors={["rgb(30,30,30)", "rgb(15,15,15)"]}
                        start={[-0.66,0]}
                        style={styles.buttonTrayBottom}>
                    <TouchableOpacity onPress = {async () => {


                        this.state.iconTheme = (this.state.iconTheme === "day") ? "week" : "day"
                        let view = (this.state.iconTheme === "day")? await this.renderDay(this.state.selectedDay):await this.renderWeek(this.state.selectedDay)
                        this.setState({view})
                        await this.switchIcon()
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
    spinner:{
        position:"absolute",
        left: "27%",
        top: "40%",
        padding:15,
        borderRadius:25,
    },
    timeGridBlock:{
        borderColor: col.grey,
        marginBottom:-0.167,
        borderBottomWidth:0.167,
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
        paddingLeft:13,
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
