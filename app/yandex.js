const c = require('./constants')
const axios = require('axios')
const {JSDOM} = require('jsdom')
const Document = require('./Document')
const params = require('./params')

function uploadFile(targetUrl, uploadUrl) {
    return axios.post(
        c.YANDEX_UPLOAD_PATH,
        null,
        {
            params: {
                'path': targetUrl,
                'url': uploadUrl
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
                })
                    .then((resp) => {
                        const status = resp.data.status
                        if (status === 'success') {
                            resolve()
                        } else if (status === 'in-progress') {
                            setTimeout(() => {
                                checkStatus()
                            }, 300)
                        } else {
                            reject(resp.data)
                        }
                    })
                    .catch(err => {
                        reject(err)
                    })
            }
            checkStatus()
        })

    })
}

function uploadDocument(document) {
    const targetPath = params.targetDirPath + `/${document.fileName}`
    return Promise.resolve(
        uploadFile(targetPath, `${params.uploadDocBasePath}${document.url}`)
            .then(() => {
                document.upload(targetPath)
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

            return Array.prototype.slice.call(rows, 1, 20).slice(1, 20).map(Document.fromHtmlRow)
        })
}

module.exports = {
    uploadDocument,
    getDocuments
}