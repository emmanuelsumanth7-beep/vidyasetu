import json

with open('/Users/sumanthemmanuel/.gemini/antigravity/brain/19a1158a-588b-4359-a5ce-6ec7e127fa56/.system_generated/logs/transcript.jsonl') as f:
    lines = f.readlines()

svgs = []
for line in lines:
    data = json.loads(line)
    if data.get('type') == 'USER_INPUT':
        content = data.get('content', '')
        if '<svg' in content:
            # extract all <svg>...</svg> blocks
            import re
            matches = re.findall(r'(<svg.*?</svg>)', content, re.DOTALL)
            svgs.extend(matches)

# Dedup SVGs exactly
unique_svgs = []
for svg in svgs:
    if svg not in unique_svgs:
        unique_svgs.append(svg)

print(f"Found {len(unique_svgs)} unique SVGs in user messages.")
with open('unique_svgs.json', 'w') as f:
    json.dump(unique_svgs, f, indent=2)

