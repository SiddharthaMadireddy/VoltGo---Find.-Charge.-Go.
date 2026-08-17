import { useEffect } from 'react';
import {
  ChargingStation, stationAvailableCount, stationOccupiedCount, stationOfflineCount,
  stationMinPrice, AMENITIES,
} from '@/data/stations';
import { useApp } from '@/store/app';
import {
  X, Star, MapPin, Clock, Navigation2, Heart, Calendar, Zap, ShieldCheck,
  Plug, BatteryCharging, Info,
} from 'lucide-react';
import {
  StatusBadge, ConnectorIcon, AmenityRow, ChargerCountSummary, ChargerStatusBadge,
} from '@/components/ui';
import { useState } from 'react';
import { ReservationModal } from '@/components/ReservationModal';

export function StationDetailsModal({ station, onClose }: { station: ChargingStation; onClose: () => void }) {
  const { favorites, toggleFavorite, navigate, toast } = useApp();
  const [reservationCharger, setReservationCharger] = useState<string | null>(null);
  const [startingId, setStartingId] = useState<string | null>(null);
  const fav = favorites.includes(station.id);
  const avail = stationAvailableCount(station);
  const occ = stationOccupiedCount(station);
  const off = stationOfflineCount(station);
  const minPrice = stationMinPrice(station);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleStart = async (cLabel: string, cId: string) => {
    setStartingId(cId);
    await new Promise((r) => setTimeout(r, 1500));
    setStartingId(null);
    toast('Charging started', `${cLabel} · ${station.name}`, 'success');
    onClose();
  };

  return (
    <>
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-map animate-slide-up sm:rounded-3xl">
        {/* Header */}
        <div className="relative h-36 shrink-0 overflow-hidden bg-gradient-to-br from-spark-100 to-volt-100 grid-map sm:h-44">
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 to-transparent" />
          <button onClick={onClose} className="absolute right-3 top-3 rounded-xl bg-white/90 p-2 text-ink-700 backdrop-blur hover:bg-white">
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={() => toggleFavorite(station.id)}
            className="absolute left-3 top-3 rounded-xl bg-white/90 p-2 backdrop-blur hover:bg-white"
          >
            <Heart className={`h-5 w-5 ${fav ? 'fill-rosex-500 text-rosex-500' : 'text-ink-600'}`} />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2">
              <StatusBadge station={station} />
              {station.open247 && <span className="chip-spark px-2 py-0.5 text-[10px]">24/7</span>}
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-extrabold text-ink-900">{station.name}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                  <MapPin className="h-4 w-4" /> {station.address}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-bold text-amberx-600">
                  <Star className="h-3.5 w-3.5 fill-amberx-500 text-amberx-500" /> {station.rating}
                </span>
                <p className="mt-1 text-[11px] text-ink-400">{station.reviews} reviews</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-ink-50 p-3">
                <Navigation2 className="mx-auto h-4 w-4 text-spark-500" />
                <p className="mt-1 font-display text-base font-bold text-ink-900">{station.distanceKm} km</p>
                <p className="text-[10px] text-ink-400">Distance</p>
              </div>
              <div className="rounded-xl bg-ink-50 p-3">
                <Clock className="mx-auto h-4 w-4 text-ink-500" />
                <p className="mt-1 text-xs font-bold text-ink-900">{station.hours}</p>
                <p className="text-[10px] text-ink-400">Hours</p>
              </div>
              <div className="rounded-xl bg-ink-50 p-3">
                <Zap className="mx-auto h-4 w-4 text-volt-500" />
                <p className="mt-1 font-display text-base font-bold text-ink-900">{minPrice === 0 ? 'Free' : `₹${minPrice}`}</p>
                <p className="text-[10px] text-ink-400">/kWh from</p>
              </div>
            </div>

            {/* Availability */}
            <div className="mt-5">
              <h3 className="font-display text-sm font-bold text-ink-900">Availability</h3>
              <p className="text-xs text-ink-500">{avail} of {station.chargers.length} chargers available</p>
              <div className="mt-3"><ChargerCountSummary station={station} /></div>
            </div>

            {/* Chargers */}
            <div className="mt-5">
              <h3 className="font-display text-sm font-bold text-ink-900">Chargers at this station</h3>
              <div className="mt-3 space-y-2.5">
                {station.chargers.map((c) => (
                  <div key={c.id} className="rounded-xl border border-ink-200 p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-10 w-10 place-items-center rounded-lg ${
                          c.current === 'DC' ? 'bg-volt-50 text-volt-600' : 'bg-spark-50 text-spark-600'
                        }`}>
                          <ConnectorIcon type={c.connector} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-ink-900">{c.label}</p>
                          <p className="text-xs text-ink-500">{c.connector} · {c.current} · {c.powerKw} kW</p>
                        </div>
                      </div>
                      <ChargerStatusBadge status={c.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Est. {c.estMinutes[0]}–{c.estMinutes[1]} min
                      </span>
                      <span className="font-display text-sm font-bold text-ink-900">
                        {c.pricePerKwh === 0 ? 'Free' : `₹${c.pricePerKwh}/kWh`}
                      </span>
                    </div>
                    {c.status === 'available' && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => setReservationCharger(c.label)}
                          className="btn-soft btn-sm flex-1"
                        >
                          <Calendar className="h-3.5 w-3.5" /> Reserve
                        </button>
                        <button
                          onClick={() => handleStart(c.label, c.id)}
                          disabled={startingId === c.id}
                          className="btn-primary btn-sm flex-1"
                        >
                          {startingId === c.id ? (
                            <span className="flex items-center gap-1.5"><div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" /> Starting...</span>
                          ) : (
                            <><BatteryCharging className="h-3.5 w-3.5" /> Start</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-5">
              <h3 className="font-display text-sm font-bold text-ink-900">Amenities</h3>
              <div className="mt-3"><AmenityRow amenities={station.amenities} /></div>
            </div>

            {/* Pricing */}
            <div className="mt-5 rounded-xl bg-ink-50 p-4">
              <h3 className="font-display text-sm font-bold text-ink-900">Pricing</h3>
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Energy" value={minPrice === 0 ? 'Free' : `₹${minPrice}/kWh`} />
                <Row label="Parking" value={`₹${station.parkingFeePerHour}/hour`} />
                <Row label="Idle fee" value={`₹${station.idleFeePerMin}/min after charging ends`} />
                <Row label="Reservation" value={station.reservationFee === 0 ? 'Free' : `₹${station.reservationFee}`} />
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-[11px] text-ink-400">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Prices may vary by station and charger type. Idle fee applies after a 10-minute grace period.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <button 
                onClick={() => {
                  const firstAvail = station.chargers.find(c => c.status === 'available');
                  if (firstAvail) {
                    setReservationCharger(firstAvail.label);
                  } else {
                    toast('No chargers available', 'There are no available chargers at this station right now.', 'error');
                  }
                }} 
                className="btn-soft btn-sm"
              >
                <Calendar className="h-4 w-4" /> Reserve
              </button>
              <button onClick={() => { toast('Charging started', `${station.name} session active.`, 'success'); onClose(); }} className="btn-primary btn-sm">
                <BatteryCharging className="h-4 w-4" /> Start
              </button>
              <button onClick={() => toast('Directions opened', `Navigating to ${station.name}.`, 'info')} className="btn-ghost btn-sm">
                <Navigation2 className="h-4 w-4" /> Directions
              </button>
              <button onClick={() => toggleFavorite(station.id)} className="btn-ghost btn-sm">
                <Heart className={`h-4 w-4 ${fav ? 'fill-rosex-500 text-rosex-500' : ''}`} /> {fav ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
    {reservationCharger && (
      <ReservationModal
        station={station}
        defaultCharger={reservationCharger}
        onClose={() => setReservationCharger(null)}
      />
    )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  );
}
