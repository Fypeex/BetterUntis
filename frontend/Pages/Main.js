import  React from "react"
import {
    TouchableOpacity,
    FlatList,
    View,
    Text,
    AsyncStorage,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from "react-native";
import t from "../backend/modules/getTimeTable"
import {LinearGradient} from "expo-linear-gradient";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            loading:[
                <LinearGradient
                    key={2}
                    colors={["rgb(50,50,50)", "rgb(20,20,20)"]}
                    start={[-0.66, 0]}
                    style={styles.gradient}>
                    <View key={1}>
                        <ActivityIndicator size="large" color="gray"/>
                    </View>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate("SchoolSearch")
                    }}>
                        <Text>Test</Text>
                    </TouchableOpacity>
                </LinearGradient>
                ]
        }

    }
    async componentDidMount() {
        let school = JSON.parse(await AsyncStorage.getItem("School"))
        let session = JSON.parse(await AsyncStorage.getItem("Session"))

        //let TimeTable = await t.getTimeTable(school.serverUrl, session.sessionId, school.loginName)
        //let TimeGrid = t.getTimeGrid()

    }

    render() {
        return(
            <Text>Test</Text>
        )
    }
}
const styleVars = {
    backroundColor: "rgb(20,20,20)",
    secondaryColor: "rgb(60,60,60)",
    thirdColor: "rgb(75,75,75)",
    whiteColor:  "rgb(226, 226, 226)",
    accentColor: "rgb(225,63,85)",
}
const styles = StyleSheet.create({
    buttonGradient:{
        marginTop: 20,
        borderRadius: 90,
    },
    backGrid: {
        height:50,
        flex:1,
        borderWidth:0.8,
    },
    breakBlock: {
        height:20,
    },
    timeGridBlock:{
        borderWidth:0.8,
    },
    startTime:{
        fontSize: 9,
        textAlign:"left",
    },
    endTime:{
        fontSize: 9,
        textAlign:"right",
    },
    periodNumber: {
        textAlign:"center",
        fontSize:11,
    },
    ttContainer: {
        flex:1,
        backgroundColor:"black",
    },
    smallTTContainer: {
        flexDirection: "row",
        flex:11/12,
    },
    TopBar: {
        height:100,
        flex:0.1,
    },
    LeftBar: {
        flex:1/6,
    },
    gradient:{
        justifyContent:"center",
        alignItems:"center",
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: styleVars.backroundColor,
    },
    timetable:{
        borderWidth: 1,
        flex:5/6,
    },
    lesson: {
        flex:1/5,
        borderWidth: 1,
    },
    text: {
        fontSize:10,
    },
    header: {
        height:80,
        backgroundColor: styleVars.secondaryColor,
    }
})

export default Main