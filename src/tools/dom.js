
// 执行script脚本
export function execScript(scriptContent) {
  const ele = document.createElement('script');
  ele.innerHTML = scriptContent;
  document.body.appendChild(ele);
  document.body.removeChild(ele);
}

export function getLocalStorageObject(localStorageKey) {
  try {
    const configStr = localStorage.getItem(localStorageKey)
    if (configStr) {
      return JSON.parse(configStr);
    }
  }
  catch (e) {
    return null;
  }
}

export function getUAInfo() {
  const ua = navigator.userAgent;
  const isAndroid = /Android/.test(ua);
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isWeixin = /MicroMessenger/.test(ua);
  const isQQ = /QQ/.test(ua);
  const isPC = !isAndroid && !isIOS;
  const lang = window.navigator.language;
  return {
    isAndroid,
    isIOS,
    isWeixin,
    isQQ,
    isPC,
    lang
  }
}