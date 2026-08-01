/* 晓的工作台：主题系统 v1 */
(function(){
const themes={
 mist:{name:'雾蓝',vars:{bg:'#F5F7FB',card:'#FFFFFF',line:'#E3E8F0',ink:'#243047',muted:'#7A8599',a:'#6D87B8',soft:'#EAF0FA'}},
 sage:{name:'鼠尾草',vars:{bg:'#F5F7F3',card:'#FFFFFF',line:'#E1E7DE',ink:'#29372E',muted:'#7B887E',a:'#6F9278',soft:'#E8F0E9'}},
 lilac:{name:'雾紫',vars:{bg:'#F7F5FA',card:'#FFFFFF',line:'#E8E2EF',ink:'#352E42',muted:'#898094',a:'#8A78A8',soft:'#EFEAF5'}},
 sand:{name:'燕麦',vars:{bg:'#F8F6F1',card:'#FFFDFC',line:'#E9E2D7',ink:'#39342D',muted:'#8B8378',a:'#9A8067',soft:'#F1EBE3'}}
};
const K='xiao_workbench_theme';
function apply(key){let t=themes[key]||themes.mist;Object.entries(t.vars).forEach(([k,v])=>document.documentElement.style.setProperty('--'+k,v));document.documentElement.dataset.theme=key;localStorage.setItem(K,key);let meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=t.vars.bg;document.querySelectorAll('.xiaoThemeChoice').forEach(x=>x.classList.toggle('on',x.dataset.theme===key))}
window.setWorkbenchTheme=apply;
const css=`
body{background:var(--bg)!important}.card,.module,#modal,#xiaoSidePanel{border-color:var(--line)!important}.btn{background:var(--a)!important}.progress{background:var(--soft)!important}.fill{background:var(--a)!important}.tag,.chip{background:var(--soft)!important;border-color:var(--line)!important;color:var(--ink)!important}.xiaoThemeGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-top:9px}.xiaoThemeChoice{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:15px;padding:12px;text-align:left}.xiaoThemeChoice.on{outline:2px solid var(--a);outline-offset:1px}.xiaoThemeSwatches{display:flex;gap:5px;margin-bottom:7px}.xiaoThemeSwatches i{width:18px;height:18px;border-radius:50%;border:1px solid rgba(0,0,0,.05)}.xiaoThemeChoice b{font-size:13px}.xiaoThemeChoice small{display:block;color:var(--muted);margin-top:2px}
`;
let st=document.createElement('style');st.id='themeSystemStyle';st.textContent=css;document.head.appendChild(st);apply(localStorage.getItem(K)||'mist');
function inject(){let m=document.getElementById('modal');if(!m||!m.textContent.includes('界面设置')||m.querySelector('.xiaoThemeGrid'))return;let inner=m.querySelector('.xiaoModalInner')||m;let html=`<div class="node"><b>界面颜色</b><div class="muted" style="margin:4px 0 0">选择一套更舒服的工作台配色，设置会保存在当前设备。</div><div class="xiaoThemeGrid">${Object.entries(themes).map(([k,t])=>`<button class="xiaoThemeChoice ${document.documentElement.dataset.theme===k?'on':''}" data-theme="${k}" onclick="setWorkbenchTheme('${k}')"><div class="xiaoThemeSwatches"><i style="background:${t.vars.bg}"></i><i style="background:${t.vars.a}"></i><i style="background:${t.vars.ink}"></i></div><b>${t.name}</b><small>${k==='mist'?'清爽、安静':k==='sage'?'自然、柔和':k==='lilac'?'轻柔、克制':'温暖、低饱和'}</small></button>`).join('')}</div></div>`;let top=inner.querySelector('.xiaoModalTop');if(top)top.insertAdjacentHTML('afterend',html);else inner.insertAdjacentHTML('afterbegin',html)}
new MutationObserver(()=>requestAnimationFrame(inject)).observe(document.getElementById('modal'),{childList:true,subtree:true});
})();