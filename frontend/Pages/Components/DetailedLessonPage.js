import React,{Component} from "react";
import {View,Text,StyleSheet,TouchableOpacity,TextInput,AsyncStorage} from "react-native"
import {col} from "../col"
import Ionicons from "react-native-vector-icons/Ionicons";
import Dialog from "react-native-dialog";
export default class DetailedLessonPage extends Component {
    constructor(props) {
        super(props);
        //AsyncStorage.removeItem("customHomework")
        this.state = {
            lessonInformation: {
                class: this.props.info.klasse,
                teacher: this.props.info.teacher,
                subject: this.props.info.subject,
                room: this.props.rooom,
                lessonDate: this.props.info.date,
                id: this.props.info.lesson.id,
                lessonDateFormatted: String(this.props.info.date).substr(6,2)+"/"+String(this.props.info.date).substr(4,2)+"/"+String(this.props.info.date).substr(0,4),
            },
            customHomework: [],
            popup: [],
            inputText:"",
        }
    }

    async componentDidMount() {
        let UnrenderedHW = JSON.parse(await AsyncStorage.getItem("customHomework"))
        if(UnrenderedHW === null) UnrenderedHW = []
        if(UnrenderedHW.find(element => element.id === this.state.lessonInformation.id) && UnrenderedHW.find(element => element.id === this.state.lessonInformation.id).hw) {
            UnrenderedHW.find(element => element.id === this.state.lessonInformation.id).hw.forEach(hw => {
                this.newHomeworkComp(hw.id, hw.Homework,true)
            })
        }
    }
    async newHomework(id,text) {
        let UnrenderedHW = JSON.parse(await AsyncStorage.getItem("customHomework"))
        if(UnrenderedHW === null) UnrenderedHW = []
        let updatedHW = false
        UnrenderedHW.forEach(lesson => {

            if(lesson.id === this.state.lessonInformation.id) {

                let hwForThis = lesson.hw
                if(hwForThis === undefined || hwForThis === null) hwForThis = []
                hwForThis.push({
                    id:id,
                    Homework:text
                })
                updatedHW = true

                lesson.hw = hwForThis
            }


        })

        if(!updatedHW) {

            UnrenderedHW.push({

                id:this.state.lessonInformation.id,
                hw: [{
                    id:Date.now(),
                    Homework:text
                }]

            })

        }

        await AsyncStorage.setItem("customHomework",JSON.stringify(UnrenderedHW))
        this.newHomeworkComp(id,text)
    }
    newHomeworkComp(id,text,rerender) {
        let customHomework = (rerender)? this.state.customHomework:[]

        customHomework.push(
            <TouchableOpacity key={id} style={styles.customHomework} onPress = {() => {
                this.newRemovePopUp(id,text)
            }}>
                <Text>{text}</Text>
            </TouchableOpacity>
        )
        this.setState({customHomework})
    }
    newHomeworkPopUp() {
        let popup = []
        popup.push(
            <Dialog.Container key={"POPUP"} visible={true} contentStyle={{backgroundColor:col.mainbg}}>
                <Dialog.Title style={{color:"gray"}}>New Homework</Dialog.Title>
                <Dialog.Input style={styles.button} onChangeText={(inputText) => {
                    this.setState({inputText})
                }}/>
                <Dialog.Button label="Cancel" onPress={()=>{
                    let popup = []
                    this.setState({popup})
                }}/>
                <Dialog.Button label="Create" onPress={async ()=>{
                    await this.newHomework(Date.now(),this.state.inputText)
                    let popup = []
                    this.setState({popup})
                }}/>
            </Dialog.Container>)
        this.setState({popup})
    }



    async removeHomework(id) {
        let customHomework = this.state.customHomework

        customHomework.splice(customHomework.findIndex(element => element.key === id), 1)
        this.setState({customHomework})


        let storedHW = JSON.parse(await AsyncStorage.getItem("customHomework"))
        storedHW.find(hw => hw.id === this.state.lessonInformation.id).hw.splice(customHomework.findIndex(element => element.id === id), 1)

        await AsyncStorage.setItem("customHomework",JSON.stringify(storedHW))
    }
    newRemovePopUp(id,text) {
        let popup = []
        popup.push(
            <Dialog.Container key={"POPUP"} visible={true} contentStyle={{backgroundColor:col.mainbg}}>
                <Dialog.Title style={{color:"gray"}}>Edit Homework</Dialog.Title>
                <Dialog.Input style={styles.button} onChangeText={(inputText) => {
                    this.setState({inputText})
                }}>{text}</Dialog.Input>
                <Dialog.Button label="Cancel" onPress={()=>{
                    let popup = []
                    this.setState({popup})
                }}/>
                <Dialog.Button label="Edit" onPress={async ()=>{
                    if(this.state.inputText !== "") {
                        await this.editHw(id, this.state.inputText)
                    }
                    let popup = []
                    this.setState({popup})
                }}/>
                <Dialog.Button label="Delete" onPress={async ()=>{
                    await this.removeHomework(id)
                    let popup = []
                    this.setState({popup})
                }}/>
            </Dialog.Container>)
        this.setState({popup})
    }


    async editHw(id,text) {


        let storedHW = JSON.parse(await AsyncStorage.getItem("customHomework"))
        storedHW.find(hw => hw.id === this.state.lessonInformation.id).hw[storedHW.find(hw => hw.id === this.state.lessonInformation.id).hw.findIndex(element => element.id === id)].Homework = text
        await AsyncStorage.setItem("customHomework",JSON.stringify(storedHW))

        await this.componentDidMount()

    }

    render() {
        return (
            <View style={styles.container} key={2}>
                <View style={styles.containerHeader} key={"Header"}>
                    <Text key={"HeaderDate"} style={styles.headerDate}>{new Date(this.state.lessonInformation.lessonDate).toString().split(" ")[0]} | {this.state.lessonInformation.lessonDateFormatted}</Text>
                    <View style={styles.headerTimeContainer} key={"HeaderTime"}>
                        <Text key={"HeaderStartTime"} style={styles.headerStarttime}>{this.props.info.startTime}</Text>
                        <Text key={"HeaderConnector"} style={styles.headerConnector}>-</Text>
                        <Text key={"HeaderEndTime"} style={styles.headerEndtime}>{this.props.info.endTime}</Text>
                    </View>
                </View>
                <View style={styles.lessonInfo}>
                    <Text style={styles.detailedSubject}>
                        {"Subject: " + this.state.lessonInformation.subject}
                    </Text>
                    <Text style={styles.detailedTeacher}>
                        {"Teacher: " + this.state.lessonInformation.teacher}
                    </Text>
                </View>
                <View>
                    {
                        this.state.popup.map((key) => {
                            return key
                        })
                    }
                </View>
                <View style={styles.customHomeworkContainer} key={"chwContainer"}>
                {
                    this.state.customHomework.map((key) => {
                        return key
                    })
                }
                    <View style={styles.newHW} key={"newHWButton"}>
                        <Ionicons name={"md-add-circle"} style={styles.icon} color={"green"} size={32} onPress = {async() => {
                            let id = Date.now()
                            this.newHomeworkPopUp(id)
                        }
                        }/>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    button: {
        padding:8,
        paddingLeft:10,
        marginLeft:20,
        marginRight:20,
        shadowColor: "#000",
        shadowOffset:{
            width: 0,
            height: 12,
        },
        shadowOpacity: 1,
        shadowRadius: 16.00,
        elevation: 10,
        minHeight:50,
        backgroundColor:"rgb(60,60,60)",
        borderRadius:3,
        color:"white",
    },
    container: {
        flex:1,
        backgroundColor:"#898989",
        borderRadius:10
    },
    containerHeader: {
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        flex:0.2,
        backgroundColor: col.headerCol,
        justifyContent: "center",
        alignItems: "center",
    },
    headerDate: {
        color: col.white,
        textAlign:"center",
        margin:"auto",
        fontSize:20,
    },
    headerTimeContainer:{
        flexDirection: "row"
    },
    headerConnector:{
        color: col.white
    },
    headerStarttime:{
        color: col.white,
        marginRight: 5
    },
    headerEndtime:{
        color: col.white,
        marginLeft: 5,
    },
    icon:{
        position:"relative",
        marginRight:5,
    },
    newHW: {
        alignItems:"flex-end"
    },
    customHomework: {
        backgroundColor:"#dbdbdb",
        justifyContent:"center",
        margin:3,
        padding:3,
        borderRadius:2,
        overflow: "scroll",
    },
    customHomeworkContainer: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor:"#898989",
    },
    lessonInfo:{
        backgroundColor: col.secbg,
        marginTop: 3,
        borderRadius: 2,
        margin:3,
        padding: 3
    },
    detailedSubject:{
        color: col.white,
        fontSize: 16
    },
    detailedTeacher:{
        color: col.white,
        fontSize: 16
    }
})