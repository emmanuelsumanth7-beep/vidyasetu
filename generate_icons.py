import json
import re

with open('unique_svgs_fixed.json') as f:
    svgs = json.load(f)

mapping = {
    'FeePaymentIcon': svgs[0],
    'ProfileIcon': svgs[1],
    'RemarksIcon': svgs[2],
    'AbsentInfoIcon': svgs[3],
    'StudyMaterialIcon': svgs[4],
    'LateComerIcon': svgs[5],
    'NotificationIcon': svgs[6],
    'CalendarIcon': svgs[7],
    'CetRegistrationIcon': svgs[8],
    'UpcomingEventsIcon': svgs[9],
    'BiometricsIcon': svgs[16],
    'GradesIcon': svgs[17],
    'TransportIcon': svgs[18],
    'DiaryIcon': svgs[14],
    'AnalyticsIcon': svgs[21],
    'SettingsIcon': svgs[22],
    'LogoutIcon': svgs[23],
    'AttendanceIcon': svgs[24],
    'SuggestionIcon': svgs[25],
    'NightModeIcon': svgs[10],
    'BellIcon': svgs[11],
    'StaffIcon': svgs[12],
    'CalculatorIcon': svgs[13],
    'SystemIcon': svgs[15],
    'DocumentIcon': svgs[19],
    'SunIcon': svgs[20],
}

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

output = "import React from 'react';\n\n"
for name, svg in mapping.items():
    fixed = fix_svg_for_react(svg)
    output += f"export const {name} = () => (\n{fixed}\n);\n\n"

with open('/Users/sumanthemmanuel/Desktop/finalproto/src/school-app/GridIcons.jsx', 'w') as f:
    f.write(output)

with open('/Users/sumanthemmanuel/Desktop/finalproto/admin-web/src/components/GridIcons.tsx', 'w') as f:
    f.write(output)

print("Icons generated successfully with comments removed.")
