import {Text, TouchableOpacity, View, StyleSheet,AsyncStorage} from "react-native";
import React,{Component} from "react";
import t, {getDayTimeTable} from "../../backend/modules/getTimeTable";
import {getSchool,getSession,getNewSession,getGrid} from "../StorageHandler";
import {col} from '../col';

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
                lessons[k] = <View style={(k === lessons.length-1) ? styles.timeGridBlockBorder: styles.timeGridBlock} key={(k+1) * 17}>
                    <Text>{k * 17}</Text>
                </View>
            }
            if(tt !== 400) {
                if (tt.data.isSessionTimeout) {
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
                                <Text key={1} style={styles.lessonInfo}>{lesson.room}</Text>
                                <Text key={2} style={styles.lessonInfo}>{lesson.teacher}</Text>
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

const styles = StyleSheet.create({
    lesson: {
        backgroundColor: col.accentDark,
        borderRadius:3,
        margin:5,
        flex:1,
    },
    lessonInfo:{
        color: col.white,
        textAlign: "center",

    },
    day: {
        flex:1,
    },
    timetable:{
        flex:6/6,
    },
    date:{
        flex:1,
        borderTopRightRadius:6,
    },
    dateText: {
        color: col.white,
        backgroundColor: col.accentDark,
        textAlign: "center",
        fontSize:20,
        alignItems: "center",
        borderRadius:3,
        margin:3,
    },
    breakBlock: {
        backgroundColor: col.secbg,
        height:15,
        borderColor: col.grey,
        borderTopWidth: 0.5,
    },
    timeGridBlock:{
        backgroundColor: col.secbg,
        borderColor: col.grey,
        borderTopWidth: 0.5,
        flex:1,
    },
    timeGridBlockBorder:{
        backgroundColor: col.secbg,
        flex:1,
        borderTopWidth: 0.5,
        borderColor: col.grey,
        borderBottomRightRadius:6,
    },
    lessonthingy:{
        color: col.white
    }
})
