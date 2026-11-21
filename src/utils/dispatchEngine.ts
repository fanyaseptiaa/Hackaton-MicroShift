import {
  AreaSlug,
  DispatchFilterCriteria,
  QueueStatus,
  TaskCategory,
} from '../types/dispatch';

export interface FilterableDispatchEntity {
  id: string;
  areaSlug: Exclude<AreaSlug, 'all'>;
  category: TaskCategory;
  distanceKm: number;
  etaMinutes: number;
  queueStatus: QueueStatus;
}

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function filterOpenDispatchItems<T extends FilterableDispatchEntity>(
  items: T[],
  criteria: DispatchFilterCriteria
): T[] {
  const openItems = items.filter(
    (item) => item.queueStatus === 'OPEN' || item.queueStatus === 'LOCKED_PENDING'
  );

  const selectedCategories: TaskCategory[] = [];
  if (criteria.chips.includes('ANGKUT_BONGKAR')) {
    selectedCategories.push('ANGKUT_BONGKAR');
  }
  if (criteria.chips.includes('CUCI_DAPUR')) {
    selectedCategories.push('CUCI_DAPUR');
  }

  return openItems
    .filter((item) => {
      if (criteria.area !== 'all' && item.areaSlug !== criteria.area) {
        return false;
      }
      if (criteria.chips.includes('FAST_ETA') && item.etaMinutes >= 15) {
        return false;
      }
      if (criteria.chips.includes('NEARBY') && item.distanceKm >= 2) {
        return false;
      }
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(item.category)
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.etaMinutes !== b.etaMinutes) return a.etaMinutes - b.etaMinutes;
      if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
      return a.id.localeCompare(b.id);
    });
}

export interface FastMatchResult<T> {
  match: T | null;
  usedFallbackArea: boolean;
}

/**
 * Non-AI deterministic matcher: finds the nearest OPEN item under 15 minutes ETA.
 */
export function findDeterministicFastMatch<T extends FilterableDispatchEntity>(
  items: T[],
  preferredArea: AreaSlug
): FastMatchResult<T> {
  const fastCandidates = items
    .filter((item) => item.queueStatus === 'OPEN' && item.etaMinutes < 15)
    .sort((a, b) => {
      if (a.etaMinutes !== b.etaMinutes) return a.etaMinutes - b.etaMinutes;
      if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
      return a.id.localeCompare(b.id);
    });

  if (fastCandidates.length === 0) {
    return { match: null, usedFallbackArea: false };
  }

  if (preferredArea !== 'all') {
    const areaMatch = fastCandidates.find(
      (item) => item.areaSlug === preferredArea
    );
    if (areaMatch) {
      return { match: areaMatch, usedFallbackArea: false };
    }
    return { match: fastCandidates[0], usedFallbackArea: true };
  }

  return { match: fastCandidates[0], usedFallbackArea: false };
}

export function generateLockCode(id: string): string {
  const suffix = id.slice(-3).toUpperCase();
  return `RT-${suffix}-LOCK`;
}
