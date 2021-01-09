import React from "react"
import {AsyncStorage, StyleSheet, Text, View,TouchableOpacity} from "react-native";
import {getSchool,getSession,getNewSession,getGrid} from "../StorageHandler"
import {col} from '../col';

export class TimeGrid extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = this.props.navigation
        this.state = {
            timeGrid:[],
            calendarVisible:false
        }
    }
    renderTimeGrid(TimeGrid) {
        let rows = TimeGrid.data.rows
        let endTime = 755;
        let timeGridLeft = []

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].startTime === endTime) {
                timeGridLeft.push(
                    <View style={styles.timeGridBlock} key={endTime}>
                        <Text key={0} style={[styles.startTime,styles.text]}> {rows[i].startTime}</Text>
                        <Text key={1} style={[styles.periodNumber,styles.text]}> {rows[i].period}</Text>
                        <Text key={2} style={[styles.endTime,styles.text]}> {rows[i].endTime}</Text>
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

        let nav = this.props.navigation

        let school = await getSchool()
        if(school=== null) {
            this.props.nav.navigate("SchoolSearch")
            return
        }

        let session = await getSession()
        if(session === null) {
            this.props.nav.navigate("SchoolSearch")
            return
        }

        let grid = await getGrid(school)
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

const styles = StyleSheet.create({

    breakBlock: {
        height:15,
        marginBottom:-0.167,
        borderBottomWidth: 0.167,
        borderRightWidth:0.5,
        borderColor: col.grey,
    },
    timeGridBlock:{
        marginTop:-0.167,
        marginBottom:-0.167,
        borderColor: col.grey,
        borderBottomWidth:0.167,
        borderRightWidth:0.5,
        flex:1,
        flexDirection: "column",
        justifyContent: "center",
    },
    startTime:{
        color: col.white,
        fontSize: 10,
        textAlign:"right",
        paddingRight: 5,
    },
    endTime:{
        color: col.white,
        fontSize: 10,
        textAlign:"right",
        paddingRight: 5,
    },
    periodNumber: {
        color: col.white,
        position: "absolute",
        textAlign:"left",
        fontSize:13,
        paddingLeft: 2,
        fontWeight: "bold",
    },
    icon: {
        paddingLeft:20,
        color: col.white,
    },
})