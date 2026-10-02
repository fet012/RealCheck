# RealCheck

A PWA that lets Nigerian consumers photograph a product label and get an honest risk report before they buy or consume it.

**It never says "this is genuine." It says "here are the red flags."**

---

## The Problem

Fake products are everywhere in Nigerian markets  fake drugs, fake yoghurt, fake toothpaste, fake palm oil. NAFDAC is underfunded. Sproxil only covers pharma with manufacturer opt-in. The categories with the highest counterfeit penetration  cosmetics, cooking oil, packaged food  have zero consumer-facing verification infrastructure.

Nigerians cannot tell if a product is real or fake before they buy it.

## What RealCheck Does

Photograph a product label. RealCheck:

1. Extracts the text (OCR, runs entirely in your browser)
2. Checks the NAFDAC number against a snapshot of NAFDAC registration data
3. Compares the manufacturer name and address against what's in the database
4. Flags missing expiry dates, batch numbers, suspicious label patterns
5. Returns an honest report: what passed, what was flagged, what we couldn't verify

**It does not confirm authenticity.** A counterfeit can copy every detail on a label. RealCheck reports red flags, not certificates.

---

## Coverage

| Category | Records | Source |
|---|---|---|
| Medicines | 72 | NAFDAC Greenbook |
| Cosmetics | 28 | NAFDAC CDCL lab analysis lists |
| Packaged Food | 20 | NAFDAC product registration data |

**Total: 120 records.** Snapshot-based. No live APIs. No scraping during the demo.

### Honest limitations

- Cannot confirm the specific unit in your hand is genuine
- Cannot replace a lab test or NAFDAC field inspection
- Does not cover every product category yet
- NAFDAC does not publish a public API  this uses a manually collected snapshot

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first config)
- **OCR:** Tesseract.js (browser-based, no API key, no server)
- **Data:** Local JSON snapshot (`data/`)
- **Format:** PWA (installable, offline-capable after first load)
- **Deploy:** Vercel

---

## Architecture
