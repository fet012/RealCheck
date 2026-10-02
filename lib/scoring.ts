import type { RuleResult } from './rules';

export type ReportLevel = 'SERIOUS' | 'MINOR' | 'NONE';

export type Report = {
  level: ReportLevel;
  headline: string;
  disclaimer: string;
  checkedCount: number;
  fails: RuleResult[];
  warns: RuleResult[];
  passes: RuleResult[];
  skips: RuleResult[];
  all: RuleResult[];
};

export function summarize(results: RuleResult[]): Report {
  const fails = results.filter((r) => r.status === 'fail');
  const warns = results.filter((r) => r.status === 'warn');
  const passes = results.filter((r) => r.status === 'pass');
  const skips = results.filter((r) => r.status === 'skip');

  let level: ReportLevel;
  let headline: string;

  if (fails.length > 0) {
    level = 'SERIOUS';
    headline = 'Serious concerns found';
  } else if (warns.length > 0) {
    level = 'MINOR';
    headline = 'Minor concerns found';
  } else {
    level = 'NONE';
    headline = 'No red flags found';
  }

  return {
    level,
    headline,
    disclaimer:
      'This does not confirm the product is genuine. It only reports what we checked and found. A counterfeit can copy every detail on a label.',
    checkedCount: results.length,
    fails,
    warns,
    passes,
    skips,
    all: results,
  };
}