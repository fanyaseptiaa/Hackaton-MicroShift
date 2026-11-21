import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b-2 border-black bg-[#FACC15] px-4 py-2 text-xs font-semibold text-black"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2">
        <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          Sedang offline — data shift tersimpan di HP tetap bisa dilihat.
        </span>
      </div>
    </div>
  );
};
