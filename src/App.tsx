import { useMemo, useState } from 'react';
import { ActiveShiftsScreen } from './components/ActiveShiftsScreen';
import { BottomNav } from './components/BottomNav';
import { DispatchCard } from './components/DispatchCard';
import { FilterToolbar } from './components/FilterToolbar';
import { HeaderBar } from './components/HeaderBar';
import { HistoryScreen } from './components/HistoryScreen';
import { OfflineBanner } from './components/OfflineBanner';
import { RoleHeroPanel } from './components/RoleHeroPanel';
import { ShiftLockModal } from './components/ShiftLockModal';
import { useShifts } from './hooks/useShifts';
import { useWorkers } from './hooks/useWorkers';
import {
  AppScreen,
  AreaSlug,
  FilterChipKey,
  ShiftRecord,
  UserRoleMode,
  WorkerRecord,
} from './types/dispatch';
import {
  filterOpenDispatchItems,
  findDeterministicFastMatch,
} from './utils/dispatchEngine';

interface LockedModalState {
  item: ShiftRecord | WorkerRecord;
  usedFallbackArea: boolean;
}

export default function App() {
  const [roleMode, setRoleMode] = useState<UserRoleMode>('WORKER');
  const [selectedArea, setSelectedArea] = useState<AreaSlug>('all');
  const [activeChips, setActiveChips] = useState<FilterChipKey[]>([]);
  const [activeScreen, setActiveScreen] = useState<AppScreen>('DISPATCH');
  const [lockedModal, setLockedModal] = useState<LockedModalState | null>(null);
  const [justConfirmedId, setJustConfirmedId] = useState<string | null>(null);

  const {
    shifts,
    lockShift,
    releaseShiftLock,
    confirmShift,
    completeShift,
    cancelConfirmedShift,
    resetShifts,
  } = useShifts();

  const {
    workers,
    lockWorker,
    releaseWorkerLock,
    confirmWorker,
    completeWorker,
    cancelConfirmedWorker,
    resetWorkers,
  } = useWorkers();

  const filteredItems = useMemo(() => {
    const criteria = { area: selectedArea, chips: activeChips };
    return roleMode === 'WORKER'
      ? filterOpenDispatchItems(shifts, criteria)
      : filterOpenDispatchItems(workers, criteria);
  }, [roleMode, selectedArea, activeChips, shifts, workers]);

  const fastMatchPreview = useMemo(() => {
    return roleMode === 'WORKER'
      ? findDeterministicFastMatch(shifts, selectedArea)
      : findDeterministicFastMatch(workers, selectedArea);
  }, [roleMode, selectedArea, shifts, workers]);

  const fastestEtaMinutes = useMemo(() => {
    if (filteredItems.length === 0) return null;
    return Math.min(...filteredItems.map((i) => i.etaMinutes));
  }, [filteredItems]);

  const confirmedShifts = useMemo(
    () => shifts.filter((s) => s.queueStatus === 'CONFIRMED'),
    [shifts]
  );
  const confirmedWorkers = useMemo(
    () => workers.filter((w) => w.queueStatus === 'CONFIRMED'),
    [workers]
  );
  const completedShifts = useMemo(
    () => shifts.filter((s) => s.queueStatus === 'COMPLETED'),
    [shifts]
  );
  const completedWorkers = useMemo(
    () => workers.filter((w) => w.queueStatus === 'COMPLETED'),
    [workers]
  );

  const activeCount = confirmedShifts.length + confirmedWorkers.length;

  const handleToggleChip = (chip: FilterChipKey) => {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleResetFilters = () => {
    setSelectedArea('all');
    setActiveChips([]);
  };

  const handleInstantDispatch = () => {
    if (!fastMatchPreview.match) return;
    const target = fastMatchPreview.match;
    const locked =
      target.roleType === 'MSME_SHIFT'
        ? lockShift(target.id)
        : lockWorker(target.id);
    if (locked) {
      setLockedModal({
        item: locked,
        usedFallbackArea: fastMatchPreview.usedFallbackArea,
      });
    }
  };

  const handleSelectCard = (item: ShiftRecord | WorkerRecord) => {
    if (item.queueStatus === 'LOCKED_PENDING') {
      setLockedModal({ item, usedFallbackArea: false });
      return;
    }
    const locked =
      item.roleType === 'MSME_SHIFT' ? lockShift(item.id) : lockWorker(item.id);
    if (locked) {
      setLockedModal({ item: locked, usedFallbackArea: false });
    }
  };

  const handleConfirmModal = (item: ShiftRecord | WorkerRecord) => {
    if (item.roleType === 'MSME_SHIFT') {
      confirmShift(item.id);
    } else {
      confirmWorker(item.id);
    }
    setLockedModal(null);
    setJustConfirmedId(item.id);
    setActiveScreen('ACTIVE');
  };

  const handleCancelModal = (item: ShiftRecord | WorkerRecord) => {
    if (item.roleType === 'MSME_SHIFT') {
      releaseShiftLock(item.id);
    } else {
      releaseWorkerLock(item.id);
    }
    setLockedModal(null);
  };

  const handleSelectScreen = (screen: AppScreen) => {
    if (screen !== 'ACTIVE') {
      setJustConfirmedId(null);
    }
    setActiveScreen(screen);
  };

  const handleResetAll = () => {
    resetShifts();
    resetWorkers();
    setJustConfirmedId(null);
    setSelectedArea('all');
    setActiveChips([]);
    setActiveScreen('DISPATCH');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 text-black md:pb-12">
      <OfflineBanner />
      <HeaderBar
        activeScreen={activeScreen}
        onSelectScreen={handleSelectScreen}
        activeCount={activeCount}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {activeScreen === 'DISPATCH' && (
          <div className="space-y-6">
            <RoleHeroPanel
              roleMode={roleMode}
              onChangeRole={setRoleMode}
              onInstantDispatch={handleInstantDispatch}
              fastestEtaMinutes={fastestEtaMinutes}
              openCount={filteredItems.length}
              hasFastMatch={Boolean(fastMatchPreview.match)}
            />

            <FilterToolbar
              selectedArea={selectedArea}
              onChangeArea={setSelectedArea}
              activeChips={activeChips}
              onToggleChip={handleToggleChip}
              onResetFilters={handleResetFilters}
              resultCount={filteredItems.length}
            />

            <section aria-label="Daftar pilihan tersedia">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-extrabold text-black sm:text-2xl">
                  {roleMode === 'WORKER'
                    ? 'Lowongan Shift UMKM Tersedia'
                    : 'Pekerja Warga Terverifikasi Standby'}
                </h2>
              </div>

              {filteredItems.length === 0 ? (
                <div className="nb-card p-8 text-center">
                  <h3 className="font-display text-lg font-bold text-black">
                    Belum Ada yang Cocok dengan Filter Ini
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-[#4B5563]">
                    Coba ganti wilayah atau matikan salah satu filter untuk
                    melihat lebih banyak pilihan di sekitar Anda.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="nb-btn mt-5 inline-flex min-h-[48px] items-center justify-center bg-[#FACC15] px-5 py-2.5 font-display text-sm font-bold text-black hover:bg-[#EAB308] cursor-pointer"
                  >
                    Tampilkan Semua Pilihan
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredItems.map((item) => (
                    <DispatchCard
                      key={item.id}
                      item={item}
                      onSelect={handleSelectCard}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeScreen === 'ACTIVE' && (
          <ActiveShiftsScreen
            confirmedShifts={confirmedShifts}
            confirmedWorkers={confirmedWorkers}
            justConfirmedId={justConfirmedId}
            onCompleteShift={completeShift}
            onCompleteWorker={completeWorker}
            onCancelShift={cancelConfirmedShift}
            onCancelWorker={cancelConfirmedWorker}
            onBackToDispatch={() => handleSelectScreen('DISPATCH')}
          />
        )}

        {activeScreen === 'HISTORY' && (
          <HistoryScreen
            completedShifts={completedShifts}
            completedWorkers={completedWorkers}
            onResetAll={handleResetAll}
          />
        )}
      </main>

      <ShiftLockModal
        item={lockedModal?.item ?? null}
        usedFallbackArea={lockedModal?.usedFallbackArea ?? false}
        onConfirm={handleConfirmModal}
        onCancel={handleCancelModal}
      />

      <BottomNav
        activeScreen={activeScreen}
        onSelectScreen={handleSelectScreen}
        activeCount={activeCount}
      />
    </div>
  );
}
