/* 晓的工作台：运行时兼容保护 v2 */
(function(){
// 保留首页原生 #modal，避免原有 openModule/taskForm 等逻辑因节点改名失效。
function modalNode(){return document.getElementById('modalContent')||document.getElementById('modal')}
if(typeof window.show!=='function')window.show=function(html){let m=modalNode(),bg=document.getElementById('mbg');if(m)m.innerHTML=html;if(bg)bg.classList.add('on')};
// 给依赖 modalContent 的扩展模块提供查询兼容，同时不修改真实 DOM id。
const nativeGet=document.getElementById.bind(document);document.getElementById=function(id){if(id==='modalContent')return nativeGet('modalContent')||nativeGet('modal');return nativeGet(id)};
// 记录扩展脚本错误，便于状态页诊断。
window.addEventListener('error',e=>{try{let a=JSON.parse(localStorage.getItem('xiao_runtime_errors')||'[]');a.unshift({time:new Date().toISOString(),message:String(e.message||'unknown'),source:String(e.filename||'').split('/').pop()});localStorage.setItem('xiao_runtime_errors',JSON.stringify(a.slice(0,10)))}catch(_){}});
window.addEventListener('unhandledrejection',e=>{try{let a=JSON.parse(localStorage.getItem('xiao_runtime_errors')||'[]');a.unshift({time:new Date().toISOString(),message:String(e.reason?.message||e.reason||'Promise rejection'),source:'async'});localStorage.setItem('xiao_runtime_errors',JSON.stringify(a.slice(0,10)))}catch(_){}});
window.getWorkbenchRuntimeErrors=function(){try{return JSON.parse(localStorage.getItem('xiao_runtime_errors')||'[]')}catch{return[]}};
})();