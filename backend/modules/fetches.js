//Author: Felix Jungbluth

const axios = require("axios");

exports.getData = async function getData (URL,method,data,cookies) {
    let response =  axios({
        method: method,
        url : URL,
        data: data,
        headers: {
            "cookie": cookies,
        }
    }).then(res => {
        return res;
    }).catch(err => console.log(err))
    return await response
}