
export async function run({ hook }) {
  const fs = require('fs');
  const path = './data/top-hooks.md';
  fs.appendFileSync(path, `- ${hook}\n`);
}
