//Author: Felix Jungbluth
//function to export timetable data
const axios = require("axios")
import tt from "./test"
import * as FileSystem from 'expo-file-system';


exports.getTimeTable = async function fetchData(url) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return axios({
        url:`${url.split("?")[0]}/api/public/timetable/weekly/pageconfig?type=1&date=${today}&isMyTimetableSelected=true`,
        method: "get",

    }).then(r => {
        console.log(r.data)
        return r.data
    }).catch(() => {
        console.log("Error fetching TimeTable for week " + today)
    })
}
exports.readTTFromFile = () => {
    return tt.tt
}
exports.getDayTimeTable = (day,session,school) => {
    console.log("TimeTable")
    console.log(`${school.serverUrl.split("?")[0]}/api/daytimetable/dayLesson?date=${day}&id=${session.personId}&type=${session.personType}`)
    return axios({
        url:`https://terpsichore.webuntis.com/WebUntis/jsonrpc.do?school=RFGS-Freiburg`,
        method:"post",
        headers: {
            cookie: "JSESSIONID=" + session.sessionId
        },
        data: {
            "id":"ID",
            "method":"getTimetable",
            "params":{
                "options":{
                    "element":{
                    "id":session.personId,
                    "type":session.personType
                    },
                "startDate":day,
                "endDate":day,
                "onlyBaseTimetable":true,
                "showBooking":true,
                "showSubstText":true,
                "showInfo":true,
                "showLSText":true,
                "teacherFields":["id", "name", "longname", "externalkey"],
                "subjectFields":["id", "name", "longname", "externalkey"],
                "roomFields":["id", "name", "longname", "externalkey"],
                "klasseFields":["id", "name", "longname", "externalkey"]
                }
            },
            "jsonrpc":"2.0"
        }
    }).then(res => {
        return res
    }).catch(() => {
        return 400
    })
}
exports.getTimeGrid = async function getTimeGrid(school) {
    return axios.get(school.serverUrl.split("?")[0]+"/api/public/timegrid").then(r => {
        return r.data
    }).catch(e => {
        console.log(e)
    })
}
