import React,{Component} from "react";
import {View,Text,StyleSheet,TouchableOpacity} from "react-native"
import {col} from "../col";
export default class Lesson extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lessonInformation: {
                class: this.props.info.kl,
                teacher: this.props.info.te,
                subject: this.props.info.su,
                room: this.props.ro,
                lessonDate: this.props.info.date,
                id: this.props.info.id,
            },


        }
    }
    render() {
        return (
            <View style={styles.innerLesson}>
                <Text style={styles.lessonText}>{this.state.lessonInformation.subject[0].longname}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    innerLesson: {
        flex:1,
        backgroundColor:col.accent,
        margin:5,
    },
})