/* 晓的工作台 V2：兼容与旧界面清理层 */
(function(){
function C(){return window.WorkbenchCore}
function today(){return C()?C().today():new Date().toISOString().slice(0,10)}
function esc(x){return typeof e==='function'?e(x):String(x||'')}
/* 旧首页卡片仍由 index.html 生成，统一改为 V2 今日数据，避免未来任务混入 */
window.summaryCard=function(){let c=C();if(!c)return'';let keys=['civil','teacher','psy'],done=0,total=0;keys.forEach(k=>{let s=c.stats(k,{date:today()});done+=s.done;total+=s.total});let h=c.stats('health',{date:today()}),l=c.stats('life',{date:today()});return `<div class="summary"><div class="card"><div class="num">${done}/${total}</div><small>学习</small></div><div class="card"><div class="num">${h.done}/${h.total}</div><small>健康</small></div><div class="card"><div class="num">${l.done}/${l.total}</div><small>生活</small></div></div><div style="height:11px"></div>`}
window.tasksCard=function(){let c=C(),a=c?c.tasks(null,{date:today()}):(data.tasks||[]);return `<div class="card"><h3>今日任务</h3>${a.length?a.map(t=>`<div class="task ${t.done?'done':''}"><input type="checkbox" ${t.done?'checked':''} onchange="toggle(${t.id})"><div class="txt">${esc(t.text)}</div><span class="tag">${c&&c.domainOf(t)?c.DOMAIN[c.domainOf(t)].name:'其他'}</span></div>`).join(''):'<div class="muted">今天还没有任务。</div>'}<button class="mini" style="width:100%;margin-top:8px" onclick="taskForm()">＋ 添加今日任务</button></div>`}
/* 一级学习模块全部转到独立页面，旧 openModule 不再打开混合学习弹层 */
const oldOpen=window.openModule;window.openModule=function(id){if(id==='civil')return openCivilMasterPlan();if(id==='teacher')return openTeacherMaster();if(id==='psy')return openPsyMaster();return oldOpen&&oldOpen.apply(this,arguments)};
/* 旧 study 页面不再作为一级导航目标 */
const oldGo=window.go;window.go=function(el,id){if(id==='study'){if(typeof xiaoOpenStudyPage==='function')return xiaoOpenStudyPage('civil')}return oldGo&&oldGo.apply(this,arguments)};
/* 防止旧学习弹层残留在页面上 */
function cleanModal(){let m=document.getElementById('modal');if(!m||!m.parentElement?.classList.contains('on'))return;let text=(m.textContent||'').slice(0,180);if(/学习驾驶舱|学习总览/.test(text)&&!/今日执行/.test(text)){if(typeof closeM==='function')closeM()}}
new MutationObserver(()=>requestAnimationFrame(cleanModal)).observe(document.getElementById('modal'),{childList:true,subtree:true});
})();