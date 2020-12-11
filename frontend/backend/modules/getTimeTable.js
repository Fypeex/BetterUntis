//Author: Felix Jungbluth
//function to export timetable data
const axios = require("axios")
const fetch = require("node-fetch")
exports.getTimeTable = async function fetchData(url,cookies,school) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    console.log("Fetching data")
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
exports.getTimeGrid = async function getTimeGrid(school,session) {
    session = JSON.parse(session)
    const options = {
        headers: {
            cookie: "JSESSIONID=" + session.sessionId
        }
    }
    return axios.post("https://terpsichore.webuntis.com/WebUntis/jsonrpc.do?school=RFGS-Freiburg",
        {
            id:"ID",
            method:"getTimegridUnits",
            jsonrpc:"2.0"
        },
        options
        ).then(r => {
        return r.data
    }).catch(e => {
        console.log(e)
    })
}
