import React from "react"
import {AsyncStorage, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {weeklyView} from "./Components/WeeklyView"
import {DailyView} from "./Components/DailyView"
import {TimeGrid} from "./Components/TimeGrid"
import t from "../backend/modules/getTimeTable"
import l from "../backend/modules/accountHandling"
import {Ionicons} from "@expo/vector-icons";
import theme from './css';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeGridLeft: [
                <TimeGrid key={99} nav = {this.props.navigation}/>
            ],
            days: [

            ],
            view:[
                <DailyView key={98} day={20201209} nav = {this.props.navigation}/>
            ]
        }
    }
    async componentDidMount() {
    }
    render() {
        return(
            <View style={styles.container}>
                <View style={styles.header} key={32}>
                    <TouchableOpacity onPress={
                        async () => {
                            await AsyncStorage.clear()
                            this.props.navigation.navigate("SchoolSearch")
                        }}>
                        <Ionicons name="md-options" style={styles.icon} size={32}/>
                    </TouchableOpacity>
                </View>

                {
                    this.state.days.map((key) => {
                        return key
                    })
                }
                <View style={styles.ttContainer}>
                    <View style={styles.LeftBar} key={0}>
                        <TimeGrid/>
                    </View>
                    <View style={styles.smallTTContainer} key={1}>
                        {
                            this.state.view.map((key) => {
                                return key
                            })
                        }
                    </View>

                </View>
            </View>
        )
    }
}


const col = {
    headerCol: "rgb(150, 31, 31)",
    mainbg: "rgb(18, 150, 18)",
    content: "rgb(28, 28, 150)",
    accent: "rgb(187, 134, 252)",
    accentDark: "rgb(178, 124, 243)",
    white: "rgb(232, 232, 232)",
}

const realcol = {
    headerCol: "rgb(31, 31, 31)",
    mainbg: "rgb(18, 18, 18)",
    content: "rgb(28, 28, 28)",
    accent: "rgb(187, 134, 252)",
    accentDark: "rgb(178, 124, 243)",
    white: "rgb(232, 232, 232)",
}
const styleVars = {
    backroundColor: "rgb(31,31,31)",
    secondaryColor: "rgb(60,60,60)",
    thirdColor: "rgb(75,75,75)",
    whiteColor:  "rgb(226, 226, 226)",
    headerColor: "rgb(42, 43, 58)",
    accentColor: "rgb(225,63,85)",
}

const styles = StyleSheet.create({
    dailyView: {
        flex:1,
    },
    header: {
        height:60,
        backgroundColor: col.headerCol,
    },
    icon: {
        paddingTop:15,
        paddingLeft:20,
        color: col.white,
    },
    ttContainer: {
        flexDirection: "row",
        flex:1,
        margin: 3,
        borderRadius:3,
    },
    smallTTContainer: {
        flexDirection: "row",
        flex:5/6,
    },
    LeftBar: {
        backgroundColor:"gray",
        flex:1/6,
        borderTopLeftRadius:6,
        borderBottomLeftRadius:6,
    },
    gradient:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: col.mainbg,
    },

    header: {
        height:80,
        backgroundColor: styleVars.secondaryColor,
    }
})

export default Main
