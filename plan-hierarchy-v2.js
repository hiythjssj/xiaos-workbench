/* 晓的工作台 V2：层级计划引擎 v1 */
(function(){
const LEVELS={goal:'长期目标',month:'月计划',week:'周计划'};
function plans(){return window.data?.plans||[]}
function tasks(){return window.data?.tasks||[]}
function normalize(p){if(!p.level)p.level='month';if(p.parentId===undefined)p.parentId=null;if(!p.domain)p.domain=null;return p}
function children(id){return plans().map(normalize).filter(p=>String(p.parentId)===String(id))}
function directTasks(id){return tasks().filter(t=>String(t.planId)===String(id))}
function descendants(id){let out=[];children(id).forEach(c=>{out.push(c,...descendants(c.id))});return out}
function progress(id){let ids=[id,...descendants(id).map(p=>p.id)],a=tasks().filter(t=>ids.some(x=>String(x)===String(t.planId))),done=a.filter(t=>t.done).length;if(a.length)return{done,total:a.length,pct:Math.round(done/a.length*100)};let cs=children(id);if(cs.length){let vals=cs.map(c=>progress(c.id).pct);return{done:vals.reduce((a,b)=>a+b,0),total:vals.length*100,pct:Math.round(vals.reduce((a,b)=>a+b,0)/vals.length)}}let p=plans().find(x=>String(x.id)===String(id));return{done:p?.done?1:0,total:1,pct:p?.done?100:0}}
function roots(domain){return plans().map(normalize).filter(p=>!p.parentId&&(!domain||p.domain===domain))}
function migrate(){let changed=false;plans().forEach(p=>{let before=JSON.stringify(p);normalize(p);if(JSON.stringify(p)!==before)changed=true});if(changed&&typeof save==='function')save()}
window.PlanHierarchy={LEVELS,normalize,children,directTasks,descendants,progress,roots,migrate};setTimeout(migrate,500);
})();