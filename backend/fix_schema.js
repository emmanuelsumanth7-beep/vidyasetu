const fs = require('fs');
const content = fs.readFileSync('prisma/schema.prisma', 'utf-8');
const lines = content.split('\n');

let newLines = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (i > 0 && (line.startsWith('model ') || line.startsWith('datasource ')) && !newLines[newLines.length - 1].includes('}')) {
    // find the last non-empty line
    let lastIndex = newLines.length - 1;
    while(lastIndex >= 0 && newLines[lastIndex].trim() === '') {
      lastIndex--;
    }
    if (lastIndex >= 0 && !newLines[lastIndex].includes('}')) {
       newLines.splice(lastIndex + 1, 0, '}');
    }
  }
  newLines.push(line);
}
// Add closing brace for the last model
let lastIndex = newLines.length - 1;
while(lastIndex >= 0 && newLines[lastIndex].trim() === '') {
  lastIndex--;
}
if (lastIndex >= 0 && !newLines[lastIndex].includes('}')) {
  newLines.splice(lastIndex + 1, 0, '}');
}

fs.writeFileSync('prisma/schema.prisma.fixed', newLines.join('\n'));
console.log('Done');
