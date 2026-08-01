/* 晓的工作台 V2：统一数据与领域核心 */
(function(){
const DOMAIN={
 civil:{name:'公务员',areas:['civil','xingce','shenlun','current','errors','mock'],words:/公务员|公考|行测|申论|时政/},
 teacher:{name:'教师编',areas:['teacher'],words:/教师编|教师招聘|教综/},
 psy:{name:'心理学',areas:['psy'],words:/心理学/},
 health:{name:'健康',areas:['health'],words:/健康|运动|睡眠|饮水/},
 life:{name:'生活',areas:['life'],words:/生活|家务|整理/}
};
const KNOWN=new Set(Object.values(DOMAIN).flatMap(x=>x.areas));
function today(){return new Date().toISOString().slice(0,10)}
function normalizeTask(t){if(!t)return t;if(!t.date)t.date=today();if(!t.priority)t.priority='medium';if(t.planId===undefined)t.planId=null;if(t.note===undefined)t.note='';return t}
function domainOf(t){normalizeTask(t);let a=String(t.area||'').toLowerCase();for(const [k,c] of Object.entries(DOMAIN))if(c.areas.includes(a))return k;if(a&&KNOWN.has(a))return null;let text=String(t.text||'');for(const [k,c] of Object.entries(DOMAIN))if(c.words.test(text))return k;return null}
function tasks(domain,opts={}){let a=(window.data?.tasks||[]).map(normalizeTask);if(domain)a=a.filter(t=>domainOf(t)===domain);if(opts.date)a=a.filter(t=>t.date===opts.date);if(opts.done!==undefined)a=a.filter(t=>!!t.done===opts.done);return a}
function stats(domain,opts={}){let a=tasks(domain,opts),done=a.filter(t=>t.done).length;return{total:a.length,done,pending:a.length-done,pct:a.length?Math.round(done/a.length*100):0}}
function plans(domain){let all=window.data?.plans||[];if(!domain)return all;return all.filter(p=>p.domain===domain||tasks(domain).some(t=>t.planId===p.id))}
function migrate(){if(!window.data)return;let changed=false;(data.tasks||[]).forEach(t=>{let before=JSON.stringify(t);normalizeTask(t);let d=domainOf(t);if(d&&!t.domain)t.domain=d;if(JSON.stringify(t)!==before)changed=true});if(changed&&typeof save==='function')save()}
window.WorkbenchCore={DOMAIN,today,normalizeTask,domainOf,tasks,stats,plans,migrate};
setTimeout(migrate,300);
})();