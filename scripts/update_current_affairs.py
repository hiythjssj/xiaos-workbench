from pathlib import Path
import json, datetime

# 数据管线骨架。后续接入经确认可稳定访问的权威公开来源。
# 保留已有历史条目，定时任务每天运行，不覆盖收藏等用户侧数据。
p=Path('data/current-affairs.json')
try:
    data=json.loads(p.read_text(encoding='utf-8'))
except Exception:
    data={'items':[]}
data['updated_at']=datetime.datetime.now(datetime.timezone.utc).isoformat()
data.setdefault('items',[])
p.parent.mkdir(parents=True,exist_ok=True)
p.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
