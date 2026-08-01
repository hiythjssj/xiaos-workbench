/* 晓的工作台 V2：统一页面路由 */
(function(){
const VALID=['home','progress','plans','civil','teacher','psy','life'];
function clean(){document.body.classList.remove('xiao-study-page','xiao-core-page')}
function mark(route){document.querySelectorAll('.xiaoSideItem').forEach(b=>{let s=b.getAttribute('onclick')||'';b.classList.toggle('on',s.includes(`'${route}'`)||(route==='home'&&s.includes("'today'")))})}
function show(route,opt={}){if(!VALID.includes(route))route='home';clean();if(route==='home'){if(typeof setTab==='function')setTab('today')}else if(route==='progress'||route==='plans'){if(typeof xiaoOpenCorePage==='function')xiaoOpenCorePage(route)}else if(['civil','teacher','psy'].includes(route)){if(typeof xiaoOpenStudyPage==='function')xiaoOpenStudyPage(route)}else if(route==='life'){if(typeof setTab==='function')setTab('more')}mark(route);if(!opt.silent){try{sessionStorage.setItem('xiaoRoute',route)}catch(e){}}if(typeof closeXiaoSideNav==='function')closeXiaoSideNav();window.scrollTo(0,0);window.dispatchEvent(new CustomEvent('xiao:route',{detail:{route}}))}
window.WorkbenchRouter={show,home:()=>show('home'),current:()=>{try{return sessionStorage.getItem('xiaoRoute')||'home'}catch(e){return'home'}}};
window.xiaoRoute=show;
/* 收口旧入口 */
window.xiaoSideGo=function(tab){show(tab==='today'?'home':tab==='life'?'life':tab)};
window.xiaoStudyGo=function(k){show(k)};
window.xiaoCoreHome=function(){show('home')};
window.xiaoLeaveStudyPage=function(){show('home')};
window.openCivilMasterPlan=function(){show('civil')};
window.openTeacherMaster=function(){show('teacher')};
window.openPsyMaster=function(){show('psy')};
/* 浏览器前后台恢复时保持当前一级页面 */
window.addEventListener('pageshow',()=>{let r=WorkbenchRouter.current();if(r!=='home')setTimeout(()=>show(r,{silent:true}),80)});
})();