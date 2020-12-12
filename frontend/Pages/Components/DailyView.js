import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import React from "react";

export class DailyView extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            days:[]
        }
    }

    renderDays() {
        console.log("Rendered time")
        let startingDay = Date.now()
        let days = []




            let s = new Date(startingDay).toLocaleString().split(",")[0].split("/")
            let d = s[1]
            let m = s[0]
            let y = s[2]
            days.push(
                <View style={styles.TopBar}>
                    <TouchableOpacity key={0} style={styles.date}>
                        <Text style = {styles.dateText}>{d}/{m}/{y}</Text>
                    </TouchableOpacity>
                </View>
            )

        this.setState({days})
    }
    componentDidMount() {
        this.renderDays()
    }

    render() {
        return(
            this.state.days.map((key) => {
                return key
            })
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
        flex:1,
        height:100,
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