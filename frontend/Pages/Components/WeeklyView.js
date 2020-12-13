import React from "react"
import {Text, TouchableOpacity, View} from "react-native";

export class weeklyView extends React.Component{

    constructor(props) {
        super(props);
    }

    renderDays(date) {
        console.log("Rendered time")
        let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        let startingDay = new Date(date.setDate(diff)).getTime()

        let days = [
            <View key={99} style={styles.topLeft}/>
        ]


        for(let i = 0; i<5;i++) {
            let s = new Date(startingDay + (i * 3600000 * 24)).toLocaleString().split(",")[0].split("/")
            let d = s[1]
            let m = s[0]
            let y = s[2]
            days.push(
                <TouchableOpacity key={i} style={styles.date}>
                    <Text style = {styles.dateText}>{d}/{m}/{y}</Text>
                </TouchableOpacity>
            )

        }
        this.setState({days})
    }


    render() {
    }

}