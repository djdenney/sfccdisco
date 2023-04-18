const { fetchJson } = require("./utility/fetchJson");
const apiAuthUrl = `${process.env.SAM_URL}/dw/oauth2/access_token`;
const apiUrl = process.env.SAM_URL;
const apiClient = process.env.SAM_CLI;
const apiClientPassword = process.env.SAM_CPW;
const apiClientAuthString = Buffer.from(`${apiClient}:${apiClientPassword}`).toString('base64');


const authentication = async () => {
    try {
        const headers = new Headers()
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        headers.append("Accept", "*/*")
        headers.append("Authorization", `Basic ${apiClientAuthString}`);
        const url = apiAuthUrl
        const options = {
            method: "POST",
            headers,
            body: "grant_type=client_credentials"
        }
        const response = await fetchJson(url, options);
        return response.access_token
    } catch (error) {
        console.log(`error in sfccClientAuth function: ${error}`)
    }
}

const sfccam = async (method, path, data) => {
    try {
        const token = await authentication()
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `Bearer ${token}`);
        const url = `${apiUrl}${path}`
        const dataString = data ? JSON.stringify(data) : null
        const options = method === "GET" || method === "DELETE" ? {
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
    sfccam
}