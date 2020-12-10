//Author: Felix Jungbluth
//function to export timetable data
const axios = require("axios")


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
        return r.data
    })
}
