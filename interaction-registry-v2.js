/* 晓的工作台 V2：最终交互注册表 v2。此文件必须最后加载。 */
(function(){
/* 先捕获真实实现，再覆盖历史别名，避免 taskForm/xiaoTaskForm 相互递归 */
const impl={
 task:typeof window.xiaoStableTaskForm==='function'?window.xiaoStableTaskForm:(typeof window.xiaoTaskForm==='function'?window.xiaoTaskForm:window.taskForm),
 plan:window.planForm,
 close:window.closeM,
 life:window.xiaoOpenLife,
 settings:window.openWorkbenchSettings,
 study:window.xiaoOpenStudyPage
};
window.XiaoActions={
 task(id,planId){if(typeof impl.task!=='function')return console.warn('[晓的工作台] 任务编辑器未加载');return impl.task(id,planId)},
 plan(id,level){if(typeof impl.plan!=='function')return console.warn('[晓的工作台] 计划编辑器未加载');return impl.plan(id,level)},
 close(){return impl.close?.()},
 route(route){if(window.WorkbenchRouter)return WorkbenchRouter.show(route);if(route==='home'&&typeof setTab==='function')return setTab('today')},
 study(kind){if(window.WorkbenchRouter)return WorkbenchRouter.show(kind);return impl.study?.(kind)},
 life(){return impl.life?.()},settings(){return impl.settings?.()}
};
window.taskForm=(id)=>XiaoActions.task(id,null);
window.xiaoTaskForm=(id,planId)=>XiaoActions.task(id,planId);
window.editPlan=(id)=>XiaoActions.plan(id);
window.xiaoCoreHome=()=>XiaoActions.route('home');
window.xiaoLeaveStudyPage=()=>XiaoActions.route('home');
/* 扫描 onclick 中所有函数调用，不只检查第一个 */
window.xiaoInteractionAudit=function(){let missing=new Set(),checked=0;document.querySelectorAll('[onclick]').forEach(el=>{let code=el.getAttribute('onclick')||'',re=/\b([A-Za-z_$][\w$]*)\s*\(/g,m;while((m=re.exec(code))){let n=m[1];if(['if','for','while','switch','catch','function','confirm','alert'].includes(n))continue;checked++;if(typeof window[n]!=='function'&&!['classList'].includes(n))missing.add(n)}});let out=[...missing];if(out.length)console.warn('[晓的工作台] 缺失交互函数:',out);else console.info(`[晓的工作台] 交互审计通过，共检查 ${checked} 个函数调用`);return out};
setTimeout(xiaoInteractionAudit,1200);
})();