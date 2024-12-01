import { getUrlParams } from "./url";

export function printDebugLog(...args) {
    const isDebug = getUrlParams(window.location.href, 'fetblock_debug');
    if (isDebug) {
        console.warn(...args);
    }
}