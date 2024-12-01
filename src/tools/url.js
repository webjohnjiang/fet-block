
export function getUrlDomain(url) {
    try {
        const urlObj = new URL(url)
        return urlObj.hostname
    }
    catch(err) {
        return ''
    }
}

export function getAllUrlParams(url) {
    const queryStr = url.split('#')[0].split('?')[1] || ''
    const obj = {}
    queryStr.split('&').forEach(item => {
        const [key, value] = item.split('=')
        obj[key] = value
    })
    return obj
}

export function getUrlParams(url, name) {
    return getAllUrlParams(url)[name]
}