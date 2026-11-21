import React from 'react';
import { CheckCircle2, Clock, MapPin, ShieldCheck, X } from 'lucide-react';
import { ShiftRecord, WorkerRecord } from '../types/dispatch';
import { formatRupiah } from '../utils/dispatchEngine';

interface ShiftLockModalProps {
  item: ShiftRecord | WorkerRecord | null;
  usedFallbackArea: boolean;
  onConfirm: (item: ShiftRecord | WorkerRecord) => void;
  onCancel: (item: ShiftRecord | WorkerRecord) => void;
}

export const ShiftLockModal: React.FC<ShiftLockModalProps> = ({
  item,
  usedFallbackArea,
  onConfirm,
  onCancel,
}) => {
  if (!item) return null;

  const isShift = item.roleType === 'MSME_SHIFT';
  const totalWage = isShift
    ? item.wageIdr + (item.urgentBonusIdr ?? 0)
    : item.wageIdr;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shift-lock-modal-title"
    >
      <div className="nb-modal max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-lg rounded-b-none sm:rounded-lg">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b-2 border-black bg-[#FACC15] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 shrink-0 text-black" aria-hidden="true" />
            <span className="font-display text-sm font-extrabold text-black">
              Shift Terkunci (Pending) • Menunggu Konfirmasi
            </span>
          </div>
          <button
            type="button"
            onClick={() => onCancel(item)}
            aria-label="Tutup jendela konfirmasi"
            className="flex h-10 w-10 items-center justify-center rounded border-2 border-black bg-white text-black hover:bg-[#F3F3F3] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          {/* Fallback note if matched from closest neighboring zone */}
          {usedFallbackArea && (
            <div className="rounded border-2 border-black bg-[#DBE1FF] px-3.5 py-2.5 text-xs font-semibold text-black">
              Di wilayah pilihan belum ada yang di bawah 15 menit. Kami
              pilihkan yang paling dekat dari wilayah sebelah!
            </div>
          )}

          {/* Deterministic Lock Summary */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#4B5563]">
              <span>
                Kode Kunci: {item.lockCode ?? 'RT-LOCK-01'} · Antrean #1
              </span>
              <span className="inline-flex items-center gap-1 text-[#006C49]">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.rtVerifierName}
              </span>
            </div>

            <h2
              id="shift-lock-modal-title"
              className="mt-2 font-display text-2xl font-extrabold leading-7 text-black"
            >
              {isShift ? item.title : item.fullName}
            </h2>
            <p className="mt-1 text-sm font-semibold text-[#1B1B1B]">
              {isShift
                ? `${item.businessName} (${item.ownerName})`
                : item.specialtyTitle}
            </p>
          </div>

          {/* Key Numbers Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded border-2 border-black bg-[#F8F9FA] p-3">
              <p className="text-[11px] font-bold text-[#4B5563]">
                {isShift ? 'Total Upah' : 'Upah Shift'}
              </p>
              <p className="mt-1 font-display text-base font-extrabold text-black tabular-nums">
                {formatRupiah(totalWage)}
              </p>
            </div>
            <div className="rounded border-2 border-black bg-[#F8F9FA] p-3">
              <p className="text-[11px] font-bold text-[#4B5563]">
                Estimasi Tiba
              </p>
              <p className="mt-1 font-display text-base font-extrabold text-black tabular-nums">
                {item.etaMinutes} menit
              </p>
            </div>
            <div className="rounded border-2 border-black bg-[#F8F9FA] p-3">
              <p className="text-[11px] font-bold text-[#4B5563]">
                Durasi Kerja
              </p>
              <p className="mt-1 font-display text-base font-extrabold text-black tabular-nums">
                {item.durationHours} jam
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2.5 rounded border-2 border-black bg-white p-3.5">
            <MapPin
              className="mt-0.5 h-5 w-5 shrink-0 text-[#2563EB]"
              aria-hidden="true"
            />
            <div className="text-sm">
              <p className="font-display font-bold text-black">
                {item.rtRwZone} ({item.distanceKm} km)
              </p>
              <p className="mt-0.5 text-[#4B5563]">
                {isShift ? item.addressHint : item.standbyPoint}
              </p>
            </div>
          </div>

          {/* Panduan Singkat RT/RW */}
          <div className="rounded border-2 border-black bg-[#6CF8BB]/40 p-4">
            <h3 className="font-display text-sm font-extrabold text-black">
              Panduan Singkat RT/RW
            </h3>
            <p className="mt-1.5 text-sm font-semibold leading-5 text-black">
              Data terverifikasi Ketua RT setempat. Pastikan hadir tepat waktu
              ya, upah langsung cair setelah tugas beres!
            </p>
            <ol className="mt-3 space-y-1.5 text-xs font-medium text-[#1B1B1B]">
              {isShift ? (
                <>
                  <li>
                    1. Datang langsung ke alamat warung sesuai jam yang
                    disepakati.
                  </li>
                  <li>
                    2. Tunjukkan layar HP ini ke{' '}
                    <strong>{item.ownerName}</strong> saat tiba.
                  </li>
                  <li>
                    3. Selesaikan tugas dengan rapi, upah langsung dibayar tunai
                    atau QRIS.
                  </li>
                </>
              ) : (
                <>
                  <li>
                    1. Siapkan tugas atau perlengkapan kerja sebelum{' '}
                    <strong>{item.fullName}</strong> tiba.
                  </li>
                  <li>
                    2. Cocokkan layar konfirmasi ini saat pekerja datang di
                    warung Anda.
                  </li>
                  <li>
                    3. Bayar upah penuh langsung setelah tugas selesai dikerjakan.
                  </li>
                </>
              )}
            </ol>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-1 sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => onConfirm(item)}
              className="nb-btn flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-[#2563EB] px-5 py-3 font-display text-base font-extrabold text-white hover:bg-[#1D4ED8] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
              Konfirmasi Shift
            </button>
            <button
              type="button"
              onClick={() => onCancel(item)}
              className="nb-btn flex min-h-[48px] items-center justify-center bg-white px-4 py-3 font-display text-sm font-bold text-black hover:bg-[#F3F3F3] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Batal &amp; Lepas Kunci
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
