import re

def kebab_to_camel(match):
    return match.group(1).upper()

def fix_svg_for_react(svg):
    svg = re.sub(r'<!--.*?-->', '', svg, flags=re.DOTALL)
    svg = svg.replace('<svg', '<svg className="w-full h-full"')
    
    attributes_to_fix = [
        'stop-color', 'stop-opacity', 'stroke-width', 'stroke-linecap',
        'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
        'font-family', 'font-size', 'font-weight', 'text-anchor',
        'fill-opacity', 'fill-rule', 'clip-rule', 'clip-path',
        'stroke-miterlimit', 'stroke-opacity', 'flood-color', 'flood-opacity',
        'dominant-baseline'
    ]
    
    for attr in attributes_to_fix:
        camel = re.sub(r'-(.)', kebab_to_camel, attr)
        svg = svg.replace(attr, camel)
        
    def fix_style(match):
        inner = match.group(1)
        parts = inner.split(';')
        js_parts = []
        for p in parts:
            if ':' in p:
                k, v = p.split(':', 1)
                k = k.strip()
                v = v.strip()
                if v.startswith('#') or not v.replace('.','',1).isdigit():
                    js_parts.append(f"{k}: '{v}'")
                else:
                    js_parts.append(f"{k}: {v}")
        return 'style={{' + ', '.join(js_parts) + '}}'
        
    svg = re.sub(r'style="([^"]+)"', fix_style, svg)
    svg = svg.replace('xmlns:xlink', 'xmlnsXlink')
    
    return svg

with open('invalid_13.svg') as f:
    svg13 = f.read()
# Fix syntax error in 13
svg13 = svg13.replace('y="\n\n>\n    <line', 'y="245">\n    <line')

with open('invalid_19.svg') as f:
    svg19 = f.read()
# Fix syntax error in 19
svg19 = svg19.replace('stroke-width="1.5\n\n>', 'stroke-width="1.5">')

out13 = fix_svg_for_react(svg13)
out19 = fix_svg_for_react(svg19)

with open('calc_doc.txt', 'w') as f:
    f.write("export const CalculatorIcon = () => (\n" + out13 + ");\n\n")
    f.write("export const DocumentIcon = () => (\n" + out19 + ");\n\n")
    f.write("export const SystemIcon = () => (\n")
