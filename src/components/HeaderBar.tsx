import React from 'react';
import { AppScreen } from '../types/dispatch';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderBarProps {
  activeScreen: AppScreen;
  onSelectScreen: (screen: AppScreen) => void;
  activeCount: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeScreen,
  onSelectScreen,
  activeCount,
}) => {
  const navItems: { id: AppScreen; label: string }[] = [
    { id: 'DISPATCH', label: 'Cari Shift' },
    { id: 'ACTIVE', label: 'Shift Aktif' },
    { id: 'HISTORY', label: 'Riwayat' },
  ];

  const fallbackCta = (
    <button
      type="button"
      onClick={() => onSelectScreen(activeScreen === 'ACTIVE' ? 'DISPATCH' : 'ACTIVE')}
      className="nb-btn inline-flex min-h-[44px] items-center justify-center bg-[#2563EB] px-4 py-2 font-display text-sm font-bold text-white whitespace-nowrap shrink-0 hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer"
    >
      {activeScreen === 'ACTIVE' ? (
        'Cari Shift'
      ) : (
        <span className="tabular-nums">Shift Aktif ({activeCount})</span>
      )}
    </button>
  );

  return (
    <header className="border-b-2 border-black bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onSelectScreen('DISPATCH')}
          className="font-display text-xl font-extrabold tracking-tight text-black whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          MicroShift
        </button>

        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-6"
        >
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectScreen(item.id)}
                className={`font-display text-sm font-bold whitespace-nowrap shrink-0 py-1 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                  isActive
                    ? 'text-[#2563EB] underline decoration-2 underline-offset-8'
                    : 'text-[#4B5563] hover:text-black hover:underline hover:decoration-2 hover:underline-offset-8'
                }`}
              >
                {item.label}
                {item.id === 'ACTIVE' && activeCount > 0 ? (
                  <span className="ml-1 tabular-nums">({activeCount})</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <PWAInstallButton fallbackAction={fallbackCta} />
        </div>
      </div>
    </header>
  );
};
