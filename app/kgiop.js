const c = require('./constants')
const axios = require('axios')
const {JSDOM} = require('jsdom')
const Document = require('./Document')
const params = require('./params')
const ApprovedDocument = require("./ApprovedDocument");

function getDocuments() {
    return axios.get(params.docListHtmlPageUrl)
        .then(resp => {
            const dom = new JSDOM(resp.data)
            const rows = dom.window.document.querySelectorAll('div.page-content tr')
            // skip first heading row
            return Array.prototype.slice.call(rows, 1).map(Document.fromHtmlRow)
        })
}

function getApprovedDocs(page = 1) {
    return axios.get('https://kgiop.gov.spb.ru/dokumenty/docs/', {
        params: {
            'page': page,
            'querystring_key': 'page'
        }
    })
        .then(resp => {
            const dom = new JSDOM(resp.data)
            const rows = dom.window.document.querySelectorAll('ul.doclist li')
            // skip first heading row
            return Array.prototype.map.call(rows, ApprovedDocument.fromHtmlRow)
        })
}

module.exports = {
    getDocuments,
    getApprovedDocs,
}