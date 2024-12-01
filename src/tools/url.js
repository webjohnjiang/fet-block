
export function getUrlDomain(url) {
    try {
        const urlObj = new URL(url)
        return urlObj.hostname
    }
    catch(err) {
        return ''
    }
}