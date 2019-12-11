const params = require('./params')

function createTable(docs) {
    return docs.map(d => {
        const rowData = []
        rowData.push(d.dateStr) // date
        rowData.push(d.docNum) // doc number
        rowData.push(d.description) //
        rowData.push(d.status)

        if (d.withUrl()) {
            rowData.push(d.uploadedUrl)
            const link = params.uploadDocBasePath + `${d.url}`
            rowData.push({
                v: link,
                l: {
                    Target: link,
                    Tooltip: d.docNum,
                }
            })
        } else {
            rowData.push('-')
            rowData.push(d.emptyUrlText)
        }
        return rowData
    })
}

function getTableName(prefix = params.resultFileNamePrefix) {
    const date = new Date()
    return `${prefix}_${date.getDay()}_${date.getMonth()}_${date.getFullYear()}.xlsx`
}

function createApprovedDocsTable(approvedDocs) {
    return approvedDocs.map(d => {
        const rowData = []
        const link = params.uploadDocBasePath + `${d.url}`
        rowData.push(link)
        rowData.push(d.title)
        rowData.push(d.dateFrom || ' ')
        if (d.uploadedUrl !== null) {
            rowData.push(d.uploadedUrl)
        } else {
            rowData.push(d.error)
        }

        return rowData
    })
}

module.exports = {
    createTable,
    createApprovedDocsTable,
    getTableName,
}