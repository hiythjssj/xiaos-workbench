/* 晓的工作台：扩展数据云同步 v2，首次升级保护本地新数据 */
(function(){
const EXTRA_KEYS=['xiao_study_hubs_v2','xiao_psychology_hub_v1','xiao_weekly_reflections','xiao_current_affairs_v1'];
const META='xiao_cloud_sync_meta_v2';
function readJSON(k,f=null){try{let v=localStorage.getItem(k);return v===null?f:JSON.parse(v)}catch{return f}}
function packExtras(){let out={};EXTRA_KEYS.forEach(k=>{let v=readJSON(k,undefined);if(v!==undefined)out[k]=v});return out}
function hasLocalExtras(){return EXTRA_KEYS.some(k=>localStorage.getItem(k)!==null)}
function applyExtras(extras,{preserveLocal=false}={}){if(!extras||typeof extras!=='object')return;EXTRA_KEYS.forEach(k=>{if(!Object.prototype.hasOwnProperty.call(extras,k))return;if(preserveLocal&&localStorage.getItem(k)!==null)return;localStorage.setItem(k,JSON.stringify(extras[k]))})}
function markSync(){localStorage.setItem(META,JSON.stringify({schema:2,lastSync:new Date().toISOString()}))}
function isMigrated(){return readJSON(META,{})?.schema===2}
window.packWorkbenchCloud=function(){return{core:data,extras:packExtras(),schema:2,clientUpdatedAt:new Date().toISOString()}}
window.applyWorkbenchCloud=function(payload,opts={}){if(!payload)return;if(payload.core){data=payload.core;localStorage.setItem('xiao_workbench_v4',JSON.stringify(data));applyExtras(payload.extras,opts)}else{data=payload;localStorage.setItem('xiao_workbench_v4',JSON.stringify(data))}}
window.pushCloud=async function(showMsg=false){if(!auth?.access_token)return;syncing=true;cloudBtn.textContent='☁ 同步中';try{let payload=packWorkbenchCloud(),r=await cloudFetch('/rest/v1/workbench_state?on_conflict=user_id',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:auth.user.id,data:payload,updated_at:new Date().toISOString()})});if(!r.ok)throw Error((await r.text())||'同步失败');markSync();cloudBtn.textContent='☁ 已同步';if(showMsg)accountPanel('同步完成，学习扩展数据也已上传')}catch(err){cloudBtn.textContent='☁ 同步失败';if(showMsg)accountPanel('同步失败：'+err.message)}finally{syncing=false}};
window.pullCloud=async function(){let r=await cloudFetch('/rest/v1/workbench_state?select=data,updated_at&user_id=eq.'+encodeURIComponent(auth.user.id));if(!r.ok)throw Error(await r.text());let rows=await r.json(),row=rows[0]||null;if(row?.data?.schema===2&&row.data.core)return{...row,data:row.data.core,_extras:row.data.extras||{},_schema:2};return row?{...row,_schema:1}:null};
window.firstCloudSync=async function(){if(!auth?.access_token)return;cloudBtn.textContent='☁ 连接中';try{let row=await window.pullCloud();if(!row?.data){await window.pushCloud(false);return}let localExtras=hasLocalExtras();if(row._schema===1&&localExtras&&!isMigrated()){
// 旧云端只含核心数据时，保留手机上的扩展学习记录；核心仍沿用云端，随后升级云端包。
data=row.data;localStorage.setItem('xiao_workbench_v4',JSON.stringify(data));if(typeof render==='function')render();await window.pushCloud(false);return}
data=row.data;localStorage.setItem('xiao_workbench_v4',JSON.stringify(data));if(row._extras)applyExtras(row._extras,{preserveLocal:!isMigrated()&&localExtras});markSync();if(typeof render==='function')render();cloudBtn.textContent='☁ 已同步'}catch(err){cloudBtn.textContent='☁ 同步失败'}};
window.syncNow=async function(showMsg=false){try{let row=await window.pullCloud();if(row?.data){let localExtras=hasLocalExtras();data=row.data;localStorage.setItem('xiao_workbench_v4',JSON.stringify(data));if(row._schema===2&&row._extras)applyExtras(row._extras,{preserveLocal:!isMigrated()&&localExtras});if(typeof render==='function')render()}await window.pushCloud(showMsg)}catch(err){if(showMsg)accountPanel('同步失败：'+err.message)}};
})();