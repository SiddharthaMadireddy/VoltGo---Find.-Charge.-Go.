import { ReactNode } from 'react';
import { Star, MapPin, Clock, Zap, Plug } from 'lucide-react';
import {
  ChargingStation, stationAvailableCount, stationOccupiedCount, stationOfflineCount,
  stationMinPrice, stationMaxPower, statusLabel, AMENITIES, AmenityKey,
} from '@/data/stations';
import { useApp } from '@/store/app';
import { Heart, Navigation2 } from 'lucide-react';

export function StatusDot({ status }: { status: ChargingStation['status'] }) {
  const map: Record<ChargingStation['status'], string> = {
    available: 'bg-volt-500',
    limited: 'bg-amberx-500',
    occupied: 'bg-rosex-500',
    offline: 'bg-ink-400',
  };
  return (
    <span className="relative flex h-2.5 w-2.5">
      {status === 'available' && (
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-volt-500" />
      )}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${map[status]}`} />
    </span>
  );
}

export function StatusBadge({ station, size = 'sm' }: { station: ChargingStation; size?: 'sm' | 'xs' }) {
  const styles: Record<ChargingStation['status'], string> = {
    available: 'chip-volt',
    limited: 'chip-amber',
    occupied: 'chip-rose',
    offline: 'chip-gray',
  };
  const label: Record<ChargingStation['status'], string> = {
    available: 'Available',
    limited: 'Limited',
    occupied: 'Full',
    offline: 'Offline',
  };
  return (
    <span className={`${styles[station.status]} ${size === 'xs' ? 'px-2 py-0.5 text-[10px]' : ''}`}>
      <StatusDot status={station.status} />
      {label[station.status]}
    </span>
  );
}

export function ChargerStatusBadge({ status }: { status: 'available' | 'occupied' | 'offline' }) {
  const map = {
    available: { cls: 'chip-volt', label: 'Available' },
    occupied: { cls: 'chip-rose', label: 'Occupied' },
    offline: { cls: 'chip-gray', label: 'Offline' },
  } as const;
  return <span className={map[status].cls}>{map[status].label}</span>;
}

export function ConnectorIcon({ type, className = 'h-5 w-5' }: { type: string; className?: string }) {
  // Stylised connector glyphs
  if (type === 'CCS2')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="4" y="3" width="16" height="14" rx="3" />
        <circle cx="9" cy="8" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="8" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
        <line x1="9" y1="17" x2="9" y2="21" />
        <line x1="15" y1="17" x2="15" y2="21" />
      </svg>
    );
  if (type === 'Type 2')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="10" r="7" />
        <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
        <circle cx="9.5" cy="11" r="1" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="11" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="13" r="1" fill="currentColor" stroke="none" />
        <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" />
      </svg>
    );
  if (type === 'CHAdeMO')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="10" r="7" />
        <path d="M9 7.5a3 3 0 0 0 0 5M15 7.5a3 3 0 0 1 0 5" />
        <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" />
      </svg>
    );
  // GB/T
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="3" width="16" height="14" rx="3" />
      <path d="M8 8h8M8 12h8" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" />
    </svg>
  );
}

export function AmenityRow({ amenities, compact = false }: { amenities: AmenityKey[]; compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {amenities.map((a) => {
        const meta = AMENITIES[a];
        return (
          <span
            key={a}
            className={`chip-base ${compact ? 'px-2 py-1 text-[11px]' : ''}`}
            title={meta.label}
          >
            <span aria-hidden>{meta.emoji}</span>
            {compact ? '' : meta.label}
          </span>
        );
      })}
    </div>
  );
}

export function StationCard({ station, onClick }: { station: ChargingStation; onClick?: () => void }) {
  const { favorites, toggleFavorite } = useApp();
  const fav = favorites.includes(station.id);
  const avail = stationAvailableCount(station);
  const total = station.chargers.length;
  const price = stationMinPrice(station);
  const maxPower = stationMaxPower(station);

  return (
    <button
      onClick={onClick}
      className="card group w-full overflow-hidden p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow hover:ring-volt-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate font-display text-[15px] font-bold text-ink-900">{station.name}</h4>
            {station.open247 && <span className="chip-spark px-2 py-0.5 text-[10px]">24/7</span>}
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
            <MapPin className="h-3.5 w-3.5" /> {station.area}, {station.city} · {station.distanceKm} km
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="chip-base px-2 py-1 text-[11px]">
            <Star className="h-3 w-3 fill-amberx-500 text-amberx-500" />
            {station.rating}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(station.id); }}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-rosex-500"
            aria-label="Favorite"
          >
            <Heart className={`h-4 w-4 ${fav ? 'fill-rosex-500 text-rosex-500' : ''}`} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge station={station} />
        <span className="chip-base px-2 py-1 text-[11px]">
          <Zap className="h-3 w-3 text-spark-500" />
          {maxPower} kW max
        </span>
        {station.freeCharging && <span className="chip-volt px-2 py-1 text-[11px]">Free</span>}
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium text-ink-400">{avail} of {total} available</p>
          <div className="mt-1 flex gap-1">
            {station.chargers.map((c) => (
              <span
                key={c.id}
                className={`h-1.5 w-5 rounded-full ${
                  c.status === 'available' ? 'bg-volt-500'
                  : c.status === 'occupied' ? 'bg-rosex-500'
                  : 'bg-ink-200'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-ink-400">from</p>
          <p className="font-display text-base font-bold text-ink-900">
            {price === 0 ? 'Free' : `₹${price}/kWh`}
          </p>
        </div>
      </div>
    </button>
  );
}

export function StationSkeletonCard() {
  return (
    <div className="card-pad flex flex-col justify-between text-left ring-1 ring-ink-200 bg-white animate-pulse h-full">
      <div>
        <div className="flex items-start justify-between">
          <div className="h-5 w-1/2 rounded bg-ink-200"></div>
          <div className="h-6 w-6 rounded bg-ink-200"></div>
        </div>
        <div className="mt-2 h-3 w-3/4 rounded bg-ink-200"></div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-16 rounded-full bg-ink-200"></div>
        <div className="h-5 w-16 rounded-full bg-ink-200"></div>
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="h-3 w-20 rounded bg-ink-200"></div>
          <div className="mt-2 flex gap-1">
            <div className="h-1.5 w-5 rounded-full bg-ink-200"></div>
            <div className="h-1.5 w-5 rounded-full bg-ink-200"></div>
            <div className="h-1.5 w-5 rounded-full bg-ink-200"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-3 w-8 ml-auto rounded bg-ink-200"></div>
          <div className="mt-1 h-5 w-16 rounded bg-ink-200"></div>
        </div>
      </div>
    </div>
  );
}

export function StatCard({
  label, value, icon, accent = 'volt', sub,
}: { label: string; value: ReactNode; icon: ReactNode; accent?: 'volt' | 'spark' | 'amber' | 'rose'; sub?: string }) {
  const accents = {
    volt: 'from-volt-500/15 to-volt-500/5 text-volt-600',
    spark: 'from-spark-500/15 to-spark-500/5 text-spark-600',
    amber: 'from-amberx-500/15 to-amberx-500/5 text-amberx-600',
    rose: 'from-rosex-500/15 to-rosex-500/5 text-rosex-600',
  } as const;
  return (
    <div className="card-pad flex items-center gap-4">
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${accents[accent]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-ink-500">{label}</p>
        <p className="font-display text-2xl font-bold text-ink-900">{value}</p>
        {sub && <p className="text-[11px] text-ink-400">{sub}</p>}
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow, title, desc, center,
}: { eyebrow?: string; title: string; desc?: string; center?: boolean }) {
  return (
    <div className={`${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      {eyebrow && (
        <span className="chip-volt mb-3 text-[11px] uppercase tracking-wider">{eyebrow}</span>
      )}
      <h2 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl text-balance">{title}</h2>
      {desc && <p className="mt-3 text-base text-ink-500 text-balance">{desc}</p>}
    </div>
  );
}

export function PowerBar({ value, max = 350 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-spark-400 to-volt-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function HoursInfo({ station }: { station: ChargingStation }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-500">
      <Clock className="h-3.5 w-3.5" />
      {station.hours}
    </span>
  );
}

export function ChargerCountSummary({ station }: { station: ChargingStation }) {
  const avail = stationAvailableCount(station);
  const occ = stationOccupiedCount(station);
  const off = stationOfflineCount(station);
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="rounded-xl bg-volt-50 p-2.5">
        <p className="font-display text-xl font-bold text-volt-700">{avail}</p>
        <p className="text-[10px] font-semibold uppercase text-volt-600">Available</p>
      </div>
      <div className="rounded-xl bg-rose-50 p-2.5">
        <p className="font-display text-xl font-bold text-rosex-600">{occ}</p>
        <p className="text-[10px] font-semibold uppercase text-rosex-600">Occupied</p>
      </div>
      <div className="rounded-xl bg-ink-100 p-2.5">
        <p className="font-display text-xl font-bold text-ink-500">{off}</p>
        <p className="text-[10px] font-semibold uppercase text-ink-500">Offline</p>
      </div>
    </div>
  );
}

export function MiniMap({ station, className = '' }: { station: ChargingStation; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-spark-50 grid-map ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-spark-100/40 via-transparent to-volt-100/30" />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${station.lng}%`, top: `${station.lat}%` }}
      >
        <div className="relative">
          <span className="absolute -inset-3 animate-pulse-ring rounded-full bg-volt-500/40" />
          <span className="relative grid h-7 w-7 place-items-center rounded-full bg-volt-500 text-white shadow-glow">
            <Plug className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 backdrop-blur">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-700">
          <Navigation2 className="h-3.5 w-3.5 text-spark-500" /> {station.distanceKm} km away
        </span>
        <span className="text-xs text-ink-400">{station.area}</span>
      </div>
    </div>
  );
}
