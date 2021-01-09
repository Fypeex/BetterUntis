import React,{Component} from "react";
import {View,Text,StyleSheet,TouchableOpacity} from "react-native"
import {col} from "../col";
export default class Lesson extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lessonInformation: {
                class: this.props.info.klasse,
                teacher: this.props.info.teacher,
                subject: this.props.info.subject,
                room: this.props.rooom,
                lessonDate: this.props.info.date,
                id: this.props.info.lesson.id,
            },


        }
    }
    render() {
        return (
            <View style={[styles.innerLesson,{backgroundColor:this.props.info.backColor+"bf"}]}>
                <Text style={styles.lessonText}>{this.state.lessonInformation.subject}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    innerLesson: {
        flex:1,
        backgroundColor:col.accent,
        borderRadius:10,
    },
})