// internal function
////////////////////////////////////////////////////////////////
/*                                                            */
/*                                                            */
exports.getValueInCookies = function getValueInCookies(s, cookies) {

    cookies = cookies.filter(i => i.includes(s))
        .toString()
        .split(";")

        .filter(i => i.includes(s))
        .toString()

    return cookies.split(s)[1]
        .replace(/"/g, "")
        .substr(1)
}
/*                                                             */
/*                                                             */