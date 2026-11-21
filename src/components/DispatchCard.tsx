import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { CATEGORY_LABELS } from '../data/mockDispatchData';
import { ShiftRecord, WorkerRecord } from '../types/dispatch';
import { formatRupiah } from '../utils/dispatchEngine';

interface DispatchCardProps {
  item: ShiftRecord | WorkerRecord;
  onSelect: (item: ShiftRecord | WorkerRecord) => void;
}

export const DispatchCard: React.FC<DispatchCardProps> = ({
  item,
  onSelect,
}) => {
  const isShift = item.roleType === 'MSME_SHIFT';
  const title = isShift ? item.title : item.fullName;
  const subtitle = isShift ? item.businessName : item.specialtyTitle;
  const locationText = isShift ? item.addressHint : item.standbyPoint;
  const isFastEta = item.etaMinutes < 15;
  const isLockedPending = item.queueStatus === 'LOCKED_PENDING';

  return (
    <article className="nb-card flex flex-col justify-between p-4 sm:p-5">
      <div>
        {/* Header: Title + Wage */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold leading-6 text-black">
              {title}
            </h3>
            <p className="mt-0.5 text-sm font-semibold text-[#1B1B1B]">
              {subtitle}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-xl font-extrabold leading-6 text-black tabular-nums">
              {formatRupiah(item.wageIdr)}
            </p>
            {isShift && item.urgentBonusIdr ? (
              <p className="mt-0.5 text-xs font-bold text-[#006C49] tabular-nums">
                +{formatRupiah(item.urgentBonusIdr)} bonus
              </p>
            ) : (
              <p className="mt-0.5 text-xs font-medium text-[#4B5563] tabular-nums">
                per {item.durationHours} jam
              </p>
            )}
          </div>
        </div>

        {/* Unboxed Metadata Line */}
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-[#4B5563] tabular-nums">
          <span className="font-semibold text-black">{item.etaMinutes} menit</span>
          <span aria-hidden="true">·</span>
          <span>{item.distanceKm} km</span>
          <span aria-hidden="true">·</span>
          <span>{item.durationHours} jam</span>
          <span aria-hidden="true">·</span>
          <span>{item.rtRwZone}</span>
        </div>

        <p className="mt-2 text-xs font-medium text-[#4B5563]">
          {locationText}
        </p>

        <p className="mt-3 text-sm leading-5 text-[#1B1B1B]">
          {item.notesSimple}
        </p>
      </div>

      {/* Footer: Verification + CTA */}
      <div className="mt-5 border-t-2 border-black pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {item.isRtRwVerified && (
              <span className="inline-flex items-center gap-1 rounded border-2 border-black bg-[#10B981] px-2 py-0.5 font-display font-bold text-black shadow-[2px_2px_0px_#000000]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Terverifikasi RT/RW
              </span>
            )}
            {isFastEta && (
              <span className="rounded border-2 border-black bg-[#FACC15] px-2 py-0.5 font-display font-bold text-black shadow-[2px_2px_0px_#000000]">
                &lt;15 Menit
              </span>
            )}
          </div>
          <span className="font-medium text-[#4B5563]">
            {CATEGORY_LABELS[item.category]}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(item)}
          className="nb-btn mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 bg-[#2563EB] px-4 py-2.5 font-display text-sm font-bold text-white hover:bg-[#1D4ED8] whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <span>
            {isLockedPending
              ? 'Lanjutkan Konfirmasi'
              : isShift
                ? 'Ambil Shift Ini'
                : 'Panggil Pekerja Ini'}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
