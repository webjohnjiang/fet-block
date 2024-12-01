import { getPrototypeOf } from './lang.js'

export function getNativeXhr() {
  let xhrProto = window.XMLHttpRequest.prototype;
  while(xhrProto && getPrototypeOf(xhrProto) !== XMLHttpRequestEventTarget.prototype) {
    xhrProto = getPrototypeOf(xhrProto);
  }
  return xhrProto.constructor;
}

const nativeXMLHttpRequest = getNativeXhr();

// 使用原生
export async function nativeXhrRequest (options) {
  return new Promise(resolve => {
    const xhr = new nativeXMLHttpRequest();
    xhr.openUrl = options.url
    xhr.open(options.method || 'get', options.url)
    xhr.timeout = options.timeout || 5000
    xhr.responseType = options.responseType || 'text'
    xhr.onload = function () {
      // console.log('xhr onload', xhr.status, xhr.statusText, xhr.responseURL || '?', xhr.openUrl)
      if (xhr.responseType === 'text') {
        resolve({
          status: xhr.status,
          statusText: xhr.statusText,
          body: xhr.responseText,
          headers: xhr.getAllResponseHeaders()
        })
      } else {
        resolve(xhr.response)
      }
    }
    xhr.onerror = function (e) {
      reject(new Error('network error'))
    }
    xhr.ontimeout = function(e) {
      reject(new Error('network timeout'))
    }
    xhr.send()
  })
}

function toAbsoluteUrl(url) {
  const isAbsoluteUrl = /^([a-z]+:)?\/\//i.test(url)
  if (isAbsoluteUrl) return url
  const currentURL = new URL(window.location.href)
  const currentBaseURL = currentURL.origin + currentURL.pathname
  const absoluteTargetUrl = new URL(url, currentBaseURL)
  return absoluteTargetUrl.toString()
}

export function standardizationRequestOptions(reqOptions) {
  const { url = '', method = 'get', headers = {}, body } = reqOptions
  const newHeaders = {}
  for (const key in headers) {
    newHeaders[key.toLowerCase()] = headers[key]
  }
  return {
    url: toAbsoluteUrl(url),
    method: method.toLowerCase(),
    headers: newHeaders || {},
    body
  }
}

export function getResponseHeadersStr(headers) {
  if (!headers) return ''
  const headersStrArr = Object.keys(headers).map(key => {
    return (`${key}: ${headers[key]}`)
  })
  return headersStrArr.join('\r\n')
}