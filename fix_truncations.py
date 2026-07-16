import json
import re

with open('unique_svgs.json') as f:
    svgs = json.load(f)

for i in range(len(svgs)):
    # If the SVG contains <truncated
    if '<truncated' in svgs[i]:
        # We will aggressively remove the <truncated ...> text and any broken tag around it.
        # Just strip out the <truncated ...> and then we'll clean up manually.
        svgs[i] = re.sub(r'<truncated[^>]*>', '', svgs[i])
        # Now we might have a broken line like `stro\n stroke-width.../>`
        # Let's just remove anything that looks like a broken line.
        
with open('unique_svgs_fixed.json', 'w') as f:
    json.dump(svgs, f, indent=2)

