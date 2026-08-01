/* 晓的工作台：稳定性与移动端整合层 v1 */
(function(){
// 统一补充样式，避免后续模块各自依赖 textarea/button 的偶然样式
const css=document.createElement('style');css.textContent=`.modal textarea{width:100%;padding:11px;margin:5px 0 10px;border:1px solid var(--line);border-radius:10px;background:white;color:var(--ink);font:inherit;resize:vertical}.modal label{display:inline-flex;align-items:center;gap:7px;margin:5px 0 8px;font-size:13px}.modal label input{width:auto;margin:0}.module,.btn,.mini,.chip{touch-action:manipulation}.modal .row{flex-wrap:wrap}.modal .row>.mini,.modal .row>.btn{min-width:90px}@media(max-width:420px){main{padding:12px}.card{padding:13px}.modal{padding:15px}.summary{gap:6px}.task{gap:7px}.task .mini{padding:5px 7px}.node .row>*{flex:1 1 42%}}`;document.head.appendChild(css);
// 防止多层脚本增强 dashboard 后出现重复入口
function dedupe(root){if(!root)return;let seen=new Set();root.querySelectorAll('[id]').forEach(el=>{if(seen.has(el.id))el.remove();else seen.add(el.id)})}
const oldRender=window.render;window.render=function(){if(typeof oldRender==='function')oldRender();dedupe(document.getElementById('dashboard'))};
// 为扩展脚本提供安全保存，避免某个旧函数不存在时整页报错
window.safeWorkbenchSave=function(){try{localStorage.setItem('xiao_workbench_v4',JSON.stringify(data));if(typeof render==='function')render();if(typeof queueCloud==='function')queueCloud()}catch(err){console.warn('workbench save failed',err)}};
// 检查关键模块是否已经成功加载
window.workbenchHealth=function(){let checks=[['计划增强','openPlanCenter'],['教综中心','openTeacherHub'],['教综同步','teacherReviewQueue'],['心理学中心','openPsychologyPro'],['论文精读','openPaperWorkflow'],['知识网络','openPsyNetwork'],['心理学复习','openPsyReview'],['每日驾驶舱','openDailyCockpit'],['周复盘','openWeeklyReview']];return checks.map(x=>({name:x[0],ok:typeof window[x[1]]==='function'}))};
window.openWorkbenchHealth=function(){let c=workbenchHealth(),ok=c.filter(x=>x.ok).length;show(`<h3>🛠️ 工作台状态</h3><div class="muted">已加载 ${ok}/${c.length} 个核心增强模块。</div>${c.map(x=>`<div class="task"><div class="txt">${x.name}</div><span class="tag">${x.ok?'正常':'待加载'}</span></div>`).join('')}<div class="muted" style="margin-top:10px">如果刚更新网页，刷新一次即可加载最新脚本。</div>`)};
// “更多”页提供低干扰诊断入口
const oldOther=window.render;setTimeout(()=>{let more=document.getElementById('otherModules');if(more&&!document.getElementById('healthCheckEntry')){let b=document.createElement('button');b.id='healthCheckEntry';b.className='mini';b.style.width='100%';b.style.margin='8px 0 12px';b.textContent='🛠️ 检查工作台状态';b.onclick=openWorkbenchHealth;more.parentNode.insertBefore(b,more.nextSibling)}},300);
})();