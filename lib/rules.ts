import { verifyNafdacNumber, type Category } from '../adapters/nafdacAdapter';

export type RuleStatus = 'pass' | 'warn' | 'fail' | 'skip';

export type RuleResult = {
  id: string;
  name: string;
  status: RuleStatus;
  message: string;
  evidence: string | null;
};

const NAFDAC_NUMBER_REGEX = /NAFDAC[:\s]*([A-Z0-9\-\/]+)/i;

export function extractNafdacNumber(text: string): string | null {
  const match = text.match(NAFDAC_NUMBER_REGEX);
  if (!match) return null;
  return match[1].trim();
}

// ---- Rule 1: NAFDAC number present ----
export function ruleNafdacPresent(text: string): RuleResult {
  const nrn = extractNafdacNumber(text);
  if (!nrn) {
    return {
      id: 'nafdac_present',
      name: 'NAFDAC number present',
      status: 'fail',
      message: 'No NAFDAC number found on label',
      evidence: null,
    };
  }
  return {
    id: 'nafdac_present',
    name: 'NAFDAC number present',
    status: 'pass',
    message: 'NAFDAC number found',
    evidence: nrn,
  };
}

// ---- Rule 2: NAFDAC number format ----
export function ruleNafdacFormat(text: string): RuleResult {
  const nrn = extractNafdacNumber(text);
  if (!nrn) {
    return {
      id: 'nafdac_format',
      name: 'NAFDAC number format',
      status: 'skip',
      message: 'Skipped — no number to check',
      evidence: null,
    };
  }

  // Valid formats seen in real data:
  //   A11-0009, A4-8338, B4-9089, C4-1164, 04-4250, 02-1201
  //   A8-102316L, A8-5412L
  //   Plain digits: 18225, 43831, 1242588
  const validFormat = /^([A-Z]\d{1,2}-\d{3,6}[A-Z]?|\d{2}-\d{4,5}|\d{4,7})$/i;

  if (!validFormat.test(nrn)) {
    return {
      id: 'nafdac_format',
      name: 'NAFDAC number format',
      status: 'fail',
      message: 'Format does not match NAFDAC pattern',
      evidence: nrn,
    };
  }

  return {
    id: 'nafdac_format',
    name: 'NAFDAC number format',
    status: 'pass',
    message: 'Format looks correct',
    evidence: nrn,
  };
}

// ---- Rule 3: NAFDAC number exists in snapshot ----
export function ruleNafdacExists(
  text: string,
  category: Category
): RuleResult {
  const nrn = extractNafdacNumber(text);
  if (!nrn) {
    return {
      id: 'nafdac_exists',
      name: 'NAFDAC number in database',
      status: 'skip',
      message: 'Skipped — no number to verify',
      evidence: null,
    };
  }

  const result = verifyNafdacNumber(nrn, category);

  if (result.status === 'skipped') {
    return {
      id: 'nafdac_exists',
      name: 'NAFDAC number in database',
      status: 'skip',
      message: result.reason,
      evidence: nrn,
    };
  }

  if (result.status === 'not_found') {
    return {
      id: 'nafdac_exists',
      name: 'NAFDAC number in database',
      status: 'fail',
      message: 'NAFDAC number not found in database',
      evidence: nrn,
    };
  }

  return {
    id: 'nafdac_exists',
    name: 'NAFDAC number in database',
    status: 'pass',
    message: `Found in database (${result.record.name})`,
    evidence: nrn,
  };
}

// ---- Run all first rules ----
export function runAllRules(
  text: string,
  category: Category
): RuleResult[] {
  return [
    // Universal rules
    ruleNafdacPresent(text),
    ruleNafdacFormat(text),
    ruleNafdacExists(text, category),
    rulePhysicalAddress(text),
    ruleExpiryPresent(text),
    ruleBatchPresent(text),
    ruleProducedFor(text),
    ruleEnglishPresent(text),
    // Category-specific
    ruleCategoryPrefix(text, category),
  ];
}

// ---- Rule 4: Manufacturer physical address ----
export function rulePhysicalAddress(text: string): RuleResult {
  // Nigerian addresses use many patterns:
  //   "Plot 12, Industrial Estate, Lagos"
  //   "487 Shagamu-Ikorodu Road, Ikorodu"
  //   "No 12 Ajayi Close, Prince Bus-Stop"
  //   "C48, Oba Akinyemi Way, Amuwo-Odofin"
  //   "14 Nojimudeen Bakare Street, Owode"
  //   "3K Oshodi Industrial Scheme, Aswani Road"
  const addressPatterns = [
    /\d+\s+\w+(\s+\w+)*\s+(street|st|road|rd|avenue|ave|close|lane|crescent|way|drive|expressway|scheme|estate|layout|industrial)/i,
    /\bplot\s+\d+/i,
    /\bno\.?\s*\d+/i,
    /\b\d+[a-z]?\s+\w+\s+(street|road|close|way|lane|drive)/i,
  ];

  const hasAddress = addressPatterns.some((p) => p.test(text));
  const hasEmailOnly = /@/.test(text) && !hasAddress;

  if (hasEmailOnly) {
    return {
      id: 'physical_address',
      name: 'Manufacturer physical address',
      status: 'fail',
      message: 'Only email/website found — no physical address',
      evidence: null,
    };
  }

  if (!hasAddress) {
    return {
      id: 'physical_address',
      name: 'Manufacturer physical address',
      status: 'warn',
      message: 'No clear physical address found',
      evidence: null,
    };
  }

  return {
    id: 'physical_address',
    name: 'Manufacturer physical address',
    status: 'pass',
    message: 'Physical address present',
    evidence: null,
  };
}

// ---- Rule 5: Expiry / best-before date ----
export function ruleExpiryPresent(text: string): RuleResult {
  const has = /(exp|expiry|expires|best\s+before|use\s+by|best\s+by)/i.test(text);

  if (!has) {
    return {
      id: 'expiry_present',
      name: 'Expiry / best-before date',
      status: 'warn',
      message: 'No expiry or best-before date found',
      evidence: null,
    };
  }

  return {
    id: 'expiry_present',
    name: 'Expiry / best-before date',
    status: 'pass',
    message: 'Expiry date present',
    evidence: null,
  };
}

// ---- Rule 6: Batch / lot number ----
export function ruleBatchPresent(text: string): RuleResult {
  const has = /(batch|lot|b\.?\s*no|batch\s*no|lot\s*no)/i.test(text);

  if (!has) {
    return {
      id: 'batch_present',
      name: 'Batch / lot number',
      status: 'warn',
      message: 'No batch/lot number found',
      evidence: null,
    };
  }

  return {
    id: 'batch_present',
    name: 'Batch / lot number',
    status: 'pass',
    message: 'Batch/lot number present',
    evidence: null,
  };
}

// ---- Rule 7: Suspicious "Produced for" pattern ----
export function ruleProducedFor(text: string): RuleResult {
  const match = text.match(/produced\s+(and\s+)?(marketed\s+)?for[^\n]{0,80}/i);

  if (match) {
    return {
      id: 'produced_for',
      name: 'Suspicious "Produced for" pattern',
      status: 'warn',
      message: 'Label says "Produced for" — check manufacturer is traceable',
      evidence: match[0].trim(),
    };
  }

  return {
    id: 'produced_for',
    name: 'Suspicious "Produced for" pattern',
    status: 'pass',
    message: 'No suspicious pattern found',
    evidence: null,
  };
}

// ---- Rule 8: English label present ----
export function ruleEnglishPresent(text: string): RuleResult {
  const hasEnglish = /[a-zA-Z]{4,}/.test(text);
  const hasChinese = /[\u4e00-\u9fff]/.test(text);
  const hasArabic = /[\u0600-\u06ff]/.test(text);
  const hasCyrillic = /[\u0400-\u04ff]/.test(text);

  if ((hasChinese || hasArabic || hasCyrillic) && !hasEnglish) {
    return {
      id: 'english_present',
      name: 'English label present',
      status: 'fail',
      message: 'Foreign-language-only label — likely not NAFDAC-registered',
      evidence: null,
    };
  }

  return {
    id: 'english_present',
    name: 'English label present',
    status: 'pass',
    message: 'English text present',
    evidence: null,
  };
}

// ---- Rule 9: Category-specific NAFDAC prefix ----
export function ruleCategoryPrefix(
  text: string,
  category: Category
): RuleResult {
  const nrn = extractNafdacNumber(text);

  if (!nrn) {
    return {
      id: 'category_prefix',
      name: 'NAFDAC prefix matches category',
      status: 'skip',
      message: 'Skipped — no number to check',
      evidence: null,
    };
  }

  const prefix = nrn.split('-')[0].toUpperCase();

  const categoryPrefixes: Record<Category, string[]> = {
    medicines: ['A4', 'A11', 'B4', 'C4', '04', 'A7'],
    cosmetics: ['A2', '02', 'C'],
    packaged_food: ['A8', '01', 'N'],
  };

  const validPrefixes = categoryPrefixes[category] || [];

  // If the NRN has no dash (plain digits like "18225" or "43831"), skip prefix check
  if (!nrn.includes('-')) {
    return {
      id: 'category_prefix',
      name: 'NAFDAC prefix matches category',
      status: 'pass',
      message: 'Number format has no prefix to check',
      evidence: nrn,
    };
  }

  if (!validPrefixes.includes(prefix)) {
    return {
      id: 'category_prefix',
      name: 'NAFDAC prefix matches category',
      status: 'warn',
      message: `Prefix "${prefix}" is not typical for ${category.replace('_', ' ')}`,
      evidence: nrn,
    };
  }

  return {
    id: 'category_prefix',
    name: 'NAFDAC prefix matches category',
    status: 'pass',
    message: `Prefix "${prefix}" is consistent with category`,
    evidence: nrn,
  };
}