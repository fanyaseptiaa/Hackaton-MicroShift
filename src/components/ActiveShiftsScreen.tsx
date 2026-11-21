import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { ShiftRecord, WorkerRecord } from '../types/dispatch';
import { formatRupiah } from '../utils/dispatchEngine';

interface ActiveShiftsScreenProps {
  confirmedShifts: ShiftRecord[];
  confirmedWorkers: WorkerRecord[];
  justConfirmedId: string | null;
  onCompleteShift: (id: string) => void;
  onCompleteWorker: (id: string) => void;
  onCancelShift: (id: string) => void;
  onCancelWorker: (id: string) => void;
  onBackToDispatch: () => void;
}

export const ActiveShiftsScreen: React.FC<ActiveShiftsScreenProps> = ({
  confirmedShifts,
  confirmedWorkers,
  justConfirmedId,
  onCompleteShift,
  onCompleteWorker,
  onCancelShift,
  onCancelWorker,
  onBackToDispatch,
}) => {
  const allActive = [
    ...confirmedShifts.map((s) => ({ kind: 'SHIFT' as const, data: s })),
    ...confirmedWorkers.map((w) => ({ kind: 'WORKER' as const, data: w })),
  ];

  return (
    <section aria-label="Daftar shift aktif" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-black sm:text-3xl">
            Shift &amp; Dispatch Aktif
          </h1>
          <p className="mt-1 text-sm font-medium text-[#4B5563]">
            Daftar tugas yang sudah terkunci dan terkonfirmasi. Tunjukkan kartu
            ini saat bertemu di lokasi.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToDispatch}
          className="nb-btn inline-flex min-h-[48px] items-center justify-center gap-2 bg-white px-4 py-2 font-display text-sm font-bold text-black hover:bg-[#F3F3F3] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          Cari Shift Lain
        </button>
      </div>

      {justConfirmedId && (
        <div
          role="status"
          className="nb-card flex items-start gap-3 bg-[#10B981] p-4 text-black"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-display font-extrabold">
              Shift Berhasil Dikonfirmasi!
            </p>
            <p className="mt-0.5 font-medium">
              Status sudah pindah ke aktif. Pastikan hadir tepat waktu sesuai
              panduan RT/RW di bawah ini ya.
            </p>
          </div>
        </div>
      )}

      {allActive.length === 0 ? (
        <div className="nb-card p-8 text-center">
          <h2 className="font-display text-xl font-bold text-black">
            Belum Ada Shift Aktif Saat Ini
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#4B5563]">
            Pilih shift atau panggil pekerja warga lokal dari halaman Beranda
            untuk mengunci jadwal kerja Anda.
          </p>
          <button
            type="button"
            onClick={onBackToDispatch}
            className="nb-btn mt-5 inline-flex min-h-[48px] items-center justify-center bg-[#2563EB] px-6 py-3 font-display text-sm font-bold text-white hover:bg-[#1D4ED8] cursor-pointer"
          >
            Buka Halaman Cari Shift
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {allActive.map(({ kind, data }) => {
            const isShift = kind === 'SHIFT';
            const totalWage = isShift
              ? data.wageIdr + (data.urgentBonusIdr ?? 0)
              : data.wageIdr;

            return (
              <article
                key={data.id}
                className="nb-card flex flex-col justify-between p-5"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded border-2 border-black bg-[#10B981] px-2.5 py-1 font-display text-xs font-extrabold text-black shadow-[2px_2px_0px_#000000]">
                      <CheckCircle2
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      TERKONFIRMASI · AKTIF
                    </span>
                    <span className="font-display text-xs font-bold text-[#4B5563]">
                      {data.lockCode ?? 'RT-AKTIF'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-extrabold text-black">
                        {isShift ? data.title : data.fullName}
                      </h2>
                      <p className="mt-0.5 text-sm font-semibold text-[#1B1B1B]">
                        {isShift
                          ? `${data.businessName} · ${data.ownerName}`
                          : data.specialtyTitle}
                      </p>
                    </div>
                    <p className="shrink-0 font-display text-xl font-extrabold text-black tabular-nums">
                      {formatRupiah(totalWage)}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-[#4B5563] tabular-nums">
                    <span>ETA {data.etaMinutes} menit</span>
                    <span aria-hidden="true">·</span>
                    <span>{data.distanceKm} km</span>
                    <span aria-hidden="true">·</span>
                    <span>Durasi {data.durationHours} jam</span>
                  </div>

                  <div className="mt-4 flex items-start gap-2 rounded border-2 border-black bg-[#F8F9FA] p-3 text-sm">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-display font-bold text-black">
                        {data.rtRwZone}
                      </p>
                      <p className="text-xs text-[#4B5563]">
                        {isShift ? data.addressHint : data.standbyPoint}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#006C49]">
                    <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      Terverifikasi oleh {data.rtVerifierName}. Upah cair
                      langsung setelah tugas beres.
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2.5 border-t-2 border-black pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      isShift
                        ? onCompleteShift(data.id)
                        : onCompleteWorker(data.id)
                    }
                    className="nb-btn flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-[#FACC15] px-4 py-2.5 font-display text-sm font-extrabold text-black hover:bg-[#EAB308] cursor-pointer"
                  >
                    <Wallet className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Selesaikan &amp; Cairkan Upah
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      isShift
                        ? onCancelShift(data.id)
                        : onCancelWorker(data.id)
                    }
                    className="nb-btn flex min-h-[48px] items-center justify-center bg-white px-4 py-2.5 font-display text-xs font-bold text-[#DC2626] hover:bg-[#FEE2E2] cursor-pointer"
                  >
                    Batalkan
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
