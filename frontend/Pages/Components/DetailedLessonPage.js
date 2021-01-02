import React,{Component} from "react";
import {View,Text,StyleSheet,TouchableOpacity,TextInput,AsyncStorage} from "react-native"
import {col} from "../col"
export default class DetailedLessonPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lessonInformation: {
                class: this.props.info.kl,
                teacher: this.props.info.te,
                subject: this.props.info.su,
                room: this.props.ro,
                lessonDate: this.props.info.date,
                lessonDateFormatted: String(this.props.info.date).substr(6,2)+"/"+String(this.props.info.date).substr(4,2)+"/"+String(this.props.info.date).substr(0,4),
                id: this.props.info.id,
            },
            customHomework: {
                id:"",
                hw:""
            },
        }
    }

    async componentDidMount() {
        let customHomework = JSON.parse(await AsyncStorage.getItem("customHomework"))
        if(customHomework === null) customHomework = []
        customHomework = customHomework.find(element => element.id === this.state.lessonInformation.id)
        if(customHomework !== undefined) {
            this.setState({customHomework})
        }
    }

    render() {
        return (
            <View style={styles.container} key={2}>
                <View style={styles.containerHeader}>
                    <Text>{new Date(this.state.lessonInformation.lessonDate).toString().split(" ")[0]} | {this.state.lessonInformation.lessonDateFormatted}</Text>
                    <Text>{this.props.info.startTime}</Text>
                    <Text>{this.props.info.endTime}</Text>
                </View>
                <TextInput value={this.state.customHomework}
                           placeholder={"Homework"}
                           onChangeText={async (customHomework) => {
                               this.setState({customHomework})
                               let currentHw = JSON.parse(await AsyncStorage.getItem("customHomework"))
                               if(currentHw === null || currentHw === undefined) currentHw = []

                               let hw = currentHw.findIndex(element => element.id === this.state.lessonInformation.id)
                               if (hw > -1) {

                                   currentHw[hw].hw = customHomework

                               } else {
                                   currentHw.push({
                                       id: this.state.lessonInformation.id,
                                       hw: customHomework
                                   })
                               }
                               await AsyncStorage.setItem("customHomework", JSON.stringify(currentHw))
                           }}
                           key={0}>
                </TextInput>
                <Text key={1}>{this.state.customHomework.hw}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"green",
        borderRadius:20
    },
    containerHeader: {
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        flex:0.14,
        backgroundColor: col.headerCol
    }
})