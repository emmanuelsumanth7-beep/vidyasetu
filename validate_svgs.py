import json
import xml.etree.ElementTree as ET

with open('unique_svgs_fixed.json') as f:
    svgs = json.load(f)

for i, svg in enumerate(svgs):
    try:
        ET.fromstring(svg)
    except Exception as e:
        print(f"SVG {i} is invalid: {e}")
        # write out the invalid svg to debug
        with open(f"invalid_{i}.svg", "w") as out:
            out.write(svg)
