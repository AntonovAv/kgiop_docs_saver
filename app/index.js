const fs = require('fs')
const xlsx = require('node-xlsx')
const {getDocuments, downloadDocument, uploadResults} = require("./yandex")
const sequential = require('promise-sequential')
const {createTable, getTableName} = require('./tableUtils')

console.log(`Process started at: ${new Date().toLocaleString()}`)
getDocuments()
    .then((docs) => {
        const docsWithLinks = docs.filter(d => d.withUrl())
        const nDocsWithLinks = docsWithLinks.length
        console.log(`Founded docs: ${docs.length}, with links for download: ${nDocsWithLinks}`)
        let counter = 0
        const promises = docsWithLinks.map((d) => {
            return () => new Promise(resolve => {
                setTimeout(() => {
                    resolve(downloadDocument(d).then(() => {
                        counter++
                        console.log(`Downloaded ${counter}/${nDocsWithLinks}, doc: ${d.docNum}`)
                    }))
                }, 200)
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
        console.log(`Process ended at: ${new Date().toLocaleString()}`)
    })
    .catch(console.error)
