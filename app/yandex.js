const c = require('./constants')
const axios = require('axios')
const params = require('./params')
const FormData = require('form-data')

const MAX_FILE_NAME_LENGTH = 255

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
                return document
            })
    )
}

function downloadApprovedDocument(approvedDocument) {
    const fileName = approvedDocument.title
        .replace(/\//g, '_')
        .replace(/:/g, ' ')
        .substring(0, MAX_FILE_NAME_LENGTH - 4)
    const targetPath = params.approvedDocsTargetDir + `/${fileName}.pdf`
    return Promise.resolve(
        downloadFile(targetPath, `${params.uploadDocBasePath}${approvedDocument.url}`)
            .then(() => {
                approvedDocument.upload(targetPath)
                return approvedDocument
            })
            .catch(error => {
                const response = error.response
                if(response.status === 400) {
                    approvedDocument.failedUpload(JSON.stringify(response.data))
                }
                throw error
            })
    )
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
    downloadApprovedDocument,
    uploadResults,
}