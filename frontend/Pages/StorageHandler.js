import {AsyncStorage} from "react-native";
import {login} from "../backend/modules/accountHandling";
import {getTimeGrid,getDayTimeTable} from "../backend/modules/getTimeTable";
async function getCreds(navigation) {
    console.log(navigation)
    let creds = JSON.parse(await AsyncStorage.getItem("Creds"))
    if(creds === undefined) {
        navigation.navigate("LoginScreen")
    }else {
        return creds
    }
}


exports.getSchool = async(navigation) => {
    console.log(navigation)
    let school = JSON.parse(await AsyncStorage.getItem("School"))
    if (school === undefined || school === null) {
        navigation.navigate("SchoolSearch")
    }else {
        return school
    }
}

exports.getSession = async (navigation) => {
    let session = JSON.parse(await AsyncStorage.getItem("Session"));
    if(session === undefined || session === null) {
        let creds = getCreds()
        session = await login(school.serverUrl, creds.username, creds.password)
        session = session.data.result
    }

    return session
}
exports.getNewSession = async (navigation, school) => {
    let creds = await getCreds(navigation)
    let session = await login(school.serverUrl, creds.username, creds.password)
    session = session.data.result
    await AsyncStorage.setItem("Session",JSON.stringify(session))
    return session
}

exports.getGrid = async (navigation,school,session) => {
    let grid = JSON.parse(await AsyncStorage.getItem("timeGrid"))
    if (grid === undefined || grid === null) {
        grid = await getTimeGrid(school, session).then(r => {
            return r
        })
    }
    await AsyncStorage.setItem("timeGrid", JSON.stringify(grid))
    return grid
}