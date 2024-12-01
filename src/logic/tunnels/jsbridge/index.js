import { nativeXhrRequest } from '../../../tools/xhr.js'

// 调用 sendRequestByJsBridge 这个jsbridge发送http请求
export function sendRequestByJsBridge(reqOptions) {
    // 此处我们用原生xhr模拟
    return nativeXhrRequest(reqOptions)
}

export function caniuse() {
    return true
}