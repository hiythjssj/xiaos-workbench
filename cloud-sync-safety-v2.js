/* 晓的工作台 V3：云同步安全层。以 localStorage 为真实本地快照，不再读取不可访问的顶层 let data。 */
(function(){
if(window.__xiaoCloudSafetyV3)return;window.__xiaoCloudSafetyV3=true;
const BACKUP='xiao_workbench_cloud_backup_v3',DATAK='xiao_workbench_v4',AUTHK='xiao_workbench_auth';
function btn(){return document.getElementById('cloudBtn')}
function read(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}}
function token(){return read(AUTHK)?.access_token||null}
function localData(){return read(DATAK)}
function status(text,cls){let b=btn();if(!b)return;b.textContent=text;b.classList.remove('syncok','syncbad');if(cls)b.classList.add(cls)}
window.xiaoCloudBackup=function(reason){try{let snapshot=localData();if(!snapshot)return false;localStorage.setItem(BACKUP,JSON.stringify({time:new Date().toISOString(),reason:reason||'manual',data:snapshot}));return true}catch(e){console.error('[cloud backup]',e);return false}};
window.xiaoCloudRestoreBackup=function(){try{let b=read(BACKUP);if(!b?.data)return false;if(!confirm('恢复最近一次云同步前的本地备份？当前本地数据会被替换。'))return false;localStorage.setItem(DATAK,JSON.stringify(b.data));location.reload();return true}catch(e){console.error('[cloud restore]',e);return false}};
/* queueCloud 在主程序中是全局函数声明，可动态调用。这里只包装一次，不碰主程序私有 data/auth 变量。 */
const originalQueue=window.queueCloud;
if(typeof originalQueue==='function')window.queueCloud=function(){xiaoCloudBackup('before-queue');if(!navigator.onLine){status('☁ 离线，本地已保存','syncbad');return}if(!token()){status('☁ 本地已保存 · 未登录');return}try{status('☁ 等待同步');let r=originalQueue.apply(this,arguments);if(r&&typeof r.catch==='function')r.catch(err=>{status('☁ 同步失败 · 本地已保存','syncbad');console.error('[cloud queue]',err)});return r}catch(err){status('☁ 同步失败 · 本地已保存','syncbad');console.error('[cloud queue]',err)}};
const originalPanel=window.accountPanel;
if(typeof originalPanel==='function')window.accountPanel=function(){try{return originalPanel.apply(this,arguments)}catch(err){status('☁ 账户异常','syncbad');console.error('[account]',err);alert('账户面板暂时无法打开，请刷新页面后重试。')}};
window.xiaoCloudState=function(){return{online:navigator.onLine,loggedIn:!!token(),hasLocal:!!localData(),hasBackup:!!read(BACKUP)}};
window.addEventListener('online',()=>status(token()?'☁ 已登录':'☁ 未登录',token()?'syncok':''));
window.addEventListener('offline',()=>status('☁ 离线，本地已保存','syncbad'));
window.addEventListener('storage',ev=>{if(ev.key===AUTHK)status(token()?'☁ 已登录':'☁ 未登录',token()?'syncok':'')});
setTimeout(()=>status(!navigator.onLine?'☁ 离线，本地已保存':token()?'☁ 已登录':'☁ 未登录',!navigator.onLine?'syncbad':token()?'syncok':''),800);
})();