import { useCallback, useEffect, useState } from 'react';
import { INITIAL_SHIFTS } from '../data/mockDispatchData';
import { ApiCollectionResponse, ShiftRecord } from '../types/dispatch';
import { generateLockCode } from '../utils/dispatchEngine';

const STORAGE_KEY = 'microshift_shifts_v1';

/**
 * Data access layer modeled for drop-in replacement with Next.js REST API:
 * GET /api/shifts, PATCH /api/shifts/:id/lock, PATCH /api/shifts/:id/confirm
 */
function readPersistedShifts(): ShiftRecord[] {
  if (typeof window === 'undefined') return INITIAL_SHIFTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SHIFTS;
    const parsed = JSON.parse(raw) as ApiCollectionResponse<ShiftRecord>;
    if (Array.isArray(parsed.data) && parsed.data.length > 0) {
      return parsed.data;
    }
  } catch {
    // Fallback cleanly to initial dataset if local cache is invalid
  }
  return INITIAL_SHIFTS;
}

function writePersistedShifts(data: ShiftRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: ApiCollectionResponse<ShiftRecord> = {
      data,
      total: data.length,
      syncedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function useShifts() {
  const [shifts, setShifts] = useState<ShiftRecord[]>(() => readPersistedShifts());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    writePersistedShifts(shifts);
  }, [shifts]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    // Deterministic sync simulation; swap with fetch('/api/shifts') for PostgreSQL backend
    setShifts(readPersistedShifts());
    setIsLoading(false);
  }, []);

  const lockShift = useCallback(
    (shiftId: string): ShiftRecord | null => {
      const target = shifts.find((item) => item.id === shiftId);
      if (!target) return null;
      const now = new Date().toISOString();
      const updated: ShiftRecord = {
        ...target,
        queueStatus: 'LOCKED_PENDING',
        lockCode: generateLockCode(target.id),
        lockedAt: now,
      };
      setShifts((prev) =>
        prev.map((item) => (item.id === shiftId ? updated : item))
      );
      return updated;
    },
    [shifts]
  );

  const releaseShiftLock = useCallback((shiftId: string) => {
    setShifts((prev) =>
      prev.map((item) =>
        item.id === shiftId && item.queueStatus === 'LOCKED_PENDING'
          ? {
              ...item,
              queueStatus: 'OPEN',
              lockCode: undefined,
              lockedAt: undefined,
            }
          : item
      )
    );
  }, []);

  const confirmShift = useCallback((shiftId: string) => {
    const now = new Date().toISOString();
    setShifts((prev) =>
      prev.map((item) =>
        item.id === shiftId
          ? {
              ...item,
              queueStatus: 'CONFIRMED',
              confirmedAt: now,
            }
          : item
      )
    );
  }, []);

  const completeShift = useCallback((shiftId: string) => {
    const now = new Date().toISOString();
    setShifts((prev) =>
      prev.map((item) =>
        item.id === shiftId
          ? {
              ...item,
              queueStatus: 'COMPLETED',
              completedAt: now,
            }
          : item
      )
    );
  }, []);

  const cancelConfirmedShift = useCallback((shiftId: string) => {
    setShifts((prev) =>
      prev.map((item) =>
        item.id === shiftId && item.queueStatus === 'CONFIRMED'
          ? {
              ...item,
              queueStatus: 'OPEN',
              lockCode: undefined,
              lockedAt: undefined,
              confirmedAt: undefined,
            }
          : item
      )
    );
  }, []);

  const resetShifts = useCallback(() => {
    setShifts(INITIAL_SHIFTS);
  }, []);

  return {
    shifts,
    isLoading,
    error,
    refetch,
    lockShift,
    releaseShiftLock,
    confirmShift,
    completeShift,
    cancelConfirmedShift,
    resetShifts,
  };
}
