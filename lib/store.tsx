'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Report } from './scoring';
import type { Category } from '../adapters/nafdacAdapter';

type ScanState = {
  imageDataUrl: string | null;
  ocrText: string;
  report: Report | null;
  category: Category;
  setImageDataUrl: (url: string | null) => void;
  setOcrText: (text: string) => void;
  setReport: (report: Report | null) => void;
  setCategory: (category: Category) => void;
  reset: () => void;
};

const ScanContext = createContext<ScanState | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [category, setCategory] = useState<Category>('medicines');

  const reset = () => {
    setImageDataUrl(null);
    setOcrText('');
    setReport(null);
  };

  return (
    <ScanContext.Provider
      value={{
        imageDataUrl,
        ocrText,
        report,
        category,
        setImageDataUrl,
        setOcrText,
        setReport,
        setCategory,
        reset,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScan must be used within ScanProvider');
  return ctx;
}