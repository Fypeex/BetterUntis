import React from "react"
import t from "../../backend/modules/getTimeTable";
import {AsyncStorage, StyleSheet, Text, View} from "react-native";
import l from "../../backend/modules/accountHandling";

export class TimeGrid extends React.Component {
    constructor(p) {
        super(p);

        this.state = {
            timeGrid:[]
        }
    }
    async login(school){
        let creds = JSON.parse(await AsyncStorage.getItem("Creds"))
        if(creds === undefined || creds === null || creds.username === null || creds.password === null || creds.username === undefined || creds.password === undefined) {
            await AsyncStorage.setItem("Session","LOGGED_OUT")
            this.props.navigation.navigate("LoginScreen")
        }
        else {
            return l.login(school.serverUrl, creds.username, creds.password);
        }
    }
    async getGrid(school,session) {
        let grid = JSON.parse(await AsyncStorage.getItem("timeGrid"))
        if(grid === undefined || grid === null) {
            grid = await t.getTimeGrid(school, session).then(r => {
                return r
            })
        }
        await AsyncStorage.setItem("timeGrid",JSON.stringify(grid))

        return grid
    }
    renderTimeGrid(TimeGrid) {
        let rows = TimeGrid.data.rows
        let endTime = 755;
        let timeGridLeft = [
            <View style={styles.timeGridBlock} key={65}/>
            ]
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].startTime === endTime) {
                timeGridLeft.push(
                    <View style={styles.timeGridBlock} key={endTime}>
                        <Text key={0} style={styles.startTime}> {rows[i].startTime}</Text>
                        <Text key={1} style={styles.periodNumber}> {rows[i].period}.</Text>
                        <Text key={2} style={styles.endTime}> {rows[i].endTime}</Text>
                    </View>
                )
                endTime = rows[i].endTime
            } else {
                timeGridLeft.push(
                    <View style={styles.breakBlock} key={endTime}/>
                )
                i--
                endTime = rows[i + 1].startTime
            }

        }

        return timeGridLeft
    }
    async componentDidMount() {
        let school = JSON.parse(await AsyncStorage.getItem("School"))
        let session = JSON.parse(await AsyncStorage.getItem("Session"));


        let grid = await this.getGrid(school,session)
            if(grid.error && grid.error.message === "not authenticated") {
                let session = await this.login(school)
                grid = await this.getGrid(school, session)
            }

        let timeGrid = this.renderTimeGrid(grid)
        this.setState({timeGrid})

    }
    render() {
        return (
            this.state.timeGrid.map((key) => {
                return key
                })
        );
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
        flex:1,
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