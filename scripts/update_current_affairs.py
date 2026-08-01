from pathlib import Path
import json, datetime, urllib.request, re, hashlib, html
from urllib.parse import urljoin

OUT=Path('data/current-affairs.json'); UA='Mozilla/5.0 (Xiao Workbench current-affairs updater)'
TZ=datetime.timezone(datetime.timedelta(hours=8)); TODAY=datetime.datetime.now(TZ).date(); MAX_AGE_DAYS=14
SOURCES=[
 {'name':'中国政府网·政策','url':'https://www.gov.cn/zhengce/index.htm','base':'https://www.gov.cn/','priority':4},
 {'name':'中国政府网·要闻','url':'https://www.gov.cn/yaowen/','base':'https://www.gov.cn/','priority':4},
 {'name':'新华网·时政','url':'https://www.news.cn/politics/','base':'https://www.news.cn/','priority':3},
 {'name':'新华网·时政联播','url':'https://www.news.cn/politics/szlb/index.html','base':'https://www.news.cn/','priority':3}]
HIGH=['习近平','中共中央','国务院','全国人大','全国政协','政策','条例','意见','办法','规划','会议','改革','发展','经济','就业','教育','科技','人工智能','创新','乡村振兴','民生','社会保障','养老','医疗','生态','绿色','法治','外交','国防','航天','新质生产力','十五五','统一大市场','消费','能源','交通运输','公共卫生','普法','工业和信息化部','国家发展改革委','教育部','人力资源社会保障部','供销合作社','农业','农村']
LOW=['天气','降温','高温','暴雨','台风路径','娱乐','明星','电影','电视剧','体育比赛','比分','彩票','感染者','毒株','新冠','流感','逝世','讣告','事故致','地震震中直击']
STOP={'关于','印发','发布','通知','推进','工作','全国','我国','中国','加快','开展','实施','进一步','近日','有关','全面','五年','十五五','规定','规划'}

def fetch(url):
 req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept-Language':'zh-CN,zh;q=0.9'});
 with urllib.request.urlopen(req,timeout=30) as r:return r.read().decode('utf-8','ignore')
def clean(s):return re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',html.unescape(s or ''))).strip()
def date_from(text,url=''):
 for src in [url,text]:
  for pat in [r'/(20\d{2})(\d{2})(\d{2})/',r'(20\d{2})[-年/.](\d{1,2})[-月/.](\d{1,2})']:
   m=re.search(pat,src or '')
   if m:
    try:return datetime.date(*map(int,m.groups()))
    except ValueError:pass
 return None
def valuable(t):return not any(k in t for k in LOW) and any(k in t for k in HIGH)
def classify(t):
 if any(k in t for k in ['农业','农村','乡村振兴','供销合作社','粮食']):return '三农乡村'
 if any(k in t for k in ['科技','人工智能','创新','航天','数字','新质生产力','工业和信息化']):return '科技创新'
 if any(k in t for k in ['教育','就业','医疗','养老','育儿','民生','社会保障','公共卫生','人力资源']):return '社会民生'
 if any(k in t for k in ['经济','消费','金融','产业','市场','外贸','财政','统一大市场','发展改革']):return '经济发展'
 if any(k in t for k in ['生态','绿色','碳','环境','能源']):return '生态文明'
 if any(k in t for k in ['法治','条例','办法','政策','人大','普法','行政复议','出境入境']):return '政策法治'
 if any(k in t for k in ['外交','国际','峰会','全球治理','对外']):return '国际时政'
 return '时政要闻'
def score(t):
 n=2
 if any(k in t for k in ['习近平','中共中央','国务院','全国人大','全国政协']):n+=2
 if any(k in t for k in ['十五五','规划','条例','意见','办法','改革','新质生产力','统一大市场','普法']):n+=1
 return min(5,n)
def exam(cat):return f'行测关注：发布主体、时间、制度名称、核心举措、重要数字，以及“{cat}”相关规范表述。'
def essay(cat):
 m={'三农乡村':'乡村全面振兴、农业农村现代化与为农服务','科技创新':'科技创新、新质生产力与高质量发展','社会民生':'保障和改善民生、公共服务与社会治理','经济发展':'高质量发展、扩大内需与现代化产业体系','生态文明':'绿色发展与生态文明建设','政策法治':'依法行政、制度建设与治理现代化','国际时政':'开放合作、全球治理与中国特色大国外交','时政要闻':'中国式现代化、国家治理与高质量发展'}
 return '申论积累：'+m.get(cat,m['时政要闻'])+'。可从背景、举措、意义三个角度整理。'
def keywords(title):
 s=re.sub(r'[《》“”\"\'（）()，。；：、·\-—0-9A-Za-z]',' ',title)
 chunks=re.findall(r'[\u4e00-\u9fff]{2,}',s); out=set()
 for c in chunks:
  for n in (4,3,2):
   for i in range(max(0,len(c)-n+1)):
    w=c[i:i+n]
    if w not in STOP:out.add(w)
 return out
def similar(a,b):
 ka,kb=keywords(a['title']),keywords(b['title'])
 if not ka or not kb:return False
 inter=len(ka&kb); base=min(len(ka),len(kb))
 return inter>=3 and inter/base>=0.28
def extract(src):
 page=fetch(src['url']); out=[]
 for m in re.finditer(r'<a\b[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',page,re.I|re.S):
  href,title=m.group(1),clean(m.group(2))
  if len(title)<8 or len(title)>120 or not valuable(title):continue
  url=urljoin(src['base'],href);around=clean(page[max(0,m.start()-260):min(len(page),m.end()+260)]);d=date_from(around,url)
  if not d or not (0<=(TODAY-d).days<=MAX_AGE_DAYS):continue
  cat=classify(title);out.append({'id':hashlib.sha1(url.encode()).hexdigest()[:12],'date':d.isoformat(),'category':cat,'source':src['name'],'source_priority':src['priority'],'title':title,'summary':'权威来源近期发布。建议结合原文核对政策表述、重要数字和发布主体。','exam_point':exam(cat),'essay_material':essay(cat),'score':score(title),'url':url})
 return out
def dedupe(items):
 ordered=sorted(items,key=lambda x:(x['date'],x['score'],x['source_priority']),reverse=True); kept=[]
 for x in ordered:
  hit=next((k for k in kept if x['date']==k['date'] and similar(x,k)),None)
  if hit:
   hit.setdefault('also_sources',[]).append({'source':x['source'],'url':x['url']})
  else:kept.append(x)
 return kept
def pick_daily(items):
 by={}
 for x in items:by.setdefault(x['date'],[]).append(x)
 picks={}
 for d,arr in by.items():
  arr=sorted(arr,key=lambda x:(x['score'],x['source_priority']),reverse=True); chosen=[]; cats=set()
  for x in arr:
   if len(chosen)>=5:break
   if x['category'] not in cats or x['score']>=5:chosen.append(x);cats.add(x['category'])
  if len(chosen)<5:
   for x in arr:
    if x not in chosen:chosen.append(x)
    if len(chosen)>=5:break
  picks[d]=[x['id'] for x in chosen]
 return picks

def main():
 items=[];errors=[];stats={}
 for s in SOURCES:
  try:got=extract(s);items+=got;stats[s['name']]=len(got)
  except Exception as e:errors.append(s['name']+': '+str(e));stats[s['name']]=0
 items=dedupe(items)[:80]; picks=pick_daily(items)
 data={'updated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sources':[s['name'] for s in SOURCES],'source_stats':stats,'filter':'近14天 + 公考价值筛选 + 事件级去重','daily_picks':picks,'items':items}
 if errors:data['source_errors']=errors
 OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
if __name__=='__main__':main()
