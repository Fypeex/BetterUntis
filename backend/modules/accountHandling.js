const fetches = require("./fetches.js");
const cookieHandler = require("./cookieHandler.js");
const c = require("../config.json")


//Dont touch this
//Init all variables needed to login/fetch the timetables and other data
///////////////////////////////////////////////////////////////////////////////////
//Data needed for the fetch                                                      //
/*                                                                               */
exports.getCookies = async function getCookies(url) {
    let URL = url;
    let method = "GET";
    let data = null;
    let Fcookies = "";

    return await fetches.getData(URL, method, data, Fcookies).then(r => {
        let JSESSIONID = cookieHandler.getValueInCookies("JSESSIONID", r.headers["set-cookie"]);
        let schoolname = cookieHandler.getValueInCookies("schoolname", r.headers["set-cookie"]);

        return [JSESSIONID,schoolname]
    })
}
/*                                                                                */
/*                                                                                */
////////////////////////////////////////////////////////////////////////////////////



//LOGIN Dont touch this
////////////////////////////////////////////////////////////////////////////////

/*                                                                            */
exports.login = async function(url,school,JID,name) {
    let URL = url;
    let method = "POST";
    let data = `school=${name}&j_username=${c.username}&j_password="${c.password}&token=`;
    let cookies = `JSESSIONID=${JID}; schoolname=${school}`
    console.log(URL)
    console.log(data)
    console.log(cookies)

    let traceId = await fetches.getData(URL, method, data, cookies);

    console.log(traceId)

    traceId = cookieHandler.getValueInCookies("traceId", traceId.headers["set-cookie"]);
    return traceId
}
/*                                                                            */
/*                                                                            */
////////////////////////////////////////////////////////////////////////////////


exports.logout = async function logout(cookie) {
    let URL = "https://terpsichore.webuntis.com/WebUntis/saml/logout?local=true";
    let method = "GET";
    let data = null;
    let cookies = "JSESSIONID=" + cookie.JSESSIONID + "; schoolname=" + cookie.schoolname + "; traceId=" + cookie.traceId;

    await fetches.getData(URL, method, data, cookies);
}