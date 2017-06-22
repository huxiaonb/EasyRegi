
// 提示依赖 underscore
if(!window._){
    throw new Error('require underscore.js, download underscore: http://underscorejs.org/')
}

// 提示依赖 jQuery
if(!window.jQuery){
    throw new Error("require jQuery.js, download jQuery: http://jquery.com/")
}

// 暴露组件
export const Lego = require('./components').default

export default Lego;