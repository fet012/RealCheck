import Tesseract from 'tesseract.js';

export type OcrResult = {
  text: string;
  confidence: number;
  error?: string;
};

export async function extractText(
  imageSource: File | string
): Promise<OcrResult> {
  try {
    const result = await Tesseract.recognize(imageSource, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          // Optional: log progress
          // console.log(`OCR progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    return {
      text: result.data.text,
      confidence: result.data.confidence,
    };
  } catch (e) {
    return {
      text: '',
      confidence: 0,
      error: e instanceof Error ? e.message : 'Unknown OCR error',
    };
  }
}

export function preprocessText(raw: string): string {
  // Normalize common OCR mistakes
  let cleaned = raw
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Fix common OCR confusions in NAFDAC numbers
  // e.g. "O" vs "0", "I" vs "1", "S" vs "5"
  // But be careful — don't over-correct

  return cleaned;
}