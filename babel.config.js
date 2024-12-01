import path from 'path'

export default {
    "presets": [
        ["@babel/preset-env", {
            "useBuiltIns": false,
            // "corejs": "3"
        }]
    ],
    // 命中include匹配的，则进行babel转换（转换目标以browserslistrc配置为准）
    include: function(f) {
        const res = [/src\/\w+\.js/].some(r => r.test(f.replace(new RegExp(`\\${path.sep}`, 'g'), '\/')))
        return res;
    },
}