import React from 'react';
import { CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';
import { ShiftRecord, WorkerRecord } from '../types/dispatch';
import { formatRupiah } from '../utils/dispatchEngine';

interface HistoryScreenProps {
  completedShifts: ShiftRecord[];
  completedWorkers: WorkerRecord[];
  onResetAll: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  completedShifts,
  completedWorkers,
  onResetAll,
}) => {
  const allCompleted = [
    ...completedShifts.map((s) => ({ kind: 'SHIFT' as const, data: s })),
    ...completedWorkers.map((w) => ({ kind: 'WORKER' as const, data: w })),
  ];

  const totalIdr = allCompleted.reduce((sum, entry) => {
    const bonus =
      entry.kind === 'SHIFT' ? (entry.data.urgentBonusIdr ?? 0) : 0;
    return sum + entry.data.wageIdr + bonus;
  }, 0);

  return (
    <section aria-label="Riwayat kerja dan upah" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-black sm:text-3xl">
            Riwayat Tugas &amp; Upah
          </h1>
          <p className="mt-1 text-sm font-medium text-[#4B5563]">
            Catatan shift yang sudah selesai dan pembayaran langsung antar warga
            &amp; UMKM.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetAll}
          className="nb-btn inline-flex min-h-[48px] items-center justify-center gap-2 bg-white px-4 py-2 font-display text-xs font-bold text-black hover:bg-[#F3F3F3] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
          Muat Ulang Data Awal
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="nb-card p-5">
          <p className="font-display text-xs font-bold tracking-wide text-[#4B5563]">
            Total Tugas Selesai
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold text-black tabular-nums">
            {allCompleted.length} shift
          </p>
        </div>
        <div className="nb-card bg-[#FACC15] p-5">
          <p className="font-display text-xs font-bold tracking-wide text-black">
            Total Upah Cair
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold text-black tabular-nums">
            {formatRupiah(totalIdr)}
          </p>
        </div>
      </div>

      {allCompleted.length === 0 ? (
        <div className="nb-card p-8 text-center">
          <h2 className="font-display text-lg font-bold text-black">
            Belum Ada Riwayat Selesai
          </h2>
          <p className="mt-2 text-sm text-[#4B5563]">
            Setelah Anda menyelesaikan shift di tab Shift Aktif, catatan upah
            akan tampil di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {allCompleted.map(({ kind, data }) => {
            const isShift = kind === 'SHIFT';
            const totalWage = isShift
              ? data.wageIdr + (data.urgentBonusIdr ?? 0)
              : data.wageIdr;

            return (
              <div
                key={data.id}
                className="nb-card flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded border-2 border-black bg-[#10B981] px-2 py-0.5 font-display text-[11px] font-extrabold text-black">
                      <CheckCircle2
                        className="h-3 w-3 shrink-0"
                        aria-hidden="true"
                      />
                      SELESAI
                    </span>
                    <span className="text-xs font-medium text-[#4B5563]">
                      {data.rtRwZone}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-black">
                    {isShift ? data.title : data.fullName}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-[#4B5563]">
                    <ShieldCheck
                      className="h-3.5 w-3.5 shrink-0 text-[#006C49]"
                      aria-hidden="true"
                    />
                    <span>{data.rtVerifierName}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-display text-xl font-extrabold text-black tabular-nums">
                    {formatRupiah(totalWage)}
                  </p>
                  <p className="text-xs font-medium text-[#006C49]">
                    Upah Sudah Cair
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
