import re

with open('calc_doc.txt') as f:
    calc_doc_content = f.read()

# Split into CalculatorIcon and DocumentIcon
calc_match = re.search(r'(export const CalculatorIcon = \(\) => \(.*?\);\n)', calc_doc_content, re.DOTALL)
doc_match = re.search(r'(export const DocumentIcon = \(\) => \(.*?\);\n)', calc_doc_content, re.DOTALL)

calc_new = calc_match.group(1)
doc_new = doc_match.group(1)

with open('admin-web/src/components/GridIcons.tsx') as f:
    grid = f.read()

# Replace CalculatorIcon
grid = re.sub(r'export const CalculatorIcon = \(\) => \([\s\S]*?</div>\n\);', calc_new.strip(), grid)

# Replace DocumentIcon
grid = re.sub(r'export const DocumentIcon = \(\) => \([\s\S]*?</div>\n\);', doc_new.strip(), grid)

with open('admin-web/src/components/GridIcons.tsx', 'w') as f:
    f.write(grid)
