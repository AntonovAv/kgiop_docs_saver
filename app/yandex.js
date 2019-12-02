const c = require('./constants')
const axios = require('axios')
const {JSDOM} = require('jsdom')
const Document = require('./Document')
const params = require('./params')
const FormData = require('form-data')

function downloadFile(targetUrl, uploadUrl) {
    return (axios.post(
        c.YANDEX_UPLOAD_PATH,
        null,
        {
            params: {
                'path': targetUrl,
                'url': uploadUrl,
                'fields': 'public_url,path'
            },
            headers: {
                'Authorization': `OAuth ${params.authToken}`
            }
        }
    ).then(resp => {
        const statusUrl = resp.data.href
        return new Promise((resolve, reject) => {
            const checkStatus = () => {
                axios.get(statusUrl, {
                    headers: {
                        'Authorization': `OAuth ${params.authToken}`
                    }
                }).then((resp) => {
                    const status = resp.data.status
                    if (status === 'success') {
                        resolve()
                    } else if (status === 'in-progress') {
                        setTimeout(() => {
                            checkStatus()
                        }, 200)
                    } else {
                        reject(resp.data)
                    }
                }).catch(err => {
                    reject(err)
                })
            }
            checkStatus()
        })
    }))
}

function downloadDocument(document) {
    const targetPath = params.targetDirPath + `/${document.fileName}`
    return Promise.resolve(
        downloadFile(targetPath, `${params.uploadDocBasePath}${document.url}`)
            .then(() => {
                document.upload(targetPath)
                console.log(`Document ${document.docNum} downloaded`)
                return document
            })
    )
}

function getDocuments() {
    return axios.get(c.DOCS_PAGE_URL)
        .then(resp => {
            const dom = new JSDOM(resp.data)
            const rows = dom.window.document.querySelectorAll('div.page-content tr')
            console.log(`Found ${rows.length} rows`)

            return Array.prototype.slice.call(rows, 1).map(Document.fromHtmlRow)
        })
}

function uploadResults(fileName, fileData) {
    return axios.get(
        c.YANDEX_UPLOAD_PATH,
        {
            params: {
                'path': `${params.targetResultFilePath}/${fileName}`
            },
            headers: {
                'Authorization': `OAuth ${params.authToken}`
            }
        }
    ).then((resp) => {
        const href = resp.data.href
        const data = new FormData()
        //data.append('file', fileData)
        return axios.put(
            href,
            {},
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `OAuth ${params.authToken}`
                }
            }
        )
    })
}

module.exports = {
    downloadDocument,
    getDocuments,
    uploadResults,
}