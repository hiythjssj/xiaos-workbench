/* 晓的工作台：首页移除公考驾驶舱/今日时政旧卡片 */
(function(){
function clean(){
  const dash=document.getElementById('dashboard');
  if(!dash)return;
  [...dash.children].forEach(el=>{
    const text=(el.textContent||'').replace(/\s+/g,'');
    if(/公务员·今日时政|公考驾驶舱|公务员驾驶舱/.test(text))el.remove();
  });
}
const old=window.renderDashboard;
if(typeof old==='function')window.renderDashboard=function(){const r=old.apply(this,arguments);clean();return r};
new MutationObserver(()=>requestAnimationFrame(clean)).observe(document.getElementById('dashboard'),{childList:true,subtree:true});
clean();
})();