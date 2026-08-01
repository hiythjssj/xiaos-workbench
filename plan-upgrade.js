/* 晓的工作台：计划系统增强层 v1
   月/周/日计划支持日期与方向，首页按当天日期展示，任务完成自动汇总进度。
*/
(function(){
  const oldRender = window.render;
  const oldPlanHTML = window.planHTML;

  function localISO(d=new Date()){
    const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }
  function monthISO(d=new Date()){ return localISO(d).slice(0,7); }
  function planAreaName(p){ return p.area ? (mod(p.area)?.name || '') : ''; }
  function childPlans(id){ return data.plans.filter(p=>p.parent===id); }
  function taskForPlan(id){ return data.tasks.find(t=>t.planId===id); }
  function planDone(p){
    if(p.level==='task') return !!taskForPlan(p.id)?.done;
    const cs=childPlans(p.id);
    return cs.length>0 && cs.every(planDone);
  }
  window.planProgress=function(id){
    const p=data.plans.find(x=>x.id===id); if(!p)return 0;
    const leaves=descendants(id).map(x=>data.plans.find(p=>p.id===x)).filter(p=>p?.level==='task');
    if(leaves.length){ return Math.round(leaves.filter(planDone).length/leaves.length*100); }
    const linked=data.tasks.filter(t=>t.planId&&descendants(id).includes(t.planId));
    return linked.length?Math.round(linked.filter(t=>t.done).length/linked.length*100):0;
  };
  window.todayPlanCard=function(){
    const today=localISO();
    let days=data.plans.filter(p=>p.level==='day' && p.date===today);
    if(!days.length) days=data.plans.filter(p=>p.level==='day' && !p.date).slice(0,1);
    if(!days.length)return `<div class="card"><h3>🎯 今日关联计划</h3><div class="muted">今天还没有关联计划。可以到“计划”里新建日计划并选择今天。</div></div>`;
    return `<div class="card"><h3>🎯 今日关联计划</h3>${days.map(active=>{let q=planProgress(active.id),cs=childPlans(active.id);return `<div class="node"><div class="head"><div class="txt">${e(active.title)}</div><span class="tag">${q}%</span></div><div class="muted" style="margin:4px 0 0">${e(active.date||today)}${planAreaName(active)?' · '+e(planAreaName(active)):''}</div><div class="progress"><div class="fill" style="width:${q}%"></div></div>${cs.map(p=>{let t=taskForPlan(p.id);return `<div class="task ${t?.done?'done':''}"><div class="txt">${e(p.title)}</div>${t?`<span class="tag">${t.done?'已完成':'已加入'}</span>`:`<button class="mini" onclick="makeTask(${p.id})">加入今日</button>`}</div>`}).join('')}</div>`}).join('')}</div>`;
  };
  window.planForm=function(parent,level){
    const labels={month:'月计划',week:'周计划',day:'日计划',task:'知识点'}, p=parent==null?null:data.plans.find(x=>x.id===parent);
    const area=p?.area||'teacher', today=localISO(), month=p?.month||monthISO();
    let extra='';
    if(level==='month') extra=`<label class="muted">所属方向</label><select id="pa">${data.modules.filter(m=>m.visible!==false&&root(m.id)==='study'&&m.id!=='study').map(m=>`<option value="${m.id}" ${m.id===area?'selected':''}>${e(m.icon+' '+m.name)}</option>`).join('')}</select><label class="muted">月份</label><input id="pm" type="month" value="${month}">`;
    if(level==='week') extra=`<label class="muted">这一周从哪天开始</label><input id="pd" type="date" value="${p?.date||today}">`;
    if(level==='day') extra=`<label class="muted">日期</label><input id="pd" type="date" value="${today}">`;
    show(`<h3>新建${labels[level]}</h3><input id="pt" placeholder="输入${labels[level]}内容">${extra}<div class="row"><button class="mini" onclick="closeM()">取消</button><button class="btn" onclick="savePlan(${parent===null?'null':parent},'${level}')">保存</button></div>`);
  };
  window.savePlan=function(parent,level){
    if(!pt.value.trim())return;
    const par=parent==null?null:data.plans.find(x=>x.id===parent), item={id:Date.now(),parent,level,title:pt.value.trim()};
    if(level==='month'){item.area=pa.value;item.month=pm.value||monthISO();}
    else { item.area=par?.area||null; item.month=par?.month||null; if(level==='week'||level==='day')item.date=pd.value||localISO(); }
    data.plans.push(item);save();closeM();
  };
  window.editPlan=function(id){
    const p=data.plans.find(x=>x.id===id); if(!p)return;
    const labels={month:'月计划',week:'周计划',day:'日计划',task:'知识点'};
    let extra='';
    if(p.level==='month')extra=`<label class="muted">月份</label><input id="epm" type="month" value="${e(p.month||monthISO())}">`;
    if(p.level==='week'||p.level==='day')extra=`<label class="muted">${p.level==='week'?'周开始日期':'日期'}</label><input id="epd" type="date" value="${e(p.date||localISO())}">`;
    show(`<h3>修改${labels[p.level]}</h3><input id="ept" value="${e(p.title)}">${extra}<div class="row"><button class="mini" onclick="closeM()">取消</button><button class="btn" onclick="savePlanEdit(${id})">保存</button></div>`);
  };
  window.savePlanEdit=function(id){const p=data.plans.find(x=>x.id===id);if(!p||!ept.value.trim())return;p.title=ept.value.trim();if(p.level==='month')p.month=epm.value;if(p.level==='week'||p.level==='day')p.date=epd.value;save();closeM();};
  window.makeTask=function(id){
    const p=data.plans.find(x=>x.id===id);if(!p)return;
    if(data.tasks.some(t=>t.planId===id)){alert('这个知识点已经加入今日任务');return;}
    let area=p.area||'teacher',cur=p;while(cur?.parent&&!cur.area)cur=data.plans.find(x=>x.id===cur.parent);if(cur?.area)area=cur.area;
    taskForm(area,id);setTimeout(()=>tt.value=p.title,0);
  };
  window.planHTML=function(p){
    let cs=childPlans(p.id),labels={month:'月',week:'周',day:'日',task:'知识点'},next={month:'week',week:'day',day:'task'},q=planProgress(p.id),meta=[];
    if(p.month)meta.push(p.month);if(p.date)meta.push(p.date);if(planAreaName(p))meta.push(planAreaName(p));
    let linked=p.level==='task'?taskForPlan(p.id):null;
    return `<div class="tree"><div class="node"><div class="head"><div class="txt"><span class="tag">${labels[p.level]}</span> ${e(p.title)}</div><span class="tag">${q}%</span><div class="actions"><button class="mini" onclick="editPlan(${p.id})">✎</button><button class="mini" onclick="delPlan(${p.id})">×</button></div></div>${meta.length?`<div class="muted" style="margin:5px 0 0">${e(meta.join(' · '))}</div>`:''}<div class="progress"><div class="fill" style="width:${q}%"></div></div>${p.level==='task'?(linked?`<div class="muted" style="margin:8px 0 0">${linked.done?'已完成':'已加入今日任务'}</div>`:`<button class="mini" style="margin-top:8px" onclick="makeTask(${p.id})">＋ 加入今日任务</button>`):`<button class="mini" style="margin-top:8px" onclick="planForm(${p.id},'${next[p.level]}')">＋ 继续拆分</button>`}</div>${cs.map(planHTML).join('')}</div>`;
  };
  window.renderPlans=function(){
    let ms=data.plans.filter(p=>p.level==='month').sort((a,b)=>(b.month||'').localeCompare(a.month||''));
    planTree.innerHTML=ms.length?ms.map(planHTML).join(''):'<div class="card muted">还没有月计划。</div>';
  };
  window.render=function(){oldRender();};
  render();
})();
