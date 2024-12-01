import { sendRequestByJsBridge, caniuse as canIUseSendRequestByJsBridge } from './jsbridge/index.js'

// 实现jsbridge调用能力

// 根据通道类型，调用对应的通道api发请求
/**
 * Sends a request using the specified tunnel type.
 * 
 * @param {Object} reqOptions - The options for the request.
 * @param {string} tunnelApiName - The type of tunnel to use for sending the request.
 * @returns {Promise} A promise that resolves with the response from the request.
 * 
 * @example
 * sendRequestByTunnel({ url: 'https://example.com' }, 'sendRequestByJsBridge');
 */
export async function sendRequestByTunnel(reqOptions, tunnelApiName) {
    switch (tunnelApiName) {
        case 'sendRequestByJsBridge':
            // 调用webview通道api发请求
            return sendRequestByJsBridge(reqOptions)
        default:
            break;
    }
}

/**
 * Checks if the specified tunnel type can be used.
 * @param {string} tunnelType - The type of tunnel to check.
 * @returns {boolean} - True if the tunnel type can be used, otherwise false.
 */
export function isCanIUseThisTunnel(tunnelType) {
    if (tunnelType === 'sendRequestByJsBridge') {
        return canIUseSendRequestByJsBridge()
    }
    return false
}

export function getAllTunnelTypes() {
    return ['sendRequestByJsBridge']
}