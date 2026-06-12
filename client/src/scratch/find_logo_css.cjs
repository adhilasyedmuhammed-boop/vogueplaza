const fs = require('fs');
const css = fs.readFileSync('client/src/index.css', 'utf8');
const lines = css.split('\n');
lines.forEach((line, index) => {
  if (line.includes('.tc-logo') || line.includes('.tc-header-bar') || line.includes('.tc-header-left') || line.includes('.tc-header-right')) {
    console.log(`Line ${index + 1}: ${line}`);
    // Print 5 lines around it
    for (let i = Math.max(0, index - 2); i <= Math.min(lines.length - 1, index + 8); i++) {
      console.log(`  [${i + 1}] ${lines[i]}`);
    }
    console.log('---');
  }
});
