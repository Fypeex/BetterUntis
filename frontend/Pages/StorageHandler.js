import {AsyncStorage} from "react-native";
import {login} from "../backend/modules/accountHandling";
import {getTimeGrid,getDayTimeTable} from "../backend/modules/getTimeTable";
async function getCreds() {
    let creds = JSON.parse(await AsyncStorage.getItem("Creds"))
    if(creds === undefined) {
        return null
    }else {
        return creds
    }
}


exports.getSchool = async() => {
    let school = JSON.parse(await AsyncStorage.getItem("School"))
    if (school === undefined || school === null) {
        return null
    }else {
        return school
    }
}

exports.getSession = async () => {
    let school = await exports.getSchool()
    let session = JSON.parse(await AsyncStorage.getItem("Session"));
    console.log(school)
    if(session === undefined || session === null) {
        let creds = await getCreds()
        if(creds === null ||creds === undefined || school === null || school===undefined) return null
        else {
            session = await login(school.serverUrl, creds.username, creds.password)
            session = session.data.result
        }
    }

    return session
}
exports.getNewSession = async () => {
    let creds = await getCreds()
    let school = await exports.getSchool()
    console.log(school)
    if(creds === null ||creds === undefined || school === null || school===undefined) return null

    let session = await login(school.serverUrl, creds.username, creds.password)
    session = session.data.result
    await AsyncStorage.setItem("Session", JSON.stringify(session))

    return session
}

exports.getGrid = async (school,session) => {
    let grid = JSON.parse(await AsyncStorage.getItem("timeGrid"))
    if (grid === undefined || grid === null) {
        grid = await getTimeGrid(school, session).then(r => {
            return r
        })
    }
    await AsyncStorage.setItem("timeGrid", JSON.stringify(grid))
    return grid
}