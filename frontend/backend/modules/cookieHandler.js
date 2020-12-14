// internal function
////////////////////////////////////////////////////////////////
/*                                                            */
/*                                                            */
exports.getValueInCookies = function getValueInCookies(s, cookies) {
        if(cookies === undefined) return null
        cookies=cookies.toString()
        let js = cookies.split("JSESSIONID")[1].split(";")[0].replace("=","")
        let name = cookies.split('schoolname="')[1].split('"')[0]

        let traceId = undefined
        if(cookies.indexOf("traceId") > -1) traceId = cookies.split('traceId=')[1].split(';')[0]

    return [js,name,traceId]
}
/*                                                             */
/*                                                             */