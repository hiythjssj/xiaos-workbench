from pathlib import Path
import json, datetime, urllib.request, urllib.parse, xml.etree.ElementTree as ET, re, hashlib

OUT=Path('data/current-affairs.json')
RSS='http://www.xinhuanet.com/politics/news_politics.xml'
UA='Mozilla/5.0 (Xiao Workbench current-affairs updater)'

def clean(s):
    s=re.sub(r'<[^>]+>',' ',s or '')
    return re.sub(r'\s+',' ',s).strip()

def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':UA})
    with urllib.request.urlopen(req,timeout=25) as r:return r.read()

def parse_date(s):
    if not s:return datetime.date.today().isoformat()
    from email.utils import parsedate_to_datetime
    try:return parsedate_to_datetime(s).astimezone(datetime.timezone(datetime.timedelta(hours=8))).date().isoformat()
    except Exception:return datetime.date.today().isoformat()

def classify(title):
    if any(k in title for k in ['科技','人工智能','创新','航天','数字']):return '科技创新'
    if any(k in title for k in ['教育','就业','医疗','养老','育儿','民生']):return '社会民生'
    if any(k in title for k in ['经济','消费','金融','产业','市场','外贸']):return '经济发展'
    if any(k in title for k in ['生态','绿色','碳','环境']):return '生态文明'
    if any(k in title for k in ['法治','条例','办法','国务院','政策']):return '政策法治'
    return '时政要闻'

def exam(title,cat):
    return f'关注“{title}”涉及的时间、主体、政策背景与核心举措，可用于行测常识判断。'

def essay(title,cat):
    themes={'科技创新':'科技创新、新质生产力与高质量发展','社会民生':'保障和改善民生、公共服务与社会治理','经济发展':'高质量发展、扩大内需与现代化产业体系','生态文明':'绿色发展、生态文明建设与可持续发展','政策法治':'依法行政、国家治理体系和治理能力现代化','时政要闻':'国家治理、中国式现代化与公共政策'}
    return f'可积累到“{themes.get(cat,themes["时政要闻"])}”主题。答题时结合官方原文提炼事实与举措。'

def main():
    try:data=json.loads(OUT.read_text(encoding='utf-8'))
    except Exception:data={'items':[]}
    old={x.get('url'):x for x in data.get('items',[]) if x.get('url')}
    try:
        root=ET.fromstring(fetch(RSS));items=[]
        for node in root.findall('.//item')[:20]:
            title=clean(node.findtext('title'));url=clean(node.findtext('link'));desc=clean(node.findtext('description'));date=parse_date(node.findtext('pubDate'))
            if not title or not url:continue
            cat=classify(title)
            item={'id':hashlib.sha1(url.encode()).hexdigest()[:12],'date':date,'category':cat,'source':'新华网','title':title,'summary':desc[:220] if desc else '点击原文查看新华社权威报道。','exam_point':exam(title,cat),'essay_material':essay(title,cat),'url':url}
            old[url]=item
        items=sorted(old.values(),key=lambda x:(x.get('date',''),x.get('id','')),reverse=True)[:180]
        data={'updated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source':'新华网时政频道 RSS','items':items}
    except Exception as ex:
        data['updated_at']=datetime.datetime.now(datetime.timezone.utc).isoformat();data['last_error']=str(ex)
    OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
if __name__=='__main__':main()
