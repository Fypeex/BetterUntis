import {Text, TouchableOpacity, View, StyleSheet,Dimensions} from "react-native";
import React,{Component} from "react";
import InsetShadow from 'react-native-inset-shadow'
import {col} from '../col';
import Lesson from "./Lesson"
import DetailedLessonPage from "./DetailedLessonPage"
export class DailyView extends Component{
    constructor(props) {
        super(props);
        this.state = {
            days:[],
            lessons:[],
            touchedLesson:[],
            lessonsRendered:false
        }

    }

    renderDays() {
        let date = this.props.day

        let topDate = date
        let botDate = new Date(date.toString().substring(0,4) + "/" + date.toString().substring(4,6) + "/" + date.toString().substring(6,8)).toLocaleString().split(" ")[0]
        let days = []
        days.push(
            <TouchableOpacity style={styles.date} key={99}>
                <Text style={styles.bottomDate}>{botDate}</Text>
                <View style={{flexDirection:"row",justifyContent:"center",margin:-5}}>
                    <Text style={styles.topDate}>{topDate.toString().substring(6,8)}</Text>
                    <Text style={{color:"grey",fontSize:10}}>.{topDate.toString().substring(4,6)}</Text>
                </View>

            </TouchableOpacity>
        )

        this.setState({days})
    }


    async renderLessons() {
        if (!this.state.lessonsRendered) {


            //Get school date from AsyncStorage
            let grid = this.props.grid
            let timeTableData = this.props.timeTable
            let lessons = new Array(grid.data.rows.length)
            //Prepare array of lessons. This array only contains the Grid
            for (let k = 0; k < lessons.length; k++) {
                lessons[k] = <View style={styles.timeGridBlock} key={(k+1) * 17}/>
            }

            let sortedLessons = []
            if(timeTableData !== 400) {

                let dayTimeTable = timeTableData.data.data.dayTimeTable
                dayTimeTable.forEach(lesson => {
                    sortedLessons.push({
                            startTime: lesson.startTime,
                            endTime:lesson.endTime,
                            id:lesson.lesson.id,
                            data:lesson,
                            lessonType:1,
                        //lessonTypes:
                        // 1 = singleLesson
                        // 2 = doubleLesson
                        // 0 = lesson to Remove

                        })
                })

                for(let i = 0;i<sortedLessons.length;i++) {
                    if(!sortedLessons[i+1])break;
                    if(sortedLessons.filter(el => el.id === sortedLessons[i].id).length > 1) {

                      sortedLessons[i].lessonType = 2
                      sortedLessons[i].endTime = sortedLessons[i+1].endTime

                      sortedLessons[i+1].lessonType = 0
                    }
                    if(sortedLessons[i].data.timeGridHour.indexOf(" - ") > -1) {
                        let hour =  sortedLessons[i].data.timeGridHour
                        sortedLessons[i].data.timeGridHour = hour.split(" - ")[0]
                        sortedLessons[i+1].data.timeGridHour = hour.split(" -")[1]

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
                    if(parseInt(lesson.data.timeGridHour) === parseInt(rows[i].period)) lessonsForThisRow.push(lesson)
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

                            <TouchableOpacity style={[styles.lesson,{backgroundColor:lesson.data.backColor+"1f"}]} key={lesson + innerKey} onPress={() => {
                                let touchedLesson = [
                                    <View style={[styles.touchedContainer,{left:(this.props.x + 1) * -60}]} key={"TouchedLesson"}>
                                        <TouchableOpacity
                                            style={[styles.touchedContainer, {left: 0}]}
                                            onPress={() => {
                                                let touchedLesson = []
                                                this.setState({touchedLesson})
                                            }}
                                            key = {0}
                                        />
                                        <View style={styles.touchedLesson} key={1}>
                                            <DetailedLessonPage info={lesson.data} header={lesson.data.backColor}/>
                                        </View>
                                    </View>
                                ]
                                this.setState({touchedLesson})
                            }}>
                                <View style={{flex:1,padding:1.5,paddingBottom:3,paddingRight:3}}>
                                    <Lesson info={lesson.data}/>
                                </View>
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
            let endTime = 755
            let s = 0;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].startTime === endTime) {
                    endTime = rows[i].endTime
                } else {

                    lessons.splice(i + s, 0, <View style={styles.breakBlock}
                                                   key={s * 200}/>)
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
        right:0,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height-60,
        justifyContent:"center",
        alignItems:"center",
        zIndex: 9
    },
    touchedLesson: {
        position: "absolute",
        left:60,
        zIndex : 50,
        width:250,
        height: 450,
    },
    lesson: {
        flexDirection:"row",
        borderRadius:10,
        margin:1,
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
        borderRightWidth:0.167,
        flex:1,
        borderColor:col.grey,
        justifyContent: "flex-start"
    },
    topDate: {
        color: col.white,
        textAlign: "center",
        fontSize:22,
        alignItems: "center",
        borderRadius:3,
    },
    bottomDate:{
        color: "grey",
        textAlign: "center",
        fontSize:10,
        alignItems: "center",
        borderRadius:3,
        margin:3,
    },
    breakBlock: {
        margin:-0.167,
        backgroundColor: col.secbg,
        height:15,
        borderColor: col.grey,
        borderWidth: 0.167,
    },
    timeGridBlock:{
        margin:-0.167,
        flexDirection: "row",
        backgroundColor: col.secbg,
        borderColor: col.grey,
        flex:1,
        borderWidth:0.167,
    },
    lessonthingy:{
        color: col.white
    }
})
