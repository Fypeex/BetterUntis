//Author: Felix Jungbluth
//function to export timetable data
const axios = require("axios")


exports.getTimeTable = async function fetchData(url,cookies,school) {
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
    }).catch(e => {
        console.log("Error fetching TimeTable for week " + today)
    })
}

exports.getDayTimeTable = (day,session,school) => {
    console.log("TimeTable")
    console.log(`${school.serverUrl.split("?")[0]}/api/daytimetable/dayLesson?date=${day}&id=${session.personId}&type=${session.personType}`)
    return axios({
        url:`${school.serverUrl.split("?")[0]}/api/daytimetable/dayLesson?date=${day}&id=${session.personId}&type=${session.personType}`,
        method:"get",
        headers: {
            cookie: "JSESSIONID=" + session.sessionId
        }
    }).catch(e => {
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
