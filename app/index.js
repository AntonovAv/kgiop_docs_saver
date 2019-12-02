const fs = require('fs')
const xlsx = require('node-xlsx')
const {getDocuments, downloadDocument, uploadResults} = require("./yandex")
const sequential = require('promise-sequential')
const {createTable, getTableName} = require('./tableUtils')

getDocuments()
    .then((docs) => {
        const promises = docs.filter(d => d.withUrl()).map((d) => {
            return () => new Promise(resolve => {
                setTimeout(() => {
                    resolve(downloadDocument(d))
                }, 500)
            })
        })

        return sequential(promises)
            .then(() => {
                return docs
            })
    })
    .then(docs => {
        const data = createTable(docs)
        const fileName = getTableName()
        const buffer = xlsx.build([{name: `Results`, data}], {})
        const wstream = fs.createWriteStream(fileName)
        wstream.write(buffer)
        wstream.end()
        /*const wstream = fs.createReadStream()*/
        return 'OK'/*uploadResults(fileName, buffer)*/
    })
    .then(() => {
        console.log('OK')
    })
    .catch(console.error)
