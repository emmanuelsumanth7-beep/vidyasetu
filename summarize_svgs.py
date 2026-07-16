import json
import re

with open('unique_svgs.json') as f:
    svgs = json.load(f)

for i, svg in enumerate(svgs):
    # grab some distinctive colors or text or paths to identify
    comments = re.findall(r'<!--(.*?)-->', svg)
    print(f"SVG {i}: {comments[:4]}")
