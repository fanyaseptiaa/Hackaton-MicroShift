export type QueueStatus = 'OPEN' | 'LOCKED_PENDING' | 'CONFIRMED' | 'COMPLETED';

export type UserRoleMode = 'WORKER' | 'MSME';

export type AreaSlug = 'all' | 'keputih' | 'gebang' | 'manyar';

export type ConcreteAreaSlug = Exclude<AreaSlug, 'all'>;

export type TaskCategory = 'ANGKUT_BONGKAR' | 'CUCI_DAPUR';

export type FilterChipKey =
  | 'FAST_ETA'
  | 'NEARBY'
  | 'ANGKUT_BONGKAR'
  | 'CUCI_DAPUR';

export type AppScreen = 'DISPATCH' | 'ACTIVE' | 'HISTORY';

/**
 * Modeled directly after planned PostgreSQL table: `shifts`
 */
export interface ShiftRecord {
  id: string;
  roleType: 'MSME_SHIFT';
  title: string;
  businessName: string;
  ownerName: string;
  category: TaskCategory;
  areaSlug: ConcreteAreaSlug;
  rtRwZone: string;
  addressHint: string;
  distanceKm: number;
  etaMinutes: number;
  wageIdr: number;
  durationHours: number;
  queueStatus: QueueStatus;
  isRtRwVerified: boolean;
  rtVerifierName: string;
  urgentBonusIdr?: number;
  notesSimple: string;
  lockCode?: string;
  createdAt: string;
  lockedAt?: string;
  confirmedAt?: string;
  completedAt?: string;
}

/**
 * Modeled directly after planned PostgreSQL table: `workers`
 */
export interface WorkerRecord {
  id: string;
  roleType: 'STANDBY_WORKER';
  fullName: string;
  specialtyTitle: string;
  category: TaskCategory;
  areaSlug: ConcreteAreaSlug;
  rtRwZone: string;
  standbyPoint: string;
  distanceKm: number;
  etaMinutes: number;
  wageIdr: number;
  durationHours: number;
  queueStatus: QueueStatus;
  isRtRwVerified: boolean;
  rtVerifierName: string;
  completedShiftsCount: number;
  notesSimple: string;
  lockCode?: string;
  createdAt: string;
  lockedAt?: string;
  confirmedAt?: string;
  completedAt?: string;
}

export interface DispatchFilterCriteria {
  area: AreaSlug;
  chips: FilterChipKey[];
}

export interface ApiCollectionResponse<T> {
  data: T[];
  total: number;
  syncedAt: string;
}
