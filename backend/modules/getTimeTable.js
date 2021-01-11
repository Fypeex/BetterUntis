//Author: Felix Jungbluth
//function to export timetable data
const axios = require("axios")


exports.getDayTimeTable = (day,session,school) => {
    return axios({
        url:`${school.serverUrl.split("?")[0]}/api/daytimetable/dayLesson?date=${day}&id=${session.personId}&type=${session.personType}`,
        method:"get",
        headers: {
            cookie: "JSESSIONID=" + session.sessionId
        },
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
