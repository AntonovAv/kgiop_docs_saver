class Document {
    constructor(dateStr, docNum, description, statusText = "", url = null) {
        this.dateStr = dateStr
        this.docNum = docNum
        this.description = description
        this._url = url;
        this._uploadedUrl = null
    }

    static fromHtmlRow(row) {
        const cells = row.querySelectorAll('td')
        const dateStr = cells[0].textContent.trim() // date
        const docNum = cells[1].textContent.trim()
        const description = cells[2].textContent.trim()
        const statusText = cells[3].textContent.trim()

        const linkCell = cells[4]
        const link = linkCell.querySelector('a')
        let url = null
        if (link) {
            url = link.getAttribute('href')
        }

        return new Document(dateStr, docNum, description, statusText, url)
    }


    get url() {
        return this._url;
    }

    get fileName() {
        return this.docNum.replace('/', '_')
    }

    get uploadedUrl() {
        return this._uploadedUrl;
    }

    withUrl() {
        return this._url !== null
    }

    upload(uploadedUrl) {
        this._uploadedUrl = uploadedUrl
    }
}

module.exports = Document