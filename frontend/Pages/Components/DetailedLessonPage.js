import React,{Component} from "react";
import {View,Text,StyleSheet,TouchableOpacity,TextInput,AsyncStorage} from "react-native"
import {col} from "../col"
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import Dialog from "react-native-dialog";
export default class DetailedLessonPage extends Component {
    constructor(props) {
        super(props);
        //AsyncStorage.removeItem("customHomework")
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
            customHomework: [],
            popup: [],
            inputText:"",
        }
    }

    async componentDidMount() {
        let UnrenderedHW = JSON.parse(await AsyncStorage.getItem("customHomework"))
        if(UnrenderedHW.find(element => element.id === this.state.lessonInformation.id) && UnrenderedHW.find(element => element.id === this.state.lessonInformation.id).hw) {
            UnrenderedHW.find(element => element.id === this.state.lessonInformation.id).hw.forEach(hw => {
                this.newHomeworkComp(hw.id, hw.Homework)
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
    newHomeworkComp(id,text) {
        let customHomework = []

        customHomework.push(
            <TouchableOpacity style={styles.customHomework} onPress = {() => {
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
            <Dialog.Container visible={true} contentStyle={{backgroundColor:col.mainbg}}>
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
            <Dialog.Container visible={true} contentStyle={{backgroundColor:col.mainbg}}>
                <Dialog.Title style={{color:"gray"}}>Edit Homework</Dialog.Title>
                <Dialog.Input style={styles.button} onChangeText={(inputText) => {
                    this.setState({inputText})
                }}>{text}</Dialog.Input>
                <Dialog.Button label="Cancel" onPress={()=>{
                    let popup = []
                    this.setState({popup})
                }}/>
                <Dialog.Button label="Edit" onPress={async ()=>{
                    await this.editHw(id,this.state.inputText)
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
        console.log(storedHW)
        await AsyncStorage.setItem("customHomework",JSON.stringify(storedHW))

        await this.componentDidMount()

    }

    render() {
        return (
            <View style={styles.container} key={2}>
                <View style={styles.containerHeader} key={"Header"}>
                    <Text style={styles.headerDate}>{new Date(this.state.lessonInformation.lessonDate).toString().split(" ")[0]} | {this.state.lessonInformation.lessonDateFormatted}</Text>
                    <Text style={styles.headerStarttime}>{this.props.info.startTime}</Text>
                    <Text style={styles.headerEndtime}>{this.props.info.endTime}</Text>
                </View>
                <View style={styles.lessonInfo}>
                    <Text>
                        {this.state.lessonInformation.subject[0].longname}
                    </Text>
                    <Text>
                        {this.state.lessonInformation.teacher[0].longname}
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
        backgroundColor:"grey",
        borderRadius:20
    },
    containerHeader: {
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        flex:0.14,
        backgroundColor: col.headerCol
    },
    headerDate: {
        color: col.white,
        textAlign:"center",
        margin:"auto",
        fontSize:20,
    },
    icon:{
        position:"relative",
        marginRight:5,
    },
    newHW: {
        alignItems:"flex-end"
    },
    customHomework: {
        flex:0.1,
        backgroundColor:"white",
        justifyContent:"center",
    },
    customHomeworkContainer: {
        flex:1,
        justifyContent: "flex-start",
        backgroundColor:"grey",
    }
})