import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  fallbackAction?: React.ReactNode;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  fallbackAction,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return <>{fallbackAction ?? null}</>;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="nb-btn inline-flex min-h-[44px] items-center gap-2 bg-[#2563EB] px-4 py-2 font-display text-sm font-bold text-white whitespace-nowrap shrink-0 hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer"
      >
        <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
        Pasang Aplikasi
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="nb-btn inline-flex min-h-[44px] items-center gap-2 bg-[#FACC15] px-4 py-2 font-display text-sm font-bold text-black whitespace-nowrap shrink-0 hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer"
        >
          <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
          Pasang di iPhone
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="nb-modal w-full max-w-sm p-6">
              <h3
                id="ios-install-title"
                className="font-display text-xl font-extrabold text-black"
              >
                Pasang MicroShift di Layar Utama
              </h3>
              <ol className="mt-3 space-y-2 text-sm text-[#1B1B1B]">
                <li>
                  1. Tekan tombol <strong>Bagikan (Share)</strong> di bagian
                  bawah Safari.
                </li>
                <li>
                  2. Geser ke bawah lalu pilih{' '}
                  <strong>Tambahkan ke Layar Utama</strong>.
                </li>
                <li>
                  3. Tekan <strong>Tambah</strong> agar bisa dibuka cepat
                  seperti aplikasi.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="nb-btn mt-5 w-full min-h-[48px] bg-[#2563EB] px-4 py-2 font-display text-sm font-bold text-white cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{fallbackAction ?? null}</>;
};
