/* 晓的工作台 V2：云同步安全层 v2。原 Supabase 状态是顶层 let，不能通过 window.auth/window.syncing 读取。 */
(function(){
const BACKUP='xiao_workbench_cloud_backup_v2',AUTHK='xiao_workbench_auth';
function btn(){return document.getElementById('cloudBtn')}
function token(){try{return JSON.parse(localStorage.getItem(AUTHK)||'null')?.access_token||null}catch(e){return null}}
function status(text,cls){let b=btn();if(!b)return;b.textContent=text;b.classList.remove('syncok','syncbad');if(cls)b.classList.add(cls)}
window.xiaoCloudBackup=function(reason){try{localStorage.setItem(BACKUP,JSON.stringify({time:new Date().toISOString(),reason:reason||'manual',data:window.data||null}));return true}catch(e){return false}};
window.xiaoCloudRestoreBackup=function(){try{let b=JSON.parse(localStorage.getItem(BACKUP)||'null');if(!b?.data)return false;if(!confirm('恢复最近一次云同步前的本地备份？当前本地数据会被替换。'))return false;window.data=b.data;localStorage.setItem('xiao_workbench_v4',JSON.stringify(window.data));if(typeof render==='function')render();location.reload();return true}catch(e){return false}};
const oldQueue=window.queueCloud;if(typeof oldQueue==='function')window.queueCloud=function(){xiaoCloudBackup('before-queue');try{let r=oldQueue.apply(this,arguments);status(token()?'☁ 等待同步':'☁ 未登录');return r}catch(err){status('☁ 同步失败','syncbad');console.error('[cloud]',err)}};
const oldPanel=window.accountPanel;if(typeof oldPanel==='function')window.accountPanel=function(){try{return oldPanel.apply(this,arguments)}catch(err){status('☁ 账户异常','syncbad');console.error('[account]',err);alert('账户面板暂时无法打开，请刷新页面后重试。')}};
window.addEventListener('online',()=>status(token()?'☁ 已登录':'☁ 未登录',token()?'syncok':''));window.addEventListener('offline',()=>status('☁ 离线，本地可用','syncbad'));window.addEventListener('storage',ev=>{if(ev.key===AUTHK)status(token()?'☁ 已登录':'☁ 未登录',token()?'syncok':'')});
setTimeout(()=>status(!navigator.onLine?'☁ 离线，本地可用':token()?'☁ 已登录':'☁ 未登录',!navigator.onLine?'syncbad':token()?'syncok':''),800);
})();