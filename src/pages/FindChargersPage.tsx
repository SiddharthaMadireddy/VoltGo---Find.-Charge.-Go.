import { useMemo, useState } from 'react';
import { useApp } from '@/store/app';
import { DashboardShell } from '@/components/DashboardShell';
import { PublicShell } from '@/components/PublicShell';
import {
  STATIONS, CITIES, ChargingStation, stationAvailableCount, stationMaxPower, stationMinPrice, stationConnectors,
} from '@/data/stations';
import {
  Search, Navigation2, Star, MapPin, SlidersHorizontal, Zap, X, Plug,
  LocateFixed, ChevronRight,
} from 'lucide-react';
import {
  StationCard, StatusBadge, StatusDot,
} from '@/components/ui';
import { StationDetailsModal } from '@/components/StationDetailsModal';
import { ConnectorIcon } from '@/components/ui';

type FilterKey = 'all' | 'available' | 'fast' | 'dc' | 'ac' | 'free' | '247';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'fast', label: 'Fast Charging' },
  { key: 'dc', label: 'DC Fast' },
  { key: 'ac', label: 'AC Charging' },
  { key: 'free', label: 'Free' },
  { key: '247', label: 'Open 24/7' },
];

export function FindChargersPage() {
  const { favorites, user } = useApp();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [connectorFilter, setConnectorFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<ChargingStation | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return STATIONS.filter((s) => {
      if (city !== 'All Cities' && s.city !== city) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.area.toLowerCase().includes(q) && !s.city.toLowerCase().includes(q)) return false;
      }
      if (filter === 'available' && s.status !== 'available') return false;
      if (filter === 'fast' && !s.fastCharging) return false;
      if (filter === 'dc' && !s.chargers.some((c) => c.current === 'DC')) return false;
      if (filter === 'ac' && !s.chargers.some((c) => c.current === 'AC')) return false;
      if (filter === 'free' && !s.freeCharging) return false;
      if (filter === '247' && !s.open247) return false;
      if (connectorFilter && !stationConnectors(s).includes(connectorFilter as any)) return false;
      return true;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [query, city, filter, connectorFilter]);

  function focusStation(s: ChargingStation) {
    setFocusedId(s.id);
    setSelected(s);
  }

  const Wrapper = (props: any) => user ? <DashboardShell {...props} /> : <PublicShell {...props} />;

  return (
    <Wrapper title="Find Chargers">
      <div className={user ? '' : 'container-x py-8'}>
        {/* Mobile: map first, then list. Desktop: list left, map right. */}
      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        {/* LEFT: search + filters + list */}
        <div className="flex flex-col gap-4 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-1 scrollbar-thin">
          {/* Search */}
          <div className="card-pad">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input pl-11"
                placeholder="Search charging stations"
              />
            </div>
            <div className="mt-3 flex gap-2">
              <select value={city} onChange={(e) => setCity(e.target.value)} className="input flex-1 py-2.5 text-sm">
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className="btn-ghost btn-sm"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="card-pad">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`chip px-3 py-1.5 text-xs ${
                    filter === f.key ? 'bg-volt-500 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {showFilters && (
              <div className="mt-3 border-t border-ink-200 pt-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-500">Connector</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setConnectorFilter(null)}
                    className={`chip px-3 py-1.5 text-xs ${!connectorFilter ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600'}`}
                  >
                    Any
                  </button>
                  {['CCS2', 'Type 2', 'CHAdeMO', 'GB/T'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setConnectorFilter(c)}
                      className={`chip px-3 py-1.5 text-xs ${connectorFilter === c ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-semibold text-ink-700">{filtered.length} stations</p>
            <button
              onClick={() => { setQuery(''); setCity('All Cities'); setFilter('all'); setConnectorFilter(null); }}
              className="text-xs font-semibold text-volt-600 hover:underline"
            >
              Clear all
            </button>
          </div>

          {/* Station list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="card-pad text-center text-sm text-ink-500">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-ink-300" />
                No stations match your filters.
              </div>
            ) : (
              filtered.map((s) => (
                <StationListRow
                  key={s.id}
                  station={s}
                  highlighted={focusedId === s.id}
                  onClick={() => focusStation(s)}
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT: map (desktop) */}
        <div className="hidden lg:block">
          <ChargerMap stations={filtered} focusedId={focusedId} onSelect={focusStation} favorites={favorites} />
        </div>

        {/* Mobile map — shown first on mobile, after list on desktop via flex order */}
        <div className="order-first lg:hidden">
          <ChargerMap stations={filtered} focusedId={focusedId} onSelect={focusStation} favorites={favorites} mobile />
        </div>
      </div>

      {selected && <StationDetailsModal station={selected} onClose={() => setSelected(null)} />}
      </div>
    </Wrapper>
  );
}

function StationListRow({ station, onClick, highlighted }: { station: ChargingStation; onClick: () => void; highlighted?: boolean }) {
  const avail = stationAvailableCount(station);
  const total = station.chargers.length;
  const price = stationMinPrice(station);
  const maxPower = stationMaxPower(station);
  return (
    <button
      onClick={onClick}
      className={`card w-full p-4 text-left transition-all ${
        highlighted ? 'ring-2 ring-volt-500 shadow-glow' : 'hover:-translate-y-0.5 hover:shadow-card'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate font-display text-[15px] font-bold text-ink-900">{station.name}</h4>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
            <MapPin className="h-3 w-3" /> {station.area} · {station.distanceKm} km
          </p>
        </div>
        <span className="chip-base shrink-0 px-2 py-1 text-[11px]">
          <Star className="h-3 w-3 fill-amberx-500 text-amberx-500" />{station.rating}
        </span>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <StatusBadge station={station} size="xs" />
        <span className="chip-base px-2 py-1 text-[11px]"><Zap className="h-3 w-3 text-spark-500" />{maxPower} kW</span>
        <span className="text-[11px] font-semibold text-ink-500">{avail}/{total} free</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex gap-1">
          {stationConnectors(station).map((c) => (
            <span key={c} className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink-600">{c}</span>
          ))}
        </div>
        <span className="font-display text-sm font-bold text-ink-900">{price === 0 ? 'Free' : `₹${price}/kWh`}</span>
      </div>
    </button>
  );
}

function ChargerMap({
  stations, focusedId, onSelect, favorites, mobile = false,
}: {
  stations: ChargingStation[];
  focusedId: string | null;
  onSelect: (s: ChargingStation) => void;
  favorites: string[];
  mobile?: boolean;
}) {
  const { toast } = useApp();
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-spark-50 ring-1 ring-ink-200 shadow-card grid-map ${mobile ? 'h-72' : 'sticky top-24 h-[calc(100vh-9rem)]'}`}>
      {/* Decorative roads */}
      <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M0,30 Q50,20 100,35" stroke="white" strokeWidth="3" fill="none" />
        <path d="M0,30 Q50,20 100,35" stroke="#86d4ff" strokeWidth="0.5" fill="none" strokeDasharray="1.5 2" />
        <path d="M20,0 Q30,50 25,100" stroke="white" strokeWidth="2" fill="none" />
        <path d="M70,0 Q60,60 80,100" stroke="white" strokeWidth="2" fill="none" />
        <path d="M0,70 L100,65" stroke="white" strokeWidth="1.8" fill="none" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-spark-100/30 via-transparent to-volt-100/20" />

      {/* Water/park decoration */}
      <div className="absolute right-[5%] top-[8%] h-24 w-32 rounded-3xl bg-spark-200/40" />
      <div className="absolute left-[8%] bottom-[12%] h-20 w-28 rounded-full bg-volt-200/30" />

      {/* Markers */}
      {stations.map((s) => (
        <MapMarker key={s.id} station={s} focused={focusedId === s.id} fav={favorites.includes(s.id)} onSelect={() => onSelect(s)} />
      ))}

      {/* Map controls */}
      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <button
          onClick={() => toast('Locating…', 'Centering the map on your location.', 'info')}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink-700 shadow-card ring-1 ring-ink-200 hover:bg-ink-50"
          title="Use My Location"
        >
          <LocateFixed className="h-5 w-5 text-spark-600" />
        </button>
        <button
          onClick={() => toast('Map zoomed in', '', 'info')}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink-700 shadow-card ring-1 ring-ink-200 hover:bg-ink-50"
        >
          <span className="text-lg font-bold">+</span>
        </button>
        <button
          onClick={() => toast('Map zoomed out', '', 'info')}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink-700 shadow-card ring-1 ring-ink-200 hover:bg-ink-50"
        >
          <span className="text-lg font-bold">−</span>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-2.5 backdrop-blur ring-1 ring-ink-200">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-400">Status</p>
        <div className="space-y-1">
          <LegendItem color="bg-volt-500" label="Available" />
          <LegendItem color="bg-amberx-500" label="Limited" />
          <LegendItem color="bg-rosex-500" label="Occupied" />
          <LegendItem color="bg-ink-400" label="Offline" />
        </div>
      </div>

      {/* Use my location pill */}
      <button
        onClick={() => toast('Locating…', 'Centering the map on your location.', 'info')}
        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-ink-700 shadow-card ring-1 ring-ink-200 hover:bg-ink-50"
      >
        <Navigation2 className="h-4 w-4 text-spark-600" /> Use My Location
      </button>

      {stations.length === 0 && (
        <div className="absolute inset-0 grid place-items-center">
          <p className="rounded-xl bg-white/90 px-4 py-2 text-sm text-ink-500">No stations to display</p>
        </div>
      )}
    </div>
  );
}

function MapMarker({ station, focused, fav, onSelect }: { station: ChargingStation; focused: boolean; fav: boolean; onSelect: () => void }) {
  const colors: Record<ChargingStation['status'], string> = {
    available: 'bg-volt-500',
    limited: 'bg-amberx-500',
    occupied: 'bg-rosex-500',
    offline: 'bg-ink-400',
  };
  return (
    <button
      onClick={onSelect}
      className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-110"
      style={{ left: `${station.lng}%`, top: `${station.lat}%` }}
    >
      <div className="relative flex flex-col items-center">
        {focused && (
          <div className="mb-1 whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1 text-[10px] font-bold text-white shadow-card">
            {station.name.replace('VoltGo ', '')}
          </div>
        )}
        <div className={`relative grid h-8 w-8 place-items-center rounded-full ${colors[station.status]} text-white shadow-card ring-2 ring-white ${focused ? 'scale-125' : ''}`}>
          {station.status === 'available' && <span className={`absolute -inset-1 animate-pulse-ring rounded-full ${colors[station.status]}`} />}
          <Plug className="h-4 w-4" />
          {fav && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-rosex-500 ring-2 ring-white" />}
        </div>
        <div className={`-mt-1 h-2.5 w-2.5 rotate-45 ${colors[station.status]} ring-2 ring-white`} />
      </div>
    </button>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-[11px] font-semibold text-ink-600">{label}</span>
    </div>
  );
}
