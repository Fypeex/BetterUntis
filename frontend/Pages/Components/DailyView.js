import {Text, TouchableOpacity, View, StyleSheet,AsyncStorage} from "react-native";
import React,{Component} from "react";
import t, {getDayTimeTable} from "../../backend/modules/getTimeTable"
import {getSchool,getSession,getNewSession,getGrid} from "../StorageHandler"
export class DailyView extends Component{
    constructor(props) {
        super(props);
        let [m, d, y]    = new Date().toLocaleDateString("en-US").split("/")
        this.date = d+"/"+m+"/"+y
        this.day = "20"+y+m+d
        this.state = {
            days:[],
            lessons:[],
            lessonsRendered:false
        }
    }

    renderDays() {
        let day = this.props.day
        let date
        if(day === undefined) {date = this.date}
        else{date = day.toString().substr(6,2)+"/"+day.toString().substr(4,2)+"/"+day.toString().substr(0,4)}

        let days = []
        days.push(
            <TouchableOpacity style={styles.date} key={99}>
                <Text style = {styles.dateText}>{date}</Text>
            </TouchableOpacity>
        )

        this.setState({days})
        console.log("Rendered time")
    }


    async renderLessons() {
        if (!this.state.lessonsRendered) {

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
            let day = this.props.day
            if(day === undefined) day = this.day
            console.log("First")
            let tt = await getDayTimeTable(day, session, school)
            let lessons = new Array(grid.data.rows.length)
            for (let k = 0; k < lessons.length; k++) {
                lessons[k] = <View style={styles.timeGridBlock} key={(k+1) * 17}/>
            }
            if(tt !== 400) {
                if (tt.data.isSessionTimeout) {
                    console.log("New Session")
                    console.log("Second")
                    session = await getNewSession(school)
                    if(session === null) this.props.nav.navigate("SchoolSearch")
                    tt = await getDayTimeTable(day, session, school)

                }
                tt.data.data.dayTimeTable.forEach(lesson => {

                    let h = lesson.timeGridHour.split("-")

                    h.forEach(les => {
                        lessons[parseInt(les) - 1] = <View style={styles.timeGridBlock} key={parseInt(les)}>
                            <View style={styles.lesson}>
                                <Text key={0} style={styles.lessonInfo}>{lesson.subject}</Text>
                                <Text key={2} style={styles.lessonInfo}>{lesson.klasse}</Text>
                                <Text key={1} style={styles.lessonInfo}>{lesson.room}</Text>
                                <Text key={3} style={styles.lessonInfo}>{lesson.teacher}</Text>
                            </View>
                        </View>
                    })
                })
            }else {
                alert("Error fetching timetable")
            }

            let rows = grid.data.rows
                let endTime = 755
                let s = 0;
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].startTime === endTime) {
                        endTime = rows[i].endTime
                    } else {

                        lessons.splice(i + s, 0, <View style={styles.breakBlock}
                                                       key={s * 20}/>)
                        s++
                        endTime = rows[i + 1].startTime
                    }
                }

                this.setState({lessons})
                this.state.lessonsRendered = true

        }
    }


    async componentDidMount() {
        await this.renderDays()
        await this.renderLessons();
    }

    render() {
        return(
            <View style = {styles.day}>
                {
                    this.state.days.map((key) => {
                        return key
                    })
                }
                {
                    this.state.lessons.map((key) => {
                        return key
                    })
                }
            </View>
        )

    }

}
const styleVars = {
    backroundColor: "rgb(20,20,20)",
    secondaryColor: "rgb(60,60,60)",
    thirdColor: "rgb(75,75,75)",
    fourthColor: "rgb(100,100,100)",
    whiteColor:  "rgb(226, 226, 226)",
    accentColor: "rgb(83, 139, 85)",
} 
const styles = StyleSheet.create({
    lesson: {
        margin:5,
        flex:1,
    },
    day: {
        flex:1,
    },
    timetable:{
        borderWidth: 1,
        flex:6/6,
    },
    date:{
        backgroundColor: styleVars.backroundColor,
        flex:1/1,
        borderWidth: 0.4,
        borderColor: styleVars.whiteColor,
        borderRightWidth: 0,
        borderBottomWidth:0,
    },
    dateText: {
        paddingLeft: 7.5,
        paddingTop: 3,
        color: styleVars.whiteColor,
        fontSize:25,
    },
    breakBlock: {
        backgroundColor: styleVars.backroundColor,
        height:10,

        borderWidth: 0.4,
        borderColor: styleVars.whiteColor,
        borderRightWidth:0,
    },
    timeGridBlock:{
        flex:1,
        backgroundColor: styleVars.secondaryColor,
        borderLeftWidth: 0.4,
        borderLeftColor: styleVars.whiteColor,

        borderTopWidth: 0.4,
        borderTopColor: "rgba(0,0,0,0)",
    },
    lessonInfo:{
        fontSize: 7,
    }
})