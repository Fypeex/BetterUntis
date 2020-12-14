const fetches = require("./fetches.js");
const cookieHandler = require("./cookieHandler.js");
const axios = require("axios")

//LOGIN Dont touch this
////////////////////////////////////////////////////////////////////////////////
/*                                                                            */
/*                                                                            */
exports.login = async (url,username,password) => {
    return axios({
        method: "post",
        url: url.split("?")[0] + "/jsonrpc.do?" + url.split("?")[1],
        headers: {},
        data: {
            id: "ID",
            method: "authenticate",
            params: {
                user: username,
                password: password,
                client: "CLIENT"
            },
            jsonrpc: "2.0"
        }

    });
}
/*                                                                            */
/*                                                                            */
////////////////////////////////////////////////////////////////////////////////
//LOGOUT Dont touch this
////////////////////////////////////////////////////////////////////////////////
/*                                                                            */
/*                                                                            */
exports.logout = async function (url,username,password) {
    return axios({
        method: "post",
        url: url.split("?")[0] + "/jsonrpc.do?" + url.split("?")[1],
        headers: {},
        data: {
            id: "ID",
            method: "authenticate",
            params: {
                user: username,
                password: password,
                client: "CLIENT"
            },
            jsonrpc: "2.0"
        }

    });
}
/*                                                                            */
/*                                                                            */
////////////////////////////////////////////////////////////////////////////////
