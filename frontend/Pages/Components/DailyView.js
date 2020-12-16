import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import React,{Component} from "react";
import {getDayTimeTable} from "../../backend/modules/getTimeTable";
import {getSchool,getSession,getNewSession,getGrid} from "../StorageHandler";
import {col} from '../col';

export class DailyView extends Component{
    constructor(props) {
        super(props);
        this.day = this.props.day

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
            let tt = await getDayTimeTable(day, session, school)
            let lessons = new Array(grid.data.rows.length)

            //Prepare array of lessons. This array only contains the Grid
            for (let k = 0; k < lessons.length; k++) {
                lessons[k] = <View style={(k === lessons.length-1) ? styles.timeGridBlockBorder: styles.timeGridBlock} key={(k+1) * 17}/>
            }

            //Checks if Timetable fetch was success
            if(tt !== 400) {

                //If session timed out, get new session
                if (tt.data.isSessionTimeout) {
                    session = await getNewSession(school)
                    if(session === null) this.props.nav.navigate("SchoolSearch")
                    tt = await getDayTimeTable(day, session, school)

                }

                //Specify the Daily time table
                let dtt = tt.data.data.dayTimeTable

                let entries = []

                //Push every lesson from the data into a new object with easier access to their id and timegrid place
                dtt.forEach(entry => {
                    entries.push({
                        hour:parseInt(entry.timeGridHour),
                        id: entry.lesson.id,
                        entry:entry
                    })
                })

                //Sort the array of lessons so multiple lessons can be placed on one Timegrid place
                let a = []
                entries.forEach(entry => {
                    a.push(entries.filter(entry2 => entry2.hour === entry.hour))
                })


                //Loop through all the lessons
                for (let i = 0;i < a.length;i++) {

                    //Style => Style of the lesson / what kind of lesson (Single, Solo / Double, Solo etc)
                    let style;

                    //Inc is needed to increment I if a double lessons was found so they second lesson will get skipped
                    let inc = 0

                    //This will only be done if a isnt at its last spot to prevent undefined variables
                    if(a[i+1]) {
                        style = []

                        //Switch about the length of the timegrid array/How many lessons need to be placed into on grid field
                        switch (a[i].length) {
                            case 0:
                                break;
                            case 1:
                                //This checks if the lesson is double or single
                                if (a[i][0].id === a[i + 1][0].id) {

                                    style.push(styles.multi)
                                    inc = 1
                                } else {
                                    style.push(styles.single)
                                }
                                break;
                            default:
                                let l = a[i].length
                                for (let f = 0; f < l; f++) {
                                    if (a[i+1][f] && a[i][f].id === a[i + 1][f].id) {
                                        style.push(styles.multi)
                                        inc = 1
                                    } else {
                                        style.push(styles.multi)
                                    }
                                }
                                break;
                        }


                        let component = []

                        //Z => Temporary arr to store the multiple lesson blocks if there are multiple lessons per grid field
                        let z =[]

                        //Count => counts how often i gets manually incremented to subtract this later from another array
                        let count = 0;

                        //If there is only one lesson
                        if (style.length === 1) {
                            for (let q = 0; q < a[i].length;q++) {
                                component.push(
                                    <View style={style} key={i}>
                                        <View style={styles.innerLesson}>
                                            <Text style={styles.lessonText}>{a[i][0].entry.subject}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        }else {
                            let l = a[i].length

                            for (let f = 0; f < l; f++) {
                                if (a[i+1][f] && a[i][f].id === a[i + 1][f].id) {
                                z.push(
                                    <View style={styles.innerLesson} key={i * f * 23}>
                                        <Text style={styles.lessonText}>{a[i][f].entry.subject}</Text>
                                    </View>
                                )

                                    count = 1
                                    i++
                                }


                            }
                            z.reverse()

                            component = <View style={[{flex:1,flexDirection:"row"},style]}>
                                {
                                    z.map((key) => {
                                        return key
                                    })
                                }
                            </View>
                        }

                        //Place components
                        for(let t =0; t < a[i].length;t++){
                            lessons[a[i][t].hour-1-count] = component
                        }

                        for(let t =0; t < a[i].length;t++){
                            lessons[a[i][t].hour-count] = <View key = {(i+1)*18}/>
                        }


                        i+=inc

                    }

                }


            }

            else {
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
    innerLesson: {
        flex:1,
        backgroundColor:col.accent,
        margin:5,
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
