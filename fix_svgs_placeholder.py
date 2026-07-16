import json

with open('unique_svgs_fixed.json') as f:
    svgs = json.load(f)

placeholder = """<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="100" fill="#F8FAFC" />
  <text x="100" y="100" font-family="sans-serif" font-size="20" fill="#94A3B8" text-anchor="middle" dominant-baseline="middle">Icon</text>
</svg>"""

for i in [4, 12, 13, 19, 25]:
    svgs[i] = placeholder

with open('unique_svgs_fixed.json', 'w') as f:
    json.dump(svgs, f, indent=2)

