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
            const link = params.uploadDocBasePath + `/${d.url}`
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

function getTableName() {
    const date = new Date()
    return `${params.resultFileNamePrefix}_${date.getDay()}_${date.getMonth()}_${date.getFullYear()}.xlsx`
}

module.exports = {
    createTable,
    getTableName,
}