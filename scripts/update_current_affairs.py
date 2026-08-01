from pathlib import Path
import json, datetime, urllib.request, xml.etree.ElementTree as ET, re, hashlib
from email.utils import parsedate_to_datetime
from urllib.parse import urlparse

OUT=Path('data/current-affairs.json')
RSS='http://www.xinhuanet.com/politics/news_politics.xml'
UA='Mozilla/5.0 (Xiao Workbench current-affairs updater)'
TZ=datetime.timezone(datetime.timedelta(hours=8))
TODAY=datetime.datetime.now(TZ).date()
MAX_AGE_DAYS=14

HIGH=['习近平','中央','国务院','全国人大','全国政协','中共中央','政策','条例','意见','办法','规划','会议','改革','发展','经济','就业','教育','科技','人工智能','创新','乡村振兴','民生','社会保障','养老','医疗','生态','绿色','法治','外交','国防','航天','统计局','财政部','教育部','人社部']
LOW=['天气','降温','高温','暴雨','台风路径','娱乐','明星','电影','电视剧','体育比赛','比分','彩票','感染者','毒株','新冠','流感','健康提示']

def clean(s):
    s=re.sub(r'<[^>]+>',' ',s or '')
    return re.sub(r'\s+',' ',s).strip()

def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':UA})
    with urllib.request.urlopen(req,timeout=25) as r:return r.read()

def date_from_url(url):
    for pat in [r'/(20\d{2})[-/](\d{1,2})[-/](\d{1,2})/',r'/(20\d{2})(\d{2})(\d{2})/']:
        m=re.search(pat,url or '')
        if m:
            try:return datetime.date(*map(int,m.groups()))
            except ValueError:pass
    return None

def parse_date(raw,url):
    if raw:
        try:return parsedate_to_datetime(raw).astimezone(TZ).date()
        except Exception:pass
    return date_from_url(url)

def valuable(title,desc):
    text=title+' '+desc
    if any(k in text for k in LOW):return False
    return any(k in text for k in HIGH)

def classify(text):
    if any(k in text for k in ['科技','人工智能','创新','航天','数字经济','新质生产力']):return '科技创新'
    if any(k in text for k in ['教育','就业','医疗','养老','育儿','民生','社会保障']):return '社会民生'
    if any(k in text for k in ['经济','消费','金融','产业','市场','外贸','财政']):return '经济发展'
    if any(k in text for k in ['生态','绿色','碳','环境']):return '生态文明'
    if any(k in text for k in ['法治','条例','办法','国务院','政策','人大']):return '政策法治'
    if any(k in text for k in ['外交','国际','合作','峰会']):return '国际时政'
    return '时政要闻'

def exam(title,cat):return f'行测关注：事件时间、发布主体、核心举措及“{cat}”相关政策表述。复习时优先记官方首次提出、数字指标、制度名称和重要会议。'
def essay(cat):
    themes={'科技创新':'科技创新、新质生产力与高质量发展','社会民生':'保障和改善民生、公共服务与社会治理','经济发展':'高质量发展、扩大内需与现代化产业体系','生态文明':'绿色发展与生态文明建设','政策法治':'依法行政、制度建设与治理现代化','国际时政':'开放合作、全球治理与中国特色大国外交','时政要闻':'中国式现代化、国家治理与高质量发展'}
    return f'申论积累：可归入“{themes.get(cat,themes["时政要闻"])}”。建议从背景、举措、意义三个角度整理。'

def main():
    try:
        root=ET.fromstring(fetch(RSS));fresh=[]
        for node in root.findall('.//item')[:50]:
            title=clean(node.findtext('title'));url=clean(node.findtext('link'));desc=clean(node.findtext('description'))
            if not title or not url:continue
            d=parse_date(node.findtext('pubDate'),url)
            if not d:continue
            age=(TODAY-d).days
            if age<0 or age>MAX_AGE_DAYS:continue
            if not valuable(title,desc):continue
            cat=classify(title+' '+desc)
            fresh.append({'id':hashlib.sha1(url.encode()).hexdigest()[:12],'date':d.isoformat(),'category':cat,'source':'新华网','title':title,'summary':desc[:220] if desc else '点击原文查看新华社权威报道。','exam_point':exam(title,cat),'essay_material':essay(cat),'url':url})
        unique={x['url']:x for x in fresh}
        items=sorted(unique.values(),key=lambda x:(x['date'],x['id']),reverse=True)[:60]
        data={'updated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source':'新华网时政频道 RSS','filter':'近14天 + 公考价值关键词','items':items}
    except Exception as ex:
        data={'updated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source':'新华网时政频道 RSS','items':[],'last_error':str(ex)}
    OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
if __name__=='__main__':main()
