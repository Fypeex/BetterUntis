import React,{Component} from "react";
import {View,Text,StyleSheet} from "react-native"
import {col} from "../col";
export default class Lesson extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lessonInformation: {
                class: this.props.info.klasse,
                teacher: this.props.info.teacher,
                subject: this.props.info.subject,
                room: this.props.info.room,
                lessonDate: this.props.info.date,
                id: this.props.info.lesson.id,
            },


        }
    }
    render() {
        return (
            <View style={[styles.innerLesson,{backgroundColor:this.props.info.backColor+"bf"}]}>
                <Text style={styles.lesson}>{this.state.lessonInformation.subject}</Text>
                <Text style={styles.room}>{this.state.lessonInformation.room}</Text>
                <Text style={styles.teacher}>{this.state.lessonInformation.teacher}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    innerLesson: {
        flex:1,
        backgroundColor:col.accent,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius:7.5,
        overflow: "hidden"
        
    },
    lesson:{
        textAlign: "center",
        flex:-1,
        height:17,
        fontSize:12,
        flexWrap:"nowrap"
    },
    teacher:{
        textAlign: "center",
        flex:-1,
        fontSize:12,
        height:17,
        flexWrap:"nowrap"
    },
    room:{
        textAlign: "center",
        flex:-1,
        height:17,
        fontSize:12,
        flexWrap:"nowrap"
    }
})