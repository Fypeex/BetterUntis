import React from "react"
import {AsyncStorage, StyleSheet, Text, View, TouchableOpacity,StatusBar} from "react-native";
import {DailyView} from "./Components/DailyView"
import {TimeGrid} from "./Components/TimeGrid"
import {Ionicons} from "@expo/vector-icons";
import {col} from './col';

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
    render() {
        return(
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <View style={styles.header} key={32}>
                    <TouchableOpacity onPress={
                        async () => {
                            this.props.navigation.openDrawer()
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
        backgroundColor: col.secbg,
        flexDirection: "row",
        flex:1,
        margin: 7.5,
        borderRadius:3,
    },
    smallTTContainer: {
        backgroundColor: col.secbg,
        borderTopRightRadius:6,
        borderBottomRightRadius:7,
        flexDirection: "row",
        flex:5/6,
    },
    LeftBar: {
        backgroundColor: col.secbg,
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

})

export default Main
