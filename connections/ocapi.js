const { fetchJson } = require("./utility/fetchJson");
const apiAuthUrl = `${process.env.PRD_URL}/dw/oauth2/access_token`;
const apiUrl = process.env.PRD_URL;
const apiUserName = process.env.PRD_USR;
const apiUserPassword = process.env.PRD_KEY;
const apiClient = process.env.PRD_CLI;
const apiClientPassword = process.env.PRD_CPW;
const apiClientAuthString = Buffer.from(`${apiUserName}:${apiUserPassword}:${apiClientPassword}`).toString('base64');

const authentication = async () => {
    try {
        const headers = new Headers();
        headers.append("Accept", "*/*")
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        headers.append("Authorization", `Basic ${apiClientAuthString}`);
        const url = `${apiAuthUrl}?client_id=${apiClient}&grant_type=urn:demandware:params:oauth:grant-type:client-id:dwsid:dwsecuretoken`
        const options = {
            method: "POST",
            headers: headers
        }
        const response = await fetchJson(url, options)
        const result = response.access_token
        return result
    } catch (error) {
        throw error
    }
}

const ocapi = async (method, path, data) => {
    try {
        const token = await authentication()
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `Bearer ${token}`);
        const url = `${apiUrl}${path}`
        const dataString = data ? JSON.stringify(data) : null
        const options = method === "GET" ? {
            method: method,
            headers,
        } : {
            method: method,
            headers,
            body: dataString
        }
        const response = await fetchJson(url, options)
        return response
    } catch (error) {
        throw error
    }   
}

module.exports = {
    ocapi
}