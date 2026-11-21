import { useCallback, useEffect, useState } from 'react';
import { INITIAL_WORKERS } from '../data/mockDispatchData';
import { ApiCollectionResponse, WorkerRecord } from '../types/dispatch';
import { generateLockCode } from '../utils/dispatchEngine';

const STORAGE_KEY = 'microshift_workers_v1';

/**
 * Data access layer modeled for drop-in replacement with Next.js REST API:
 * GET /api/workers, PATCH /api/workers/:id/lock, PATCH /api/workers/:id/confirm
 */
function readPersistedWorkers(): WorkerRecord[] {
  if (typeof window === 'undefined') return INITIAL_WORKERS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_WORKERS;
    const parsed = JSON.parse(raw) as ApiCollectionResponse<WorkerRecord>;
    if (Array.isArray(parsed.data) && parsed.data.length > 0) {
      return parsed.data;
    }
  } catch {
    // Fallback cleanly to initial dataset
  }
  return INITIAL_WORKERS;
}

function writePersistedWorkers(data: WorkerRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: ApiCollectionResponse<WorkerRecord> = {
      data,
      total: data.length,
      syncedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors
  }
}

export function useWorkers() {
  const [workers, setWorkers] = useState<WorkerRecord[]>(() =>
    readPersistedWorkers()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    writePersistedWorkers(workers);
  }, [workers]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setWorkers(readPersistedWorkers());
    setIsLoading(false);
  }, []);

  const lockWorker = useCallback(
    (workerId: string): WorkerRecord | null => {
      const target = workers.find((item) => item.id === workerId);
      if (!target) return null;
      const now = new Date().toISOString();
      const updated: WorkerRecord = {
        ...target,
        queueStatus: 'LOCKED_PENDING',
        lockCode: generateLockCode(target.id),
        lockedAt: now,
      };
      setWorkers((prev) =>
        prev.map((item) => (item.id === workerId ? updated : item))
      );
      return updated;
    },
    [workers]
  );

  const releaseWorkerLock = useCallback((workerId: string) => {
    setWorkers((prev) =>
      prev.map((item) =>
        item.id === workerId && item.queueStatus === 'LOCKED_PENDING'
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

  const confirmWorker = useCallback((workerId: string) => {
    const now = new Date().toISOString();
    setWorkers((prev) =>
      prev.map((item) =>
        item.id === workerId
          ? {
              ...item,
              queueStatus: 'CONFIRMED',
              confirmedAt: now,
            }
          : item
      )
    );
  }, []);

  const completeWorker = useCallback((workerId: string) => {
    const now = new Date().toISOString();
    setWorkers((prev) =>
      prev.map((item) =>
        item.id === workerId
          ? {
              ...item,
              queueStatus: 'COMPLETED',
              completedShiftsCount: item.completedShiftsCount + 1,
              completedAt: now,
            }
          : item
      )
    );
  }, []);

  const cancelConfirmedWorker = useCallback((workerId: string) => {
    setWorkers((prev) =>
      prev.map((item) =>
        item.id === workerId && item.queueStatus === 'CONFIRMED'
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

  const resetWorkers = useCallback(() => {
    setWorkers(INITIAL_WORKERS);
  }, []);

  return {
    workers,
    isLoading,
    error,
    refetch,
    lockWorker,
    releaseWorkerLock,
    confirmWorker,
    completeWorker,
    cancelConfirmedWorker,
    resetWorkers,
  };
}
