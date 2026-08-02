/* 晓的工作台 V2：最终交互注册表。此文件必须最后加载。 */
(function(){
function pick(){return {
 task:window.xiaoStableTaskForm||window.xiaoTaskForm||window.taskForm,
 plan:window.planForm,
 close:window.closeM,
 life:window.xiaoOpenLife,
 settings:window.openWorkbenchSettings
}}
const stable=pick();
window.XiaoActions={
 task(id,planId){return (window.xiaoStableTaskForm||stable.task)?.(id,planId)},
 plan(id,level){return stable.plan?.(id,level)},
 close(){return stable.close?.()},
 route(route){if(window.WorkbenchRouter)return WorkbenchRouter.show(route);if(route==='home'&&typeof setTab==='function')return setTab('today')},
 study(kind){if(window.WorkbenchRouter)return WorkbenchRouter.show(kind);return window.xiaoOpenStudyPage?.(kind)},
 life(){return stable.life?.()},settings(){return stable.settings?.()}
};
/* 最常被历史脚本覆盖的入口统一固定到注册表 */
window.taskForm=(id)=>XiaoActions.task(id,null);
window.xiaoTaskForm=(id,planId)=>XiaoActions.task(id,planId);
window.editPlan=(id)=>XiaoActions.plan(id);
window.xiaoCoreHome=()=>XiaoActions.route('home');
window.xiaoLeaveStudyPage=()=>XiaoActions.route('home');
/* 运行时诊断：按钮引用不存在函数时给出明确日志 */
window.xiaoInteractionAudit=function(){let missing=new Map();document.querySelectorAll('[onclick]').forEach(el=>{let code=el.getAttribute('onclick')||'',m=code.match(/^\s*([A-Za-z_$][\w$]*)\s*\(/);if(m&&typeof window[m[1]]!=='function'){if(!missing.has(m[1]))missing.set(m[1],[]);missing.get(m[1]).push(el)}});if(missing.size)console.warn('[晓的工作台] 仍有缺失交互函数:',[...missing.keys()]);return [...missing.keys()]};
setTimeout(xiaoInteractionAudit,1200);
})();