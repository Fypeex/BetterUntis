import React from "react"
import {AsyncStorage, StyleSheet, Text, View} from "react-native";
import {getSchool,getSession,getNewSession,getGrid} from "../StorageHandler"

export class TimeGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timeGrid:[]
        }
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
        await AsyncStorage.removeItem("School")
        console.log("Props: ")
        this.props.navigation.navigate("LoginScreen")
        let school = await getSchool(this.props.navigation)
        let session = await getSession(this.props.navigation)
        let grid = await getGrid(this.props.navigation,school,session)
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