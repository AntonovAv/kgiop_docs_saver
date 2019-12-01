const DOCS_PAGE_URL = 'https://kgiop.gov.spb.ru/zaklyucheniya-gosudarstvennyh-istoriko-kulturnyh-ekspertiz/zaklyucheniya-gosudarstvennyh-istoriko-kulturnyh-ekspertiz'
const SOURCE_DOCS_BASE_PATH = 'https://kgiop.gov.spb.ru/'
const TARGET_FOLDER_PATH = '/kgiop_docs/2018'

const YANDEX_BASE_PATH = 'https://cloud-api.yandex.net:443/v1/disk'
const YANDEX_UPLOAD_PATH = `${YANDEX_BASE_PATH}/resources/upload`
const YANDEX_OPERATIONS_PATH = `${YANDEX_BASE_PATH}/operations`

module.exports = {
    DOCS_PAGE_URL,
    SOURCE_DOCS_BASE_PATH,
    TARGET_FOLDER_PATH,
    YANDEX_BASE_PATH,
    YANDEX_UPLOAD_PATH,
    YANDEX_OPERATIONS_PATH
}