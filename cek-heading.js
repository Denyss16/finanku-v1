const fs = require('fs');
const path = require('path');

// Ganti nama file jika ingin cek markdown lain
const filePath = path.join(__dirname, 'public', 'artikel', 'dana-darurat.md');

const lines = fs.readFileSync(filePath, 'utf8').split('\n');

lines.forEach((line, i) => {
  if (/^.*#+/.test(line)) {
    const ascii = Array.from(line).map(c => c.charCodeAt(0)).join(',');
    console.log(`Line ${i + 1}: '${line}' | ASCII: [${ascii}]`);
  }
});
