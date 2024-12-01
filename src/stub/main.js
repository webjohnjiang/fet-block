import { nativeXhrRequest } from "../tools/xhr";
import { execScript } from '../tools/dom';
import { printDebugLog } from '../tools/log';
import { getUrlParams } from "../tools/url";

const logicUrl = {
  prod: getUrlParams(window.location.href, 'fetblock_debug') ? `https://www.unpkg.com/fet-block@${pkgVersion}/dist/fetBlockLogic@${pkgVersion}.umd.js` : `https://www.unpkg.com/fet-block@${pkgVersion}/dist/fetBlockLogic@${pkgVersion}.umd.min.js`,
  dev: `/dist/fetBlockLogic@${pkgVersion}.umd.js`
}[process.env.NODE_ENV]

const LOCAL_STORAGE_FET_BLOCK_LOGIC_KEY = 'fet_block_logic_js_content'

export async function init(options = {}) {
  printDebugLog('stub exec', logicUrl)
  if (options.configUrl) {
    window.fetBlockConfigUrl = configUrl
  }
  // 1. 读取本地配置并执行
  const logicContentFromLocal = localStorage.getItem(LOCAL_STORAGE_FET_BLOCK_LOGIC_KEY)
  if (logicContentFromLocal && logicContentFromLocal.includes('fetBlock')) {
    execScript(logicContentFromLocal);
  }
  // 2. 异步拉取远程配置
  const logicContent = await nativeXhrRequest({
    url: logicUrl,
    method: 'get'
  })
  localStorage.setItem(LOCAL_STORAGE_FET_BLOCK_LOGIC_KEY, logicContent?.body)
  if (!logicContentFromLocal && logicContent?.body && logicContent?.body.includes('fetBlock')) {
    execScript(logicContent?.body)
  }
}