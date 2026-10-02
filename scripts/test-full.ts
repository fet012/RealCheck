import { runAllRules } from '../lib/rules';
import { summarize } from '../lib/scoring';

const sampleLabel = `
MAMADOR PALM OIL
NAFDAC: A8-102337L
Manufactured by PALLY AGRO PRODUCTS LIMITED
Plot 12, Industrial Estate, Lagos
Best Before: 12/2026
Batch No: A1234
`;

const results = runAllRules(sampleLabel, 'packaged_food');
const report = summarize(results);

console.log('Level:', report.level);
console.log('Headline:', report.headline);
console.log('Checked:', report.checkedCount);
console.log('');
console.log('Fails:');
report.fails.forEach((r) => console.log(`  ❌ ${r.name}: ${r.message}`));
console.log('Warns:');
report.warns.forEach((r) => console.log(`  ⚠️  ${r.name}: ${r.message}`));
console.log('Passes:');
report.passes.forEach((r) => console.log(`  ✅ ${r.name}: ${r.message}`));
console.log('Skips:');
report.skips.forEach((r) => console.log(`  ⏭️  ${r.name}: ${r.message}`));