import { init as initRulesManager } from './rulesManager/index.js'
import { init as initHookManager } from './hookManager/index.js'

function startFetBlock() {
    // 0. 防止2次初始化
    if (window._isInitFetBlock) return;

    // 1. 初始化用户规则
    initRulesManager()

    // 2. 初始化用户拦截
    initHookManager();

    // 3. 标记初始化完成
    window._isInitFetBlock = true
}

startFetBlock()

