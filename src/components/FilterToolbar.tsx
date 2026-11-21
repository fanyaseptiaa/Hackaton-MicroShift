import React from 'react';
import { ChevronDown, MapPin, RotateCcw } from 'lucide-react';
import { AREA_OPTIONS } from '../data/mockDispatchData';
import { AreaSlug, FilterChipKey } from '../types/dispatch';

interface FilterToolbarProps {
  selectedArea: AreaSlug;
  onChangeArea: (area: AreaSlug) => void;
  activeChips: FilterChipKey[];
  onToggleChip: (chip: FilterChipKey) => void;
  onResetFilters: () => void;
  resultCount: number;
}

const FILTER_CHIPS: { key: FilterChipKey; label: string }[] = [
  { key: 'FAST_ETA', label: 'Langsung Kerja (<15 Menit)' },
  { key: 'NEARBY', label: 'Terdekat (<2 km)' },
  { key: 'ANGKUT_BONGKAR', label: 'Angkut & Bongkar Muat' },
  { key: 'CUCI_DAPUR', label: 'Cuci Piring & Dapur' },
];

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  selectedArea,
  onChangeArea,
  activeChips,
  onToggleChip,
  onResetFilters,
  resultCount,
}) => {
  const hasActiveFilters = selectedArea !== 'all' || activeChips.length > 0;

  return (
    <section
      aria-label="Filter wilayah dan jenis pekerjaan"
      className="space-y-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Area Dropdown */}
        <div className="relative w-full sm:max-w-xs">
          <label htmlFor="area-zone-select" className="sr-only">
            Pilih Wilayah RT/RW
          </label>
          <MapPin
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black"
            aria-hidden="true"
          />
          <select
            id="area-zone-select"
            value={selectedArea}
            onChange={(e) => onChangeArea(e.target.value as AreaSlug)}
            className="nb-input min-h-[48px] w-full appearance-none pl-10 pr-10 font-display text-sm font-bold text-black cursor-pointer"
          >
            {AREA_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="font-display text-sm font-bold text-black tabular-nums">
            {resultCount} pilihan cocok
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded border-2 border-black bg-white px-3 py-1.5 font-display text-xs font-bold text-black hover:bg-[#F3F3F3] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div
        role="group"
        aria-label="Filter cepat"
        className="flex flex-wrap gap-2.5"
      >
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeChips.includes(chip.key);
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => onToggleChip(chip.key)}
              aria-pressed={isActive}
              className={`nb-chip min-h-[44px] px-3.5 py-2 font-display text-xs font-bold tracking-wide whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                isActive
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white text-black hover:bg-[#F3F3F3]'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
