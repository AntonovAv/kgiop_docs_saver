class ApprovedDocument {
    constructor(url, title, dateFrom = null) {
        this._url = url
        this._title = title
        this._dateFrom = dateFrom
        this._uploadedUrl = null
        this._error = null
    }

    static fromHtmlRow(row) {
        const linkElement = row.querySelector('.doc-item')
        const url = linkElement.getAttribute('href')
        const title = row.querySelector('.doc-item-title')
        const dateFrom = row.querySelector('.doc-item-date')

        return new ApprovedDocument(
            url,
            title.textContent.trim(),
            dateFrom && dateFrom.textContent.trim()
        )
    }

    get url() {
        return this._url;
    }

    get title() {
        return this._title;
    }

    get dateFrom() {
        return this._dateFrom;
    }

    get uploadedUrl() {
        return this._uploadedUrl;
    }

    get error() {
        return this._error;
    }

    upload(uploadedUrl) {
        this._uploadedUrl = uploadedUrl
    }

    failedUpload(error) {
        this._error = error
    }
}

module.exports = ApprovedDocument