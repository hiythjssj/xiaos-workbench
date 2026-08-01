/* 晓的工作台 V2：旧入口统一桥接 */
(function(){
const oldOpen=window.openModule;
window.openModule=function(id){
  if(id==='civil') return window.WorkbenchRouter?WorkbenchRouter.show('civil'):xiaoOpenStudyPage?.('civil');
  if(id==='teacher') return window.WorkbenchRouter?WorkbenchRouter.show('teacher'):xiaoOpenStudyPage?.('teacher');
  if(id==='psy') return window.WorkbenchRouter?WorkbenchRouter.show('psy'):xiaoOpenStudyPage?.('psy');
  if(['current','xingce','shenlun','errors','mock'].includes(id)){
    if(window.WorkbenchRouter)WorkbenchRouter.show('civil'); else xiaoOpenStudyPage?.('civil');
    setTimeout(()=>xiaoCivilTool?.(id),40); return;
  }
  if(typeof oldOpen==='function') return oldOpen.apply(this,arguments);
};
window.xiaoCivilTool=function(id){
 const names={current:'每日时政',xingce:'行测训练',shenlun:'申论训练',errors:'错题复盘',mock:'模考记录'}, tips={current:'把今天需要积累的时政考点加入公务员任务。',xingce:'记录今天的专项训练，并在完成后同步进度。',shenlun:'安排申论小题、大作文或素材整理。',errors:'集中清理错题并记录错因。',mock:'安排整套模考，完成后用于阶段复盘。'};
 let bg=document.getElementById('mbg'),m=document.getElementById('modal'); if(!bg||!m)return;
 m.innerHTML=`<div class="xiaoModalInner"><div class="xiaoModalTop"><div><h2>${names[id]||'公务员训练'}</h2><small>${tips[id]||''}</small></div><button class="mini" onclick="closeM()">关闭</button></div><button class="btn" style="width:100%;margin-top:14px" onclick="closeM();xiaoCivilAdd('${id}')">＋ 添加到今日任务</button></div>`; bg.classList.add('on');
};
window.xiaoCivilAdd=function(id){let map={current:'今日时政：整理重点事件与考点',xingce:'行测：完成专项训练',shenlun:'申论：完成今日训练',errors:'错题：完成今日复盘',mock:'模考：完成一套模拟训练'},area=id==='current'?'civil':id,fn=window.xiaoStableTaskForm||window.xiaoTaskForm||window.taskForm;if(typeof fn==='function'){fn();setTimeout(()=>{let text=document.getElementById('xstText'),sel=document.getElementById('xstArea');if(text&&!text.value)text.value=map[id]||'';if(sel){sel.value=area;sel.dispatchEvent(new Event('change',{bubbles:true}))}},30)}};
})();