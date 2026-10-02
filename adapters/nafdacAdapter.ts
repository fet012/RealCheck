import medicines from '../data/medicines.json';
import cosmetics from '../data/cosmetics.json';
import packagedFood from '../data/packaged-food.json';

export type NafdacRecord = {
  nrn: string;
  name: string;
  manufacturer: string;
  status: string;
  activeIngredients?: string;
  form?: string;
  strength?: string;
  subcategory?: string;
  presentation?: string;
  expiryDate?: string;
  category?: string;
};

export type Category = 'medicines' | 'cosmetics' | 'packaged_food';

export type NafdacLookupResult =
  | { status: 'found'; record: NafdacRecord }
  | { status: 'not_found' }
  | { status: 'skipped'; reason: string };

const snapshot: Record<Category, NafdacRecord[]> = {
  medicines: medicines.medicines || [],
  cosmetics: cosmetics.cosmetics || [],
  packaged_food: packagedFood.packaged_food || [],
};

export function verifyNafdacNumber(
  nrn: string,
  category: Category
): NafdacLookupResult {
  const cleaned = nrn.trim().toUpperCase();

  if (!cleaned || cleaned === 'NIL') {
    return { status: 'skipped', reason: 'No NAFDAC number to check' };
  }

  const records = snapshot[category] || [];
  const found = records.find(
    (r) => r.nrn.trim().toUpperCase() === cleaned
  );

  if (!found) {
    return { status: 'not_found' };
  }

  return { status: 'found', record: found };
}

export function getSnapshotStats() {
  return {
    medicines: snapshot.medicines.length,
    cosmetics: snapshot.cosmetics.length,
    packaged_food: snapshot.packaged_food.length,
    total:
      snapshot.medicines.length +
      snapshot.cosmetics.length +
      snapshot.packaged_food.length,
  };
}