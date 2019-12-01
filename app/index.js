const fs = require('fs')
const xlsx = require('node-xlsx')
const {getDocuments, uploadDocument} = require("./yandex");

getDocuments()
    .then((docs) => {
        const promises = docs.filter(d => d.withUrl()).slice(0, 2).map((d) => {
            return uploadDocument(d)
        })
        promises.reduce(
            (p, ) => p.then(
                () => new Promise(
                    (resolve) => {
                        setTimeout(() => {
                            resolve();
                        }, 5000);

                    }
                )
            ),
            Promise.resolve()
        );
        return promises
    })
    .then(d => {
        console.log(d.uploadedUrl)
    })
/*
const dom = new JSDOM(fs.readFileSync(__dirname + '/../page.html'))
//fs.writeFileSync(__dirname + '/page.html', resp.data)
const rows = dom.window.document.querySelectorAll('div.page-content tr')
console.log(`Found ${rows.length} rows`)

const doc = []
Array.prototype.slice.call(rows, 1, 20).forEach(row => {
    const cells = row.querySelectorAll('td')
    const rowData = []
    rowData.push(cells[0].textContent.trim()) // date
    const docNum = cells[1].textContent.trim()
    rowData.push(docNum) // doc number
    rowData.push(cells[2].textContent.trim()) //
    rowData.push(cells[3].textContent.trim())

    const linkCell = cells[4]
    const link = linkCell.querySelector('a')
    if (!link) {
        console.log(`Document N:${docNum} without link: ${linkCell.textContent.trim()}`)
        rowData.push(null)
    } else {
        const linkToFile = `https://kgiop.gov.spb.ru${link.getAttribute('href')}`
        console.log(`Document N:${docNum} with link: ${linkToFile}`)
        rowData.push({
            v: linkToFile,
            l: {
                Target: linkToFile,
                Tooltip: docNum,
            }
        })
    }
    doc.push(rowData)
})
*/


// write document
/*const options = {}
const buffer = xlsx.build([{name: `Results`, data: doc}], options)
const wstream = fs.createWriteStream('res.xlsx')
wstream.write(buffer)
wstream.end()*/
