/* 晓的工作台 V2：云同步安全层。保留原 Supabase 实现，只增加状态、备份与防重复操作。 */
(function(){
const BACKUP='xiao_workbench_cloud_backup_v2';
function btn(){return document.getElementById('cloudBtn')}
function status(text,cls){let b=btn();if(!b)return;b.textContent=text;b.classList.remove('syncok','syncbad');if(cls)b.classList.add(cls)}
window.xiaoCloudBackup=function(reason){try{localStorage.setItem(BACKUP,JSON.stringify({time:new Date().toISOString(),reason:reason||'manual',data:window.data||null}));return true}catch(e){return false}};
window.xiaoCloudRestoreBackup=function(){try{let b=JSON.parse(localStorage.getItem(BACKUP)||'null');if(!b?.data)return false;if(!confirm('恢复最近一次云同步前的本地备份？当前本地数据会被替换。'))return false;window.data=b.data;localStorage.setItem('xiao_workbench_v4',JSON.stringify(window.data));if(typeof render==='function')render();return true}catch(e){return false}};
/* save 之前的数据仍由原逻辑持久化。这里监听同步状态，不替换认证与 REST 请求。 */
const oldQueue=window.queueCloud;
if(typeof oldQueue==='function')window.queueCloud=function(){xiaoCloudBackup('before-queue');if(window.syncing){status('☁ 同步中…');return}try{let r=oldQueue.apply(this,arguments);status(window.auth?.access_token?'☁ 等待同步':'☁ 未登录');return r}catch(err){status('☁ 同步失败','syncbad');console.error(err)}};
const oldPanel=window.accountPanel;
if(typeof oldPanel==='function')window.accountPanel=function(){try{return oldPanel.apply(this,arguments)}catch(err){status('☁ 账户异常','syncbad');console.error(err);alert('账户面板暂时无法打开，请刷新页面后重试。')}};
window.addEventListener('online',()=>{if(window.auth?.access_token)status('☁ 已联网','syncok')});
window.addEventListener('offline',()=>status('☁ 离线，本地可用','syncbad'));
window.addEventListener('error',ev=>{if(/supabase|cloud|sync/i.test(String(ev.message||'')))status('☁ 同步异常','syncbad')});
setTimeout(()=>{if(!navigator.onLine)status('☁ 离线，本地可用','syncbad');else if(window.auth?.access_token)status('☁ 已登录','syncok')},800);
})();