import { runAllRules } from  '../lib/rules';

const sampleLabel = `
MAMADOR PALM OIL
NAFDAC: 01-2345
Manufactured by Mamador Nigeria Ltd
Plot 12, Industrial Estate, Lagos
Best Before: 12/2026
Batch No: A1234
`;

const sampleNoNafdac = `
SOME RANDOM PRODUCT
Manufactured by Unknown Ltd
Best Before: 12/2026
`;

console.log('--- With NAFDAC ---');
console.log(runAllRules(sampleLabel, 'packaged_food'));

console.log('--- Without NAFDAC ---');
console.log(runAllRules(sampleNoNafdac, 'packaged_food'));