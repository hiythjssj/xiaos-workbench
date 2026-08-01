/* 晓的工作台：头像侧边导航 v1 */
(function(){
const css=`
.bottom{display:none!important}
#xiaoAvatarNav{position:fixed;z-index:1200;display:flex;align-items:flex-start;gap:10px;left:max(14px,env(safe-area-inset-left));top:calc(env(safe-area-inset-top) + 16px)}
#xiaoAvatarBtn{width:48px;height:48px;border:0;border-radius:50%;background:var(--card);box-shadow:0 8px 28px rgba(31,41,55,.14);display:grid;place-items:center;font-size:24px;cursor:pointer;border:1px solid color-mix(in srgb,var(--line) 75%,transparent);transition:.2s ease}
#xiaoAvatarBtn:active{transform:scale(.95)}
#xiaoSidePanel{width:168px;padding:8px;border-radius:20px;background:color-mix(in srgb,var(--card) 94%,transparent);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid color-mix(in srgb,var(--line) 75%,transparent);box-shadow:0 14px 42px rgba(31,41,55,.14);transform:translateX(-12px) scale(.96);opacity:0;pointer-events:none;transition:.2s ease;transform-origin:top left}
#xiaoAvatarNav.open #xiaoSidePanel{transform:none;opacity:1;pointer-events:auto}
.xiaoSideItem{width:100%;min-height:48px;border:0;background:transparent;color:var(--ink);border-radius:13px;padding:8px 10px;display:flex;align-items:center;gap:11px;text-align:left;font-size:14px;cursor:pointer}
.xiaoSideItem:hover,.xiaoSideItem.on{background:color-mix(in srgb,var(--a) 10%,transparent)}.xiaoSideIcon{width:26px;text-align:center;font-size:19px}.xiaoSideLabel{flex:1}.xiaoSideDivider{height:1px;background:var(--line);margin:5px 8px}
body[data-device="mobile"] #xiaoAvatarNav{top:calc(env(safe-area-inset-top) + 10px);left:10px}body[data-device="mobile"] #xiaoAvatarBtn{width:44px;height:44px;font-size:21px}body[data-device="mobile"] #xiaoSidePanel{width:158px;border-radius:18px}
body[data-device="tablet"] #xiaoAvatarNav{left:18px;top:22px}body[data-device="desktop"] #xiaoAvatarNav{left:24px;top:24px}body[data-device="desktop"] #xiaoSidePanel{width:184px}
`;
let st=document.createElement('style');st.id='avatarSideNavStyle';st.textContent=css;document.head.appendChild(st);
function go(tab){if(tab==='progress'){if(typeof openProgressCalendar==='function')openProgressCalendar()}else if(typeof setTab==='function')setTab(tab);closeNav();mark(tab)}function mark(tab){document.querySelectorAll('.xiaoSideItem[data-tab]').forEach(x=>x.classList.toggle('on',x.dataset.tab===tab))}function closeNav(){document.getElementById('xiaoAvatarNav')?.classList.remove('open')}window.toggleXiaoSideNav=function(){document.getElementById('xiaoAvatarNav')?.classList.toggle('open')};window.xiaoSideGo=go;
function build(){if(document.getElementById('xiaoAvatarNav'))return;let n=document.createElement('div');n.id='xiaoAvatarNav';n.innerHTML=`<button id="xiaoAvatarBtn" aria-label="打开或隐藏导航" onclick="toggleXiaoSideNav()">晓</button><div id="xiaoSidePanel"><button class="xiaoSideItem on" data-tab="today" onclick="xiaoSideGo('today')"><span class="xiaoSideIcon">⌂</span><span class="xiaoSideLabel">今日</span></button><button class="xiaoSideItem" data-tab="progress" onclick="xiaoSideGo('progress')"><span class="xiaoSideIcon">▦</span><span class="xiaoSideLabel">进度</span></button><button class="xiaoSideItem" data-tab="plans" onclick="xiaoSideGo('plans')"><span class="xiaoSideIcon">◎</span><span class="xiaoSideLabel">计划</span></button><button class="xiaoSideItem" data-tab="life" onclick="xiaoSideGo('life')"><span class="xiaoSideIcon">♡</span><span class="xiaoSideLabel">生活健康</span></button><div class="xiaoSideDivider"></div><button class="xiaoSideItem" onclick="closeNav();openWorkbenchSettings()"><span class="xiaoSideIcon">⚙</span><span class="xiaoSideLabel">界面设置</span></button></div>`;document.body.appendChild(n)}
document.addEventListener('click',e=>{let n=document.getElementById('xiaoAvatarNav');if(n?.classList.contains('open')&&!n.contains(e.target))closeNav()});
const oldSet=window.setTab;if(typeof oldSet==='function')window.setTab=function(tab){let r=oldSet.apply(this,arguments);mark(tab);return r};
build();
})();