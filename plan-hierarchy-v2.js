/* 晓的工作台 V2：层级计划引擎 v2，兼容旧 month/week/day/task */
(function(){
const LEVELS={goal:'长期目标',month:'月计划',week:'周计划',day:'日计划',task:'知识点'};
function plans(){return window.data?.plans||[]}function tasks(){return window.data?.tasks||[]}
function normalize(p){if(!p.level)p.level='month';if(p.parentId===undefined)p.parentId=p.parent??null;if(p.parent===undefined)p.parent=p.parentId??null;if(!p.domain)p.domain=null;return p}
function parentOf(p){normalize(p);return p.parentId??p.parent??null}
function children(id){return plans().map(normalize).filter(p=>String(parentOf(p))===String(id))}
function directTasks(id){return tasks().filter(t=>String(t.planId)===String(id))}
function descendants(id,seen=new Set()){let key=String(id);if(seen.has(key))return[];seen.add(key);let out=[];children(id).forEach(c=>{if(!seen.has(String(c.id)))out.push(c,...descendants(c.id,seen))});return out}
function progress(id){let ids=[id,...descendants(id).map(p=>p.id)],a=tasks().filter(t=>t.planId!=null&&ids.some(x=>String(x)===String(t.planId))),done=a.filter(t=>t.done).length;if(a.length)return{done,total:a.length,pct:Math.round(done/a.length*100)};let cs=children(id);if(cs.length){let vals=cs.map(c=>progress(c.id).pct),sum=vals.reduce((a,b)=>a+b,0);return{done:sum,total:vals.length*100,pct:Math.round(sum/vals.length)}}let p=plans().find(x=>String(x.id)===String(id));return{done:p?.done?1:0,total:1,pct:p?.done?100:0}}
function roots(domain){return plans().map(normalize).filter(p=>!parentOf(p)&&(!domain||p.domain===domain))}
function migrate(){let changed=false;plans().forEach(p=>{let before=JSON.stringify(p);normalize(p);if(JSON.stringify(p)!==before)changed=true});if(changed){localStorage.setItem('xiao_workbench_v4',JSON.stringify(window.data));window.dispatchEvent(new CustomEvent('xiao:plans-migrated'))}}
window.PlanHierarchy={LEVELS,normalize,parentOf,children,directTasks,descendants,progress,roots,migrate};setTimeout(migrate,300);
})();