import React from 'react';
import { ShieldCheck, Store, UserCheck, Zap } from 'lucide-react';
import { UserRoleMode } from '../types/dispatch';

interface RoleHeroPanelProps {
  roleMode: UserRoleMode;
  onChangeRole: (role: UserRoleMode) => void;
  onInstantDispatch: () => void;
  fastestEtaMinutes: number | null;
  openCount: number;
  hasFastMatch: boolean;
}

export const RoleHeroPanel: React.FC<RoleHeroPanelProps> = ({
  roleMode,
  onChangeRole,
  onInstantDispatch,
  fastestEtaMinutes,
  openCount,
  hasFastMatch,
}) => {
  const isWorker = roleMode === 'WORKER';

  return (
    <section className="nb-card p-5 sm:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          {/* Role Toggle Segmented Control */}
          <div
            role="group"
            aria-label="Pilih peran Anda"
            className="inline-flex w-full sm:w-auto rounded border-2 border-black bg-[#F3F3F3] p-1"
          >
            <button
              type="button"
              onClick={() => onChangeRole('WORKER')}
              aria-pressed={isWorker}
              className={`flex-1 sm:flex-initial inline-flex min-h-[48px] items-center justify-center gap-2 rounded px-4 py-2 font-display text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isWorker
                  ? 'border-2 border-black bg-[#2563EB] text-white shadow-[2px_2px_0px_#000000]'
                  : 'border-2 border-transparent text-black hover:bg-white'
              }`}
            >
              <UserCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              Cari Kerja
            </button>
            <button
              type="button"
              onClick={() => onChangeRole('MSME')}
              aria-pressed={!isWorker}
              className={`flex-1 sm:flex-initial inline-flex min-h-[48px] items-center justify-center gap-2 rounded px-4 py-2 font-display text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                !isWorker
                  ? 'border-2 border-black bg-[#2563EB] text-white shadow-[2px_2px_0px_#000000]'
                  : 'border-2 border-transparent text-black hover:bg-white'
              }`}
            >
              <Store className="h-4 w-4 shrink-0" aria-hidden="true" />
              Cari Tenaga UMKM
            </button>
          </div>

          <h1
            className="mt-5 font-display text-[28px] leading-[34px] font-extrabold tracking-tight text-black sm:text-[36px] sm:leading-[42px]"
            style={{ textWrap: 'balance' }}
          >
            {isWorker
              ? 'Kerja Harian Dekat Rumah, Upah Langsung Cair Hari Ini.'
              : 'Butuh Tenaga Bantu Warung Cepat? Warga Terverifikasi Siap Jalan.'}
          </h1>

          <p className="mt-3 text-base font-medium leading-6 text-[#4B5563]">
            {isWorker
              ? 'Pilih shift UMKM di sekitar RT/RW Anda tanpa ribet CV. Datang tepat waktu, selesaikan tugas 2–4 jam, upah langsung dibayar.'
              : 'Panggil warga standby yang sudah diverifikasi Ketua RT/RW setempat. Tiba di lokasi kurang dari 15 menit untuk bantu dapur atau angkut barang.'}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-black">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#006C49]">
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              Terverifikasi Ketua RT/RW
            </span>
            <span aria-hidden="true" className="text-[#4B5563]">
              ·
            </span>
            <span className="tabular-nums text-[#4B5563]">
              {openCount}{' '}
              {isWorker ? 'shift tersedia sekarang' : 'warga standby sekarang'}
            </span>
            {fastestEtaMinutes !== null && (
              <>
                <span aria-hidden="true" className="text-[#4B5563]">
                  ·
                </span>
                <span className="tabular-nums font-semibold text-black">
                  Tercepat {fastestEtaMinutes} menit
                </span>
              </>
            )}
          </div>
        </div>

        {/* Urgent Deterministic Instant Dispatch Quick Action */}
        <div className="flex flex-col gap-2 lg:min-w-[320px] lg:max-w-[360px]">
          <button
            type="button"
            onClick={onInstantDispatch}
            disabled={!hasFastMatch}
            className={`nb-btn flex min-h-[56px] w-full items-center justify-center gap-2.5 px-5 py-3.5 font-display text-base font-extrabold whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
              hasFastMatch
                ? 'bg-[#FACC15] text-black hover:bg-[#EAB308]'
                : 'bg-[#E5E7EB] text-[#4B5563] cursor-not-allowed opacity-80'
            }`}
          >
            <Zap className="h-5 w-5 shrink-0 fill-black" aria-hidden="true" />
            <span>
              {isWorker
                ? 'Ambil Shift Tercepat Sekarang!'
                : 'Dispatch Pekerja (<15 Menit)!'}
            </span>
          </button>
          <p className="text-center text-xs font-medium text-[#4B5563]">
            {hasFastMatch
              ? isWorker
                ? 'Otomatis kunci shift terdekat (<15 menit) tanpa antre lama.'
                : 'Otomatis kunci warga standby terdekat (<15 menit) ke warung Anda.'
              : 'Belum ada jadwal <15 menit yang terbuka saat ini.'}
          </p>
        </div>
      </div>
    </section>
  );
};
