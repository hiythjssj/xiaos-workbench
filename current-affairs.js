/* 晓的工作台：每日时政前端模块 */
(function(){
  let affairs=[];
  const favKey='xiao_affairs_favorites';
  function favorites(){try{return JSON.parse(localStorage.getItem(favKey)||'[]')}catch{return []}}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function affairCard(x,full=false){let fav=favorites().includes(x.id);return `<div class="node"><div class="head"><div class="txt">${esc(x.title)}</div><button class="mini" onclick="toggleAffairFav('${esc(x.id)}')">${fav?'★':'☆'}</button></div><div class="muted" style="margin:5px 0">${esc(x.date||'')} · ${esc(x.category||'时政')} · ${esc(x.source||'权威来源')}</div><div style="line-height:1.65">${esc(x.summary||'')}</div>${full?`<div class="chips"><span class="chip">行测常识</span><span class="chip">申论素材</span></div>${x.exam_point?`<div style="margin-top:10px"><b>考点：</b>${esc(x.exam_point)}</div>`:''}${x.essay_material?`<div style="margin-top:8px"><b>申论积累：</b>${esc(x.essay_material)}</div>`:''}${x.url?`<div style="margin-top:10px"><a href="${esc(x.url)}" target="_blank" rel="noopener">查看权威原文</a></div>`:''}`:''}</div>`}
  window.toggleAffairFav=function(id){let f=favorites(),i=f.indexOf(id);i>=0?f.splice(i,1):f.push(id);localStorage.setItem(favKey,JSON.stringify(f));render();if(document.getElementById('affairsList'))renderAffairsPage()};
  window.currentCard=function(){let today=new Date().toLocaleDateString('sv-SE'),items=affairs.filter(x=>x.date===today);if(!items.length)items=affairs.slice(0,3);return `<div class="card"><h3>📰 公务员 · 今日时政</h3>${items.length?items.slice(0,3).map(x=>affairCard(x,false)).join(''):'<div class="muted">今日时政数据正在准备中。自动更新后会在这里出现。</div>'}<button class="mini" style="width:100%;margin-top:8px" onclick="openAffairs()">查看时政库</button></div>`};
  window.openAffairs=function(){show(`<h3>📰 每日时政</h3><div class="muted">按日期积累行测常识与申论素材，可收藏重点内容。</div><div id="affairsList"></div>`);renderAffairsPage()};
  window.renderAffairsPage=function(){let box=document.getElementById('affairsList');if(!box)return;box.innerHTML=affairs.length?affairs.map(x=>affairCard(x,true)).join(''):'<div class="muted">暂时还没有时政条目。</div>'};
  fetch('./data/current-affairs.json?ts='+Date.now()).then(r=>r.ok?r.json():Promise.reject()).then(j=>{affairs=Array.isArray(j.items)?j.items:[];render()}).catch(()=>{});
})();