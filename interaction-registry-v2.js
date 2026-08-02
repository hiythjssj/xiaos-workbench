/* 晓的工作台 V3.2：最终交互注册表。最后加载，只做动态转发、旧导航兼容与诊断。 */
(function(){
if(window.__xiaoFinalRegistryV32)return;window.__xiaoFinalRegistryV32=true;
window.XiaoActions={
 task(id,planId){let fn=window.xiaoStableTaskForm;if(typeof fn!=='function')return console.warn('[晓的工作台] 任务编辑器未加载');return fn(id,planId)},
 plan(id,level){let fn=window.planForm;if(typeof fn!=='function')return console.warn('[晓的工作台] 计划编辑器未加载');return fn(id,level)},
 close(){return window.closeM?.()},
 route(route){if(window.WorkbenchRouter)return WorkbenchRouter.show(route);if(route==='home')return window.setTab?.('today')},
 study(kind){if(window.WorkbenchRouter)return WorkbenchRouter.show(kind);return window.xiaoOpenStudyPage?.(kind)},
 life(){if(window.WorkbenchRouter)return WorkbenchRouter.show('life');return window.xiaoOpenLife?.()},
 settings(){return window.openWorkbenchSettings?.()}
};
window.taskForm=(id)=>window.XiaoActions.task(id,null);
window.xiaoTaskForm=(id,planId)=>window.XiaoActions.task(id,planId);
window.editPlan=(id)=>window.XiaoActions.plan(id);
window.xiaoCoreHome=()=>window.XiaoActions.route('home');
window.xiaoLeaveStudyPage=()=>window.XiaoActions.route('home');
/* 补齐学习页与总驾驶舱中仍在引用的旧动作名。 */
window.openCurrentAffairs=window.openCurrentAffairs||function(){return window.XiaoActions.study('civil')};
window.openDailyCockpit=window.openDailyCockpit||function(){return window.XiaoActions.route('home')};
window.openWeeklyReview=window.openWeeklyReview||function(){return window.XiaoActions.route('progress')};
window.go=function(el,tab){let route={today:'home',plans:'plans',more:'life'}[tab];if(tab==='study'){route='home';window.openXiaoSideNav?.()}else if(route&&window.WorkbenchRouter)WorkbenchRouter.show(route);else if(typeof window.setTab==='function')window.setTab(tab);document.querySelectorAll('.bottom .nav').forEach(n=>n.classList.toggle('on',n===el));return false};
window.xiaoInteractionAudit=function(){let missing=new Set(),checked=0;document.querySelectorAll('[onclick],[onchange],[onsubmit]').forEach(el=>{for(let attr of ['onclick','onchange','onsubmit']){let code=el.getAttribute(attr)||'',re=/\b([A-Za-z_$][\w$]*)\s*\(/g,m;while((m=re.exec(code))){let n=m[1];if(['if','for','while','switch','catch','function','confirm','alert','setTimeout'].includes(n))continue;checked++;if(typeof window[n]!=='function'&&!['classList'].includes(n))missing.add(n)}}});let out=[...missing];window.__xiaoLastAudit={checked,missing:out,time:Date.now()};if(out.length)console.warn('[晓的工作台] 缺失交互函数:',out);else console.info(`[晓的工作台] 交互审计通过，共检查 ${checked} 个函数调用`);return out};
setTimeout(window.xiaoInteractionAudit,1200);
})();