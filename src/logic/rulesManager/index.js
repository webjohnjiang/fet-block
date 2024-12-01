import { nativeXhrRequest, standardizationRequestOptions } from "../../tools/xhr";
import { getUAInfo, getLocalStorageObject } from "../../tools/dom";
import { getUrlDomain } from "../../tools/url";
import { getAllTunnelTypes, isCanIUseThisTunnel } from "../tunnels/index";

let configJsonUrl = process.env.NODE_ENV === 'production'
    ? `https://www.unpkg.com/fet@${pkgVersion}/dist/config.json`
    : '/dist/config.json'
if (window.fetBlockConfigUrl) configJsonUrl = window.fetBlockConfigUrl
const LOCAL_STORAGE_FET_BLOCK_CONFIG_KEY = 'fet_block_config_json'
let isFirstInitFlag = true;

const FET_BLOCK_CONFIG = {
    originConfig: {},
    userProperty: {},
    finalRules: {}
}

// 获取该用户属性所映射出的最终配置，且结构为 domain: [rule, rule]
function getConfigByUser(originConfig, userProperty) {
    const configMap = originConfig[userProperty.lang]
    for (const key in configMap) {
        if (configMap[key] && typeof configMap[key] === 'string') {
            configMap[key] = [configMap[key]]
        }
    }
    return configMap
}

export async function init() {
    console.log('init rulesManager')
    // 1. 拿出本地config配置
    const config = getLocalStorageObject(LOCAL_STORAGE_FET_BLOCK_CONFIG_KEY)
    if (config) {
        FET_BLOCK_CONFIG.originConfig = config
    }
    // 2. 计算出用户自身属性
    FET_BLOCK_CONFIG.userProperty = {
        lang: getUAInfo().lang
    }
    // 3.计算出当前用户属性所对应的最终配置
    // 若配置支持运营商/特殊uid等粒度，则需要对配置进行merge处理。此处暂时省略。
    // 这里暂且只做一个 country 级别的计算
    FET_BLOCK_CONFIG.finalRules = getConfigByUser(FET_BLOCK_CONFIG.originConfig, FET_BLOCK_CONFIG.userProperty) || {}
    window.FET_BLOCK_CONFIG = FET_BLOCK_CONFIG
    // 4. 异步拉取远程最新配置
    if (isFirstInitFlag) {
        isFirstInitFlag = false;
        const res = await nativeXhrRequest({
            url: configJsonUrl
        })
        localStorage.setItem(LOCAL_STORAGE_FET_BLOCK_CONFIG_KEY, res?.body)
        init()
    }
}

// 根据请求参数，找出该url命中的最佳规则. 最佳规则结构：{type: 'tunnel' | 'xhr', targetUrl: string}
export function getRuleByRequestUrl(reqOptions, isForceXHR) {
    const standardizationReqOptions = standardizationRequestOptions(reqOptions)
    const { finalRules } = FET_BLOCK_CONFIG
    // 1. 基于域名找出规则数组
    const domain = getUrlDomain(standardizationReqOptions?.url)
    const domainRules = finalRules[domain]
    if (!domainRules) {
        return {
            type: 'xhr',
            targetUrl: standardizationReqOptions?.url
        }
    }
    // 2. 遍历所有规则，找到第一个匹配的返回
    let bestRule = null
    for (const rule of domainRules) {
        if (getAllTunnelTypes().includes(rule)) {
            if (isCanIUseThisTunnel(rule) && !isForceXHR) {
                bestRule = {
                    type: 'tunnel',
                    targetUrl: standardizationReqOptions?.url,
                    tunnelApi: rule
                }
            }
            else {
                continue
            }
        }
        else {
            bestRule = {
                type: 'xhr',
                targetUrl: standardizationReqOptions?.url?.replace(domain, rule)
            }
        }
        return bestRule
    }
}

export function getXHRRuleByRequestUrl(reqOptions) {
    return getRuleByRequestUrl(reqOptions, true)
}