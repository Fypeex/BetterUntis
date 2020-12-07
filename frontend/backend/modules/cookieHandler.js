// internal function
////////////////////////////////////////////////////////////////
/*                                                            */
/*                                                            */
exports.getValueInCookies = function getValueInCookies(s, cookies) {
        if(cookies === undefined) return null
        let js = cookies.split("JSESSIONID")[1].split(";")[0].replace("=","")
        let name = cookies.split('schoolname="')[1].split('"')[0]

    return [js,name]
}
/*                                                             */
/*                                                             */