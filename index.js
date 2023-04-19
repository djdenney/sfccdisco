require("dotenv").config()
const { ocapi } = require("./connections/ocapi")
const { sfccam } = require("./connections/sfccam")

const abTests = {
    abTestSearch: async (siteId, searchData = {id: "", description: "", enabled: "", paused: "", key_metric_id: "", email_addresses: "", tags: "", expiration_type: "", start_date: "", end_date: ""}) => {
        const type = 'POST'
        const path = `/s/-/dw/data/v19_5/sites/${siteId}/ab_test_search`
        const data = Object.values(searchData).reduce((a, b, i) => {
            b && b !== "" && a.query.filtered_query.filter.bool_filter.filters.push({term_filter: {field: Object.keys(searchData)[i], operator: "is", values: [b]}})
            return a
        }, {
            query: {
                filtered_query: {
                    query: { match_all_query: {} },
                    filter: {
                        bool_filter: {
                            operator: "and",
                            filters: []
                        }
                    }
                }
             }
        })
        const response = await ocapi(type, path, data)
        return response
    }
}


module.exports = {
    abTests
}