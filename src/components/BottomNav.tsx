import React from 'react';
import { Briefcase, CheckSquare, History } from 'lucide-react';
import { AppScreen } from '../types/dispatch';

interface BottomNavProps {
  activeScreen: AppScreen;
  onSelectScreen: (screen: AppScreen) => void;
  activeCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onSelectScreen,
  activeCount,
}) => {
  const tabs: {
    id: AppScreen;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'DISPATCH', label: 'Cari Shift', icon: Briefcase },
    {
      id: 'ACTIVE',
      label: 'Shift Aktif',
      icon: CheckSquare,
      badge: activeCount,
    },
    { id: 'HISTORY', label: 'Riwayat', icon: History },
  ];

  return (
    <nav
      aria-label="Navigasi bawah mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t-2 border-black bg-white"
    >
      <div className="grid h-16 grid-cols-3 items-center px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectScreen(tab.id)}
              className={`flex min-h-[48px] flex-col items-center justify-center rounded px-2 py-1 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
                isActive
                  ? 'bg-[#FACC15] border-2 border-black text-black'
                  : 'text-[#4B5563] hover:text-black'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="ml-1 rounded border border-black bg-[#10B981] px-1 text-[10px] font-bold leading-tight text-black tabular-nums">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5 font-display text-[11px] font-bold tracking-wide whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
