import json
import re

with open('unique_svgs_fixed.json') as f:
    svgs = json.load(f)

# SVG 4
svgs[4] = re.sub(r'<rect x="46".*?opacity="0.25"/>', '', svgs[4], flags=re.DOTALL)
# Or easier: just match unclosed tags and close them, or remove broken lines.
# Actually, since I have the tools to write python, let's just do line-by-line removal of broken lines.

def clean_broken_lines(svg_text):
    lines = svg_text.split('\n')
    cleaned = []
    for line in lines:
        if '<' in line and '>' not in line and not line.strip().startswith('C') and not line.strip().startswith('L') and not line.strip().startswith('Q'):
            # It's a broken tag line like `<line x1=... stro`
            # or ` stroke-width.../>`
            pass
        elif line.strip().startswith('stroke-width') or line.strip().startswith('fill="'):
            # dangling attributes
            pass
        else:
            cleaned.append(line)
    return '\n'.join(cleaned)

for i in [4, 12, 13, 19, 25]:
    svgs[i] = clean_broken_lines(svgs[i])

with open('unique_svgs_fixed.json', 'w') as f:
    json.dump(svgs, f, indent=2)

