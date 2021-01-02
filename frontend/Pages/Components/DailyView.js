import {Text, TouchableOpacity, View, StyleSheet,Dimensions} from "react-native";
import React,{Component} from "react";
import {getDayTimeTable,readTTFromFile} from "../../backend/modules/getTimeTable";
import {getSchool,getSession,getNewSession,getGrid} from "../StorageHandler";
import {col} from '../col';
import Lesson from "./Lesson"
import DetailedLessonPage from "./DetailedLessonPage"
export class DailyView extends Component{
    constructor(props) {
        super(props);
        this.day = this.props.day

        this.state = {
            days:[],
            lessons:[],
            touchedLesson:[],
            lessonsRendered:false
        }
    }

    renderDays() {
        let day = this.props.day
        let date

        if(day === undefined) {date = this.date}
        else{date = day.toString().substr(4,2)+"/"+day.toString().substr(6,2)+"/"+ day.toString().substr(0,4)}

        let topDate = date.split("/")[1]+"/"+date.split("/")[0]
        let botDate = new Date(date).toString().split(" ")[0]

        let days = []
        days.push(
            <TouchableOpacity style={styles.date} key={99}>
                <Text style = {styles.topDate}>{topDate}</Text>
                <Text style = {styles.bottomDate}>{botDate}</Text>
            </TouchableOpacity>
        )

        this.setState({days})
    }


    async renderLessons() {
        if (!this.state.lessonsRendered) {


            //Get school date from AsynStorage
            let school = await getSchool()
            if(school=== null) {
                this.props.nav.navigate("SchoolSearch")
                return
            }

            //Get session from AsyncStorage, if timed out, get new session. If no username/passwor navigate to login
            let session = await getSession()
            if(session === null) {
                this.props.nav.navigate("SchoolSearch")
                return
            }

            //Get Timegrid for school
            let grid = await getGrid(school)
            let day = this.props.day
            if(day === undefined) day = this.day

            //Get Timetable for in properties specified date
            let timeTableData = await readTTFromFile()
            //let timeTableData = await getDayTimeTable(day, session, school)
            let lessons = new Array(grid.data.rows.length)

            //Prepare array of lessons. This array only contains the Grid
            for (let k = 0; k < lessons.length; k++) {
                lessons[k] = <View style={(k === lessons.length-1) ? styles.timeGridBlockBorder: styles.timeGridBlock} key={(k+1) * 17}/>
            }

            let sortedLessons = []
            if(timeTableData !== 400) {
                console.log("Error?")
                console.log(timeTableData.data.error)

                if (timeTableData.data.error) {
                    switch(timeTableData.data.error.code) {
                        case -7004: //Date invalid/not allowed to view for this date
                            console.log("Can't retrieve data for this date")
                            return;
                        default: //Session timeout
                            session = await getNewSession(school)
                            if (session === null) this.props.nav.navigate("SchoolSearch")
                            timeTableData = await getDayTimeTable(day, session, school)
                    }
                }

                let dayTimeTable = timeTableData.data.result
                dayTimeTable.forEach(lesson => {
                    sortedLessons.push({
                            startTime: lesson.startTime,
                            endTime:lesson.endTime,
                            id:lesson.id,
                            data:lesson,
                            lessonType:1,
                        //lessonTypes:
                        // 1 = singleLesson
                        // 2 = doubleLesson
                        // 0 = lesson to Remove

                        })
                })

                for(let i = 0;i<sortedLessons.length;i++) {
                    if(sortedLessons[i+1] === undefined) break
                    if(sortedLessons[i].id === sortedLessons[i+1].id - 1) {

                      sortedLessons[i].lessonType = 2
                      sortedLessons[i].endTime = sortedLessons[i+1].endTime

                      sortedLessons[i+1].lessonType = 0
                    }

                }

                sortedLessons.forEach(lesson => {
                    if(lesson.lessonType === 0) {
                        sortedLessons.splice(sortedLessons.indexOf(lesson),1)
                    }
                })

            }

            let rows = grid.data.rows
            let allLessons = []
            for(let i = 0; i<rows.length;i++) {

                let lessonsForThisRow = []
                sortedLessons.forEach(lesson => {
                    if(lesson.startTime === rows[i].startTime) lessonsForThisRow.push(lesson)
                })
                allLessons.push(lessonsForThisRow)
            }
            let key = 50
            let innerKey = 1;
            for(let i = 0; i<lessons.length; i++) {

                let renderedLessonsForThisLesson = []
                let size = 1
                let lessonComponent = []

                allLessons[i].forEach(lesson => {
                    renderedLessonsForThisLesson.push(lesson)
                    size = lesson.lessonType
                })

                renderedLessonsForThisLesson.forEach(lesson => {
                    innerKey++
                    lessonComponent.push(
                        <TouchableOpacity style={styles.lesson} key={i + innerKey} onPress={() => {
                            let touchedLesson = [
                                <View style={styles.touchedContainer} >
                                    <TouchableOpacity
                                        style={[styles.touchedContainer, {left: 0}]}
                                        onPress={() => {
                                            let touchedLesson = []
                                            this.setState({touchedLesson})
                                        }}
                                        key = {0}
                                    />
                                    <View style={styles.touchedLesson} key={1}>
                                        <DetailedLessonPage info={lesson.data}/>
                                    </View>
                                </View>
                            ]
                            this.setState({touchedLesson})
                        }}>
                            <Lesson info={lesson.data}/>
                        </TouchableOpacity>
                    )
                })
                key++
                lessons[i] = <View style = {[styles.timeGridBlock,{flex:size}]} key={key}>
                    {
                        lessonComponent.map(key => {
                            return key
                        })
                    }
                </View>

                if(size === 2) {
                    lessons[i+1] = <View key = {key*2}/>
                    i++
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
                {
                    this.state.touchedLesson.map((key) => {
                        return key
                    })
                }
            </View>

        )

    }

}

const styles = StyleSheet.create({
    touchedContainer:{
        position: "absolute",
        left:-60,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height-60,
        justifyContent:"center",
        alignItems:"center",
        zIndex: 9
    },
    touchedLesson: {
        zIndex : 10,
        width:250,
        height: 450,
    },
    lesson: {
        flexDirection:"row",
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
    topDate: {
        color: col.white,
        textAlign: "center",
        fontSize:13,
        alignItems: "center",
        borderRadius:3,
        margin:3,
    },
    bottomDate:{
        color: col.white,
        textAlign: "center",
        fontSize:10,
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
        flexDirection: "row",
        backgroundColor: col.secbg,
        borderColor: col.grey,
        borderTopWidth: 0.5,
        flex:1,
    },
    multi:{
        borderColor: col.grey,
        borderTopWidth: 0.5,
        flex:2,
    },
    single: {
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
