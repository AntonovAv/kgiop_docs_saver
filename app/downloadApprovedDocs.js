const xlsx = require("node-xlsx");
const fs = require('fs')
const sequential = require('promise-sequential')
const {downloadApprovedDocument} = require("./yandex")
const {getTableName} = require("./tableUtils")
const {createApprovedDocsTable} = require("./tableUtils")
const {getApprovedDocs} = require("./kgiop")

const LAST_PAGE = 295
console.log(`Process started at: ${new Date().toLocaleString()}`)

function downloadAllPages() {
    let currentPage = 1
    const allDocs = []
    const downloadPart = () => {
        return getApprovedDocs(currentPage)
            .then((docs) => {
                allDocs.push(...docs)
                console.log(`Page: ${currentPage}. Downloaded ${allDocs.length} approved documents.`)
                if (currentPage >= LAST_PAGE) {
                    return Promise.resolve(allDocs)
                } else {
                    currentPage++
                    return downloadPart()
                }
            })
    }

    return downloadPart()
}

downloadAllPages()
    .then((docs) => {
        const docsLength = docs.length
        console.log(`Founded approved docs for download: ${docs.length}`)
        let counter = 0
        const promises = docs.map((d) => {
            return () => new Promise(resolve => {
                setTimeout(() => {
                    resolve(
                        downloadApprovedDocument(d)
                            .then(() => {
                                counter++
                                console.log(`Downloaded ${counter}/${docsLength}, doc: ${d.url}`)
                            })
                            .catch(() => {
                                counter++
                                console.log(`Failed ${counter}/${docsLength}, error: ${d.error}`)
                            })
                    )
                }, 200)
            })
        })

        return sequential(promises)
            .then(() => {
                return docs
            })
    })
    .then(docs => {
        const data = createApprovedDocsTable(docs)
        const fileName = getTableName('ApprovedDocs')
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