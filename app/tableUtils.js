function createTable(docs) {
    docs.forEach(d => {
        const rowData = []
        rowData.push(d.dateStr) // date
        rowData.push(d.docNum) // doc number
        rowData.push(d.description) //
        rowData.push(d.status)

        if(d.withUrl()) {
         rowData.push(d.uploadedUrl)
         rowData.push(rowData.push({
             v: d.url,
             l: {
                 Target: d.url,
                 Tooltip: d.docNum,
             }
         }))
        } else {
            rowData.push(d.emptyUrlText)
        }
    })
}

function getTableName() {
    const date = new Date()
    return `Results_${date.getDay()}_${date.getMonth()}_${date.getFullYear()}.xlsx`
}

module.exports = {
    createTable,
    getTableName,
}