//Author: Felix Jungbluth
//function to export timetable data
const fetches = require("./fetches.js")
let timetables = []
exports.getTimeTable = async function fetchData(dates,cookies) {

        /////////////////////////////////////////////////////////////////////////////////////////////
        /*                                 Only fetch data in here                                 */
        /*                             Put fetches inside the for-loop                             */
        /*                                                                                         */
        /*                                                                                         */
        /*                                                                                         */
    for(let i = 0 ; i<dates.length ; i++) {

        FetchUrl = "https://terpsichore.webuntis.com/WebUntis/api/daytimetable/dayLesson?date=" + dates[i] + "&id=5232&type=5";
        FetchMethod = "GET";
        FetchData = null;
        FetchCookies = "JSESSIONID=" + JSESSIONID + "; traceId=" + traceId + "; schoolname=" + schoolname + "";

        let timeTable = await fetches.getData(FetchUrl, FetchMethod, FetchData, FetchCookies);


        data.push(timeTable.data.data.dayTimeTable);

    }
        /*                                                                                         */
        /*                                                                                         */
        /*                                                                                         */
        /*                                                                                         */
        /*                                                                                         */
        /////////////////////////////////////////////////////////////////////////////////////////////

    //return all timetables
    return timetables

}
