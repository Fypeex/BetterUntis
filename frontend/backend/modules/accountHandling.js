const fetches = require("./fetches.js");
const cookieHandler = require("./cookieHandler.js");
const fetch = require("axios")
const fetch2 = require("node-fetch")

//Dont touch this
//Init all variables needed to login/fetch the timetables and other data
///////////////////////////////////////////////////////////////////////////////////
//Data needed for the fetch                                                      //
/*                                                                               */
exports.getCookies = async function getCookies(url) {
        let method = "GET";
        url = url.split("?")[0]+"/?"+url.split("?")[1]
    console.log(url)
        return await fetch(url, {
            method: method
        }).then(r => {
            return r
        }).then(r => {
            let a = [undefined,undefined,undefined]
                let b = cookieHandler.getValueInCookies("JSESSIONID", r.headers["set-cookie"]);
                if(b!==null && b[0] !== undefined) a=b
                a.push(r.data.toString().split('"')[r.data.toString().split('"').indexOf("csrfToken") +2])

            return a
            }).catch(e => {
                console.log(e)
        })
        }
    /*                                                                                */
    /*                                                                                */
////////////////////////////////////////////////////////////////////////////////////


//LOGIN Dont touch this
////////////////////////////////////////////////////////////////////////////////

    /*                                                                            */
    exports.login = async function (url, value, JID, name,token,username,password) {
        let school = value.loginName
        let method = "POST";
        let data = `school=${school}&j_username=${username}&j_password=${password}&token=`;
        let cookies = `JSESSIONID="${JID}"; schoolname="${name}"`

        console.log(token)
        console.log(cookies)

        let traceId = await fetch2(url, {
            "headers": {
                "cookies":cookies,
                "accept": "application/json",
                "accept-language": "en,en-US;q=0.9,de-DE;q=0.8,de;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-csrf-token": token
            },
            "referrer": url,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": data,
            "method": method,
            "mode": "cors",
            "credentials": "include"
        }).then(r => {
            return r.json()
        })
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
