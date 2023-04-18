const fetchJson = async (url, options) => {
    try {
        const response = await fetch(url, options);
        const payload = await response.json();
        if (payload.error) {
            return Promise.reject({ message: payload.error });
        }
        return payload;
    } catch (error) {
        return null
    }
};

module.exports = {
    fetchJson
}