/*!
 * 模块名称：@ltd/j-orderify
 * 模块功能：返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。
   　　　　　Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string.
 * 模块版本：1.0.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-orderify/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-orderify/
 */
(function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).orderify=t()})(this,function(){"use strict";const{defineProperty:e,deleteProperty:t,ownKeys:n}=Reflect,o=new WeakMap,r=Object.create(null,{defineProperty:{value:(t,n,r)=>!!e(t,n,r)&&(o.get(t).add(n),!0)},deleteProperty:{value:(e,n)=>!!t(e,n)&&(o.get(e).delete(n),!0)},ownKeys:{value:e=>[...o.get(e)]}});return(()=>{const e=e=>(o.set(e,new Set(n(e))),new Proxy(e,r));return e.version="1.0.0",e.orderify=e.default=e})()});
//# sourceMappingURL=j-orderify.min.js.map