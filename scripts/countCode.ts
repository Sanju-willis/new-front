import fs from 'fs';
import path from 'path';

const exts = ['.ts', '.tsx', '.js', '.json'];
const folderStats = new Map<string, { files: number; lines: number }>();

function countLines(filePath: string): number {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

function walk(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (exts.includes(path.extname(entry.name))) {
      const lines = countLines(fullPath);
      const folder = path.relative('src', path.dirname(fullPath)) || '.';

      const stats = folderStats.get(folder) || { files: 0, lines: 0 };
      stats.files += 1;
      stats.lines += lines;
      folderStats.set(folder, stats);
    }
  }
}

walk('src');

// Print results
let totalFiles = 0;
let totalLines = 0;

console.log('\n📂 Per-folder breakdown:\n');
for (const [folder, { files, lines }] of [...folderStats.entries()].sort()) {
  console.log(`${folder.padEnd(40)} | 📄 ${files.toString().padStart(3)} | 📏 ${lines.toString().padStart(5)} lines`);
  totalFiles += files;
  totalLines += lines;
}

console.log('\n📊 Total:\n');
console.log(`🗂️  Files: ${totalFiles}`);
console.log(`📏 Lines: ${totalLines}\n`);
