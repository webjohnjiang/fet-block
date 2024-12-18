import { getDomainReplaceRuleByRequestUrl } from "../rulesManager/index.js"
import { FetBlockXMLHttpRequest } from './fetBlockXHR.js'
import { printDebugLog } from "../../tools/log.js"

// 替换url中的域名部分
function fetBlockReplaceUrl(url) {
    const bestXHRRule = getDomainReplaceRuleByRequestUrl({
        url
    })
    if (bestXHRRule) {
        return bestXHRRule.targetUrl
    }
    return url
}

function hookXMLHttpRequest() {
    if (!window.XMLHttpRequest?.isFetBlockXHR) {
        window.XMLHttpRequest = FetBlockXMLHttpRequest
    }
}

function hookFetch() {
    if (!window.fetch) return
    const originFetch = window.fetch
    window.fetch = function(resource, ...rest) {
        if (typeof resource === 'string') {
            return originFetch.call(this, fetBlockReplaceUrl(resource), ...rest)
        }
        return originFetch.call(this, resource, ...rest)
    }
}

export function init() {
    printDebugLog('init hookmanager')
    hookXMLHttpRequest()
    printDebugLog('hook xhr')
    hookFetch()
    printDebugLog('hook fetch')
}