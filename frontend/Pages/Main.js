import React from "react"
import {AsyncStorage, StyleSheet, Text, View} from "react-native";
import t from "../backend/modules/getTimeTable"
import l from "../backend/modules/accountHandling"

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeGridLeft: [
            ],
            days: [

            ]
        }
    console.log("Main")
    }
    async getGrid(school,session) {
        return await t.getTimeGrid(school,session).then(r => {return r})
    }
    async login(school){
        let creds = JSON.parse(await AsyncStorage.getItem("Creds"))
        console.log(creds)
        if(creds === undefined || creds === null || creds.username === null || creds.password === null || creds.username === undefined || creds.password === undefined) {
            await AsyncStorage.setItem("Session","LOGGED_OUT")
            this.props.navigation.navigate("LoginScreen")
        }
        else {
            return l.login(school.serverUrl, creds.username, creds.password);
        }
    }
    async componentDidMount() {
        let school = JSON.parse(await AsyncStorage.getItem("School"))
        let session = await AsyncStorage.getItem("Session");
        //let TimeTable = await t.getTimeTable(school.serverUrl, session.sessionId, school.loginName)
        let TimeGrid = await this.getGrid(school,session)
        if(TimeGrid.error && TimeGrid.error.message === "not authenticated") {
            session = await this.login(school)
            TimeGrid = await this.getGrid(school, session)
        }
        this.renderTimeGrid(TimeGrid);

        this.renderDays(new Date())


    }
    renderDays(date) {
        console.log("Rendered time")
        let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        let startingDay = new Date(date.setDate(diff)).getTime()

        let days = [
            <View key={99} style={styles.topLeft}/>
        ]


        for(let i = 0; i<5;i++) {
            let s = new Date(startingDay + (i * 3600000 * 24)).toLocaleString().split(",")[0].split("/")
        let d = s[1]
            let m = s[0]
            let y = s[2]
            days.push(
                <View key={i} style={styles.date}>
                    <Text style = {styles.dateText}>{d}/{m}/{y}</Text>
                </View>
            )

        }
        this.setState({days})
    }
    renderTimeGrid(TimeGrid) {
        let data = TimeGrid.data
        let rows = data.rows
        let endTime = 755;
        let timeGridLeft = []
        for(let i =0;i<rows.length;i++) {
            console.log("Pushing")
            console.log(rows[i].endTime)
            if(rows[i].startTime === endTime) {
                timeGridLeft.push(
                    <View style={styles.timeGridBlock} key={rows[i].period}>
                        <Text key={0} style={styles.startTime}> {rows[i].startTime}</Text>
                        <Text key={1} style={styles.periodNumber}> {rows[i].period}.</Text>
                        <Text key={2} style={styles.endTime}> {rows[i].endTime}</Text>
                    </View>
                )
                endTime = rows[i].endTime
            }
            else {
                timeGridLeft.push(
                    <View style={styles.breakBlock}/>
                )
                i--
                endTime = rows[i+1].startTime
            }

        }
        this.setState({timeGridLeft})
    }
    render() {
        return(
            <View style={styles.container}>
                <View style={styles.header}/>
                <View style={styles.TopBar}>
                    {
                        this.state.days.map((key) => {
                            return key
                        })
                    }
                </View>
                <View style={styles.ttContainer}>
                    <View style={styles.LeftBar}>
                            {
                                this.state.timeGridLeft.map((key) => {
                                    return key
                                })
                            }
                        </View>
                        <View style={styles.smallTTContainer}>

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
        backgroundColor:"black",
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