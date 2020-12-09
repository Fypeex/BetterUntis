//Author: Felix Jungbluth
//function to export timetable data

let timetables = []
exports.getTimeTable = async function fetchData(url,cookies,school) {
    console.log(cookies[1])
    url = url.split("?")[0]
    url = `${url}/api/public/timetable/weekly/data?elementType=5&elementId=5232&date=2020-12-07&formatId=3`
    console.log(url)
    return fetch(url, {
        "headers": {
            "accept": "application/json",
            "accept-language": "en,en-US;q=0.9,de-DE;q=0.8,de;q=0.7",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "Cookie": `JSESSIONID = "${cookies[0]}" schoolname="${cookies[1]}"`
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(r => {
        return r.json()
    }).then(json => {
        console.log(json)
        return json
    })
}
