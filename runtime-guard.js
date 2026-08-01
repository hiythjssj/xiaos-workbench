/* 晓的工作台：运行时兼容保护 v1 */
(function(){
// 统一 modal 内容节点。旧模块有的查 modalContent，新版首页实际使用 modal。
if(!document.getElementById('modalContent')){let m=document.getElementById('modal');if(m)m.id='modalContent'}
// show/closeM 兼容层：确保增强模块始终能正常打开底部弹层。
if(typeof window.show!=='function')window.show=function(html){let m=document.getElementById('modalContent')||document.getElementById('modal'),bg=document.getElementById('mbg');if(m)m.innerHTML=html;if(bg)bg.classList.add('on')};
if(typeof window.closeM!=='function')window.closeM=function(){document.getElementById('mbg')?.classList.remove('on')};
// 防止某个增强模块异常导致整个页面 render 中断。
const nativeRender=window.render;window.render=function(){try{return nativeRender&&nativeRender()}catch(err){console.error('Workbench render recovered:',err);try{document.getElementById('dashboard')?.insertAdjacentHTML('afterbegin','<div class="card"><b>页面部分模块加载异常</b><div class="muted" style="margin:5px 0 0">核心数据仍保留。可刷新页面，或到“工作台状态与数据”检查。</div></div>')}catch(_){}}};
// 捕获扩展脚本错误，记录到本地，方便状态页诊断。
window.addEventListener('error',e=>{try{let a=JSON.parse(localStorage.getItem('xiao_runtime_errors')||'[]');a.unshift({time:new Date().toISOString(),message:String(e.message||'unknown'),source:String(e.filename||'').split('/').pop()});localStorage.setItem('xiao_runtime_errors',JSON.stringify(a.slice(0,10)))}catch(_){}});
window.getWorkbenchRuntimeErrors=function(){try{return JSON.parse(localStorage.getItem('xiao_runtime_errors')||'[]')}catch{return[]}};
})();