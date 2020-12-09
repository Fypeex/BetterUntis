import React from "react"
import {View,Text,AsyncStorage,StyleSheet,ScrollView} from "react-native";
import t from "../backend/modules/getDatilyTimeTable"

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            week :[
                <Text key={0}>Test</Text>
            ]
        }
    }

    async componentDidMount() {
        let school = JSON.parse(await AsyncStorage.getItem("School"))
        let session = JSON.parse(await AsyncStorage.getItem("sessions"))

        console.log(school)
        console.log(session)

        let currentSession;

        session.forEach(session => {
            if(session[0] === school.schoolId) currentSession = session[1]
        })
        if(currentSession === undefined || currentSession === null) {
            alert("Couldnt find session")
            this.props.naviagtion.navigate("SchoolSearch")
        }else {

            await t.getTimeTable(school.serverUrl,currentSession,school).then(r => {
                let tt = r.data.result.data.elementPeriods[5232]
                let week = []
                tt.forEach(lesson => {
                    if(lesson.cellState === "STANDARD") {
                        week.push(
                            <View style={styles.lesson} key={lesson.id}>
                                <Text key={lesson.id*2}>{lesson.studentGroup}</Text>
                                <Text key={lesson.id *3}>{lesson.date}</Text>
                            </View>
                        )
                    }

                })

                this.setState({week})
            })

        }
        //t.getTimeTable()
    }

    render() {
        return(
            <ScrollView>{
                this.state.week.map((key, value) => {
                    return key
                })
            }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    lesson: {
        borderWidth:1
    }
})

export default Main