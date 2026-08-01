/* 晓的工作台：教综知识点与计划任务双向同步 */
(function(){
const KEY='xiao_study_hubs_v2';
function hub(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function saveHub(h){localStorage.setItem(KEY,JSON.stringify(h))}
function refState(ref){let h=hub();if(!h||!ref)return null;let x=h.teacher.knowledge[ref]||{learned:false,memorized:false,questions:0,wrong:0};return {h,x}}
function planRef(planId){return data.plans.find(p=>p.id===planId)?.studyRef||null}
function syncTaskToStudy(task){if(!task?.planId)return;let ref=planRef(task.planId),r=refState(ref);if(!r)return;r.x.learned=!!task.done;r.h.teacher.knowledge[ref]=r.x;saveHub(r.h)}
function syncStudyToTask(ref,learned){let p=data.plans.find(x=>x.studyRef===ref);if(!p)return;let t=data.tasks.find(x=>x.planId===p.id);if(t)t.done=!!learned}
window.syncTeacherStudyToTask=syncStudyToTask;
const oldToggle=window.toggle;window.toggle=function(id){if(typeof oldToggle==='function')oldToggle(id);let t=data.tasks.find(x=>x.id===id);syncTaskToStudy(t)};
const oldMake=window.makeTask;window.makeTask=function(id){let p=data.plans.find(x=>x.id===id);if(typeof oldMake==='function')oldMake(id);if(!p?.studyRef)return;setTimeout(()=>{let t=data.tasks.find(x=>x.planId===id),r=refState(p.studyRef);if(t&&r){t.done=!!r.x.learned;localStorage.setItem('xiao_workbench_v4',JSON.stringify(data));render()}},0)};
window.teacherReviewQueue=function(){let h=hub();if(!h)return[];let out=[];Object.entries(h.teacher.knowledge||{}).forEach(([ref,x])=>{let [si,ci,ki]=ref.split('|').map(Number),s=h.teacher.subjects[si],c=s?.chapters?.[ci],name=c?.[ki+1];if(!name)return;let priority=(x.wrong||0)*3+(x.learned&&!x.memorized?2:0)+(x.learned?0:1);if(priority>0)out.push({ref,si,ci,ki,subject:s.name,chapter:c[0],name,wrong:x.wrong||0,memorized:!!x.memorized,learned:!!x.learned,priority})});return out.sort((a,b)=>b.priority-a.priority)};
window.openTeacherReview=function(){let q=teacherReviewQueue().slice(0,12);show(`<h3>🔁 教综复习队列</h3><div class="muted">优先安排错题较多、已经学习但还没背熟的知识点。</div>${q.length?q.map(x=>`<div class="task"><div class="txt"><b>${x.name}</b><div class="muted" style="margin:2px 0 0">${x.subject} · ${x.chapter} · 错题 ${x.wrong}${x.memorized?' · 已背诵':' · 待背诵'}</div></div><button class="mini" onclick="reviewToToday('${x.ref}')">加入今日</button></div>`).join(''):'<div class="muted">目前没有需要优先复习的知识点。</div>'}`)};
window.reviewToToday=function(ref){let q=teacherReviewQueue().find(x=>x.ref===ref);if(!q)return;let text=`教综复习 · ${q.subject}：${q.name}${q.wrong?`（错题 ${q.wrong}）`:''}`;if(!data.tasks.some(t=>t.studyRef===ref&&!t.done))data.tasks.push({id:Date.now(),area:'teacher',text,done:false,studyRef:ref,review:true});save();closeM()};
const oldHub=window.openTeacherHub;window.openTeacherHub=function(){if(typeof oldHub==='function')oldHub();let modal=document.getElementById('modal');if(modal&&!document.getElementById('teacherReviewBtn'))modal.insertAdjacentHTML('beforeend','<button id="teacherReviewBtn" class="mini" style="width:100%;margin-top:10px" onclick="openTeacherReview()">🔁 查看智能复习队列</button>')};
})();