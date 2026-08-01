/* 晓的工作台 V2：稳定交互核心 */
(function(){
const KEY='xiao_device_mode_v2';
function modal(html){let bg=document.getElementById('mbg'),m=document.getElementById('modal');if(!bg||!m)return;m.innerHTML=html;bg.classList.add('on')}
function applyDevice(mode){if(!['auto','desktop','tablet','mobile'].includes(mode))mode='auto';let actual=mode;if(mode==='auto'){let w=innerWidth;actual=w<600?'mobile':w<980?'tablet':'desktop'}document.body.dataset.device=actual;document.body.dataset.devicePreference=mode;localStorage.setItem(KEY,mode)}
window.setWorkbenchDevice=function(mode){applyDevice(mode);window.dispatchEvent(new CustomEvent('xiao:device',{detail:{mode}}));if(typeof closeM==='function')closeM()};
window.openWorkbenchSettings=function(){let current=localStorage.getItem(KEY)||'auto';modal(`<div class="xiaoModalInner"><div class="xiaoModalTop"><div><h2>界面设置</h2><small>选择最适合当前设备的布局</small></div><button class="mini" onclick="closeM()">关闭</button></div><div style="display:grid;gap:9px;margin-top:15px"><button class="module" onclick="setWorkbenchDevice('auto')"><strong>自动适配 ${current==='auto'?'✓':''}</strong><div class="muted" style="margin:4px 0 0">根据屏幕宽度自动选择布局</div></button><button class="module" onclick="setWorkbenchDevice('desktop')"><strong>电脑端 ${current==='desktop'?'✓':''}</strong><div class="muted" style="margin:4px 0 0">固定侧栏，更宽的内容区域</div></button><button class="module" onclick="setWorkbenchDevice('tablet')"><strong>平板端 ${current==='tablet'?'✓':''}</strong><div class="muted" style="margin:4px 0 0">中等密度与触控间距</div></button><button class="module" onclick="setWorkbenchDevice('mobile')"><strong>手机端 ${current==='mobile'?'✓':''}</strong><div class="muted" style="margin:4px 0 0">单栏内容与抽屉导航</div></button></div></div>`)};
/* 给旧入口提供稳定桥接，避免脚本加载顺序导致失效 */
window.xiaoCoreHome=window.xiaoCoreHome||function(){document.body.classList.remove('xiao-core-page','xiao-study-page');if(typeof setTab==='function')setTab('today')};
window.xiaoLeaveStudyPage=window.xiaoLeaveStudyPage||window.xiaoCoreHome;
window.xiaoSideGo=window.xiaoSideGo||function(tab){if(window.WorkbenchRouter)return WorkbenchRouter.show(tab==='today'?'home':tab==='more'?'life':tab);if(typeof setTab==='function')setTab(tab)};
window.xiaoStudyGo=window.xiaoStudyGo||function(k){if(window.WorkbenchRouter)return WorkbenchRouter.show(k);if(typeof xiaoOpenStudyPage==='function')xiaoOpenStudyPage(k)};
applyDevice(localStorage.getItem(KEY)||'auto');window.addEventListener('resize',()=>{if((localStorage.getItem(KEY)||'auto')==='auto')applyDevice('auto')});
})();