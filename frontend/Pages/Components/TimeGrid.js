import React from "react"
import {AsyncStorage, StyleSheet, Text, View} from "react-native";
import {getSchool,getSession,getNewSession,getGrid} from "../StorageHandler"
import {col} from '../col';

export class TimeGrid extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = this.props.navigation
        this.state = {
            timeGrid:[]
        }
    }
    renderTimeGrid(TimeGrid) {
        let rows = TimeGrid.data.rows
        let endTime = 755;
        let timeGridLeft = [<View style={styles.timeGridBlock}  key={65}/>]

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].startTime === endTime) {
                timeGridLeft.push(
                    <View style={(i === rows.length-1) ? styles.timeGridBlockBorder: styles.timeGridBlock} key={endTime}>
                        <Text key={0} style={styles.startTime}> {rows[i].startTime}</Text>
                        <Text key={1} style={styles.periodNumber}> {rows[i].period}</Text>
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
        borderBottomWidth: 0.5,
        borderRightWidth:0.5,
        borderColor: col.grey,
    },
    timeGridBlock:{
        borderColor: col.grey,
        borderBottomWidth:0.5,
        borderRightWidth:0.5,
        flex:1,
        flexDirection: "column",
        justifyContent: "center",
    },
    timeGridBlockBorder:{
        borderColor: col.grey,
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
})