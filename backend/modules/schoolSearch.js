const fetches = require("./fetches.js")
//Dont touch this
//Init all variables needed to login/fetch the timetables and other data
///////////////////////////////////////////////////////////////////////////////////
//Data needed for the fetch                                                      //
/*                                                                               */
/*                                                                               */
    exports.searchSchool = async function searchSchool(query) {
        let URL = "https://mobile.webuntis.com/ms/schoolquery2"
        let method = "POST"
        let data = {
            id: `wu_schulsuche-${Date.now()}`,
            method: "searchSchool",
            params: [{
                search: query
            }],
            jsonrpc:"2.0"
        }

    return await fetches.getData(URL,method,data, "")
}
/*                                                                                */
/*                                                                                */
////////////////////////////////////////////////////////////////////////////////////