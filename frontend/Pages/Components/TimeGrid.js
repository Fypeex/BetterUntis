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
    accentColor: "rgb(83, 139, 85)",
}
const styles = StyleSheet.create({

    breakBlock: {
        height:10,
        backgroundColor: styleVars.backroundColor,
        borderTopWidth: 0.4,
        borderTopColor: styleVars.whiteColor,
    },
    timeGridBlock:{
        flex:1,
        flexDirection: "column",
        justifyContent: "center",
        borderTopWidth: 0.4,
        borderColor: styleVars.whiteColor,
        backgroundColor: styleVars.secondaryColor,
    },
    startTime:{
        fontSize: 12,
        textAlign:"right",
        color: styleVars.whiteColor,
        paddingRight: 5,
    },
    endTime:{
        fontSize: 12,
        textAlign:"right",
        color: styleVars.whiteColor,
        paddingRight: 5,
    },
    periodNumber: {
        position: "absolute",
        textAlign:"left",
        fontSize:13,
        color: styleVars.whiteColor,
        paddingLeft: 2,
    },
})