import {
  verifyNafdacNumber,
  getSnapshotStats,
} from '../adapters/nafdacAdapter';

console.log('Snapshot stats:', getSnapshotStats());

// Test with a real medicine NRN
console.log(
  'Medicine A11-0009:',
  verifyNafdacNumber('A11-0009', 'medicines')
);

// Test with a real cosmetics NRN
console.log(
  'Cosmetic 02-1201:',
  verifyNafdacNumber('02-1201', 'cosmetics')
);

// Test with a real food NRN
console.log(
  'Food A8-102316L:',
  verifyNafdacNumber('A8-102316L', 'packaged_food')
);

// Test with a fake NRN
console.log(
  'Fake 99-9999:',
  verifyNafdacNumber('99-9999', 'medicines')
);

// Test with NIL
console.log(
  'NIL:',
  verifyNafdacNumber('NIL', 'cosmetics')
);