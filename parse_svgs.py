import json

with open('/Users/sumanthemmanuel/.gemini/antigravity/brain/19a1158a-588b-4359-a5ce-6ec7e127fa56/.system_generated/logs/transcript.jsonl') as f:
    lines = f.readlines()

svgs = []
for line in lines:
    data = json.loads(line)
    if data.get('type') == 'USER_INPUT':
        content = data.get('content', '')
        if '<svg' in content:
            svgs.append(content)

with open('svgs.txt', 'w') as out:
    for i, s in enumerate(svgs):
        out.write(f"=== SVG {i} ===\n{s}\n")
