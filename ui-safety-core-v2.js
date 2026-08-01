/* 晓的工作台 V2：弹窗、导航、生活页交互安全层 */
(function(){
window.closeM=function(){let bg=document.getElementById('mbg');if(bg)bg.classList.remove('on');let m=document.getElementById('modal');if(m)setTimeout(()=>{if(!document.getElementById('mbg')?.classList.contains('on'))m.innerHTML=''},180)};
function bindModal(){let bg=document.getElementById('mbg');if(!bg||bg.dataset.safeBound)return;bg.dataset.safeBound='1';bg.addEventListener('click',ev=>{if(ev.target===bg)closeM()})}
window.xiaoOpenLife=function(){document.body.classList.remove('xiao-study-page','xiao-core-page');if(window.WorkbenchRouter)return WorkbenchRouter.show('life');if(typeof setTab==='function')setTab('more')};
window.xiaoLifeAddTask=function(){let fn=window.xiaoStableTaskForm||window.xiaoTaskForm||window.taskForm;if(typeof fn!=='function')return;fn();setTimeout(()=>{let a=document.getElementById('xstArea');if(a){a.value='life';a.dispatchEvent(new Event('change',{bubbles:true}))}},30)};
window.xiaoHealthAddTask=function(){let fn=window.xiaoStableTaskForm||window.xiaoTaskForm||window.taskForm;if(typeof fn!=='function')return;fn();setTimeout(()=>{let a=document.getElementById('xstArea');if(a){a.value='health';a.dispatchEvent(new Event('change',{bubbles:true}))}},30)};
/* 统一页面内带 data-route 的导航按钮 */
document.addEventListener('click',ev=>{let el=ev.target.closest('[data-route]');if(!el)return;let r=el.dataset.route;if(!r)return;ev.preventDefault();if(window.WorkbenchRouter)WorkbenchRouter.show(r)});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'){if(document.getElementById('mbg')?.classList.contains('on'))closeM();else closeXiaoSideNav?.()}});
/* 防止表单按钮默认 submit 造成页面刷新 */
function audit(){bindModal();document.querySelectorAll('button:not([type])').forEach(b=>{if(b.closest('form')&&!/保存|提交|登录|确认/.test(b.textContent||''))b.type='button'})}
new MutationObserver(()=>requestAnimationFrame(audit)).observe(document.body,{childList:true,subtree:true});audit();
})();