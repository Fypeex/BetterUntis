import React,{Component} from "react";
import {View,Text,StyleSheet,TouchableOpacity,TextInput,AsyncStorage} from "react-native"
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
                id: this.props.info.id,
            },
            customHomework: "",
        }
    }
    async componentDidMount() {

        let customHomework = await AsyncStorage.getItem("customHomework" + this.state.lessonInformation.id)
        this.setState({customHomework})
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput value={this.state.customHomework}
                           placeholder = {"Homework"}
                           onChangeText = {async(customHomework) => {
                               this.setState({customHomework})
                               await AsyncStorage.setItem("customHomework" + this.state.lessonInformation.id,customHomework)
                }}
                key = {0}>
                </TextInput>
                <Text key={1}>{this.state.customHomework}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"green",
    }
})