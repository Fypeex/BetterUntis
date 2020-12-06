/*const getTT = require("./getDatilyTimeTable.js")
const fs = require("fs")
//Date Format: YYYYMMDD (20201130)
const date = ["20201130"]
getTT.getTimeTable(date).then(res => {

    for(let i =0; i < date.length; i++) {
        fs.writeFile(`../timetables/TT${date[i]}.json` , JSON.stringify(res[i],null,2) ,function (err) {
            if (err) throw err;
        });
    }

})*/


const ss = require("./schoolSearch.js")
const aH = require("./accountHandling.js")
const tt = require("./getDatilyTimeTable.js")

console.log("Fetching schooldata")
ss.searchSchool("rfgs").then(r => {
    let school = r.data.result.schools[0]
    console.log(school)

    console.log("Fetching cookies")

    aH.getCookies(school.serverUrl).then(r => {
        return r;

    }).then(cookieres => {
        console.log(cookieres)
        console.log("Login in")
        aH.login(school.serverUrl.split("?")[0] + "/j_spring_security_check", cookieres[1], cookieres[0],school.loginName).then(traceid => {
            console.log(cookieres)
            let cookies = {
                JSESSIONID:cookieres[0],
                schoolname:cookieres[1],
                traceId:traceid
            }

            console.log("Getting timetable")
            tt.getTimeTable(["20201203"], cookies).then(r => {
                console.log(r)
            })

        })

    })
})

