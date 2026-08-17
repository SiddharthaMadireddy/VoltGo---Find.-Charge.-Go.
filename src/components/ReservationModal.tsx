import { useEffect, useMemo, useState } from 'react';
import { ChargingStation } from '@/data/stations';
import { useApp } from '@/store/app';
import { X, Calendar, Clock, CheckCircle2, QrCode, Download, Car } from 'lucide-react';

const TIME_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '05:00 PM', '05:30 PM', '06:00 PM', '07:00 PM', '08:00 PM'];
const DURATIONS = [30, 45, 60, 90, 120];

function nextDays(n: number) {
  const out: string[] = [];
  const base = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }));
  }
  return out;
}

export function ReservationModal({
  station, defaultCharger, onClose,
}: { station: ChargingStation; defaultCharger?: string | null; onClose: () => void }) {
  const { addBooking, walletBalance, toast } = useApp();
  const availableChargers = station.chargers.filter((c) => c.status === 'available');
  const [charger, setCharger] = useState(defaultCharger ?? availableChargers[0]?.label ?? '');
  const [day, setDay] = useState(1);
  const [time, setTime] = useState(TIME_SLOTS[3]);
  const [duration, setDuration] = useState(45);
  const [confirmed, setConfirmed] = useState<null | { id: string; date: string }>(null);
  const [isBooking, setIsBooking] = useState(false);

  const days = useMemo(() => nextDays(7), []);
  const selectedCharger = station.chargers.find((c) => c.label === charger);
  const estEnergy = ((duration / 60) * (selectedCharger?.powerKw ?? 60) * 0.7).toFixed(1);
  const estCost = Math.round(Number(estEnergy) * (selectedCharger?.pricePerKwh ?? 18));
  const reservationFee = station.reservationFee;
  const total = estCost + reservationFee;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    // Body overflow is already managed by the parent StationDetailsModal
    return () => { window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  async function confirm() {
    if (total > walletBalance) {
      toast('Insufficient wallet balance', `You need ₹${total} but have ₹${walletBalance}. Add money to your wallet.`, 'error');
      return;
    }
    
    setIsBooking(true);
    await new Promise((r) => setTimeout(r, 1500));
    
    const id = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = `${day === 1 ? 'Tomorrow ·' : ''} ${days[day]}, 2026`;
    addBooking({
      id, stationId: station.id, stationName: station.name,
      chargerLabel: charger, date: dateStr, time, durationMin: duration,
      reservationFee, estimatedCost: estCost, total, status: 'upcoming',
    });
    
    setIsBooking(false);
    setConfirmed({ id, date: dateStr });
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-map animate-slide-up sm:rounded-3xl">
        {confirmed ? (
          <ConfirmedView
            id={confirmed.id}
            date={confirmed.date}
            time={time}
            duration={duration}
            station={station}
            charger={charger}
            total={total}
            onClose={onClose}
          />
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-ink-200 p-5">
              <div>
                <h2 className="font-display text-lg font-extrabold text-ink-900">Reserve a charger</h2>
                <p className="text-xs text-ink-500">{station.name}</p>
              </div>
              <button onClick={onClose} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
              {/* Charger */}
              <label className="label">Select charger</label>
              <div className="grid grid-cols-2 gap-2">
                {availableChargers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCharger(c.label)}
                    className={`rounded-xl border p-3 text-left text-sm transition ${
                      charger === c.label ? 'border-volt-500 bg-volt-50 ring-1 ring-volt-500' : 'border-ink-200 hover:bg-ink-50'
                    }`}
                  >
                    <p className="font-bold text-ink-900">{c.label}</p>
                    <p className="text-xs text-ink-500">{c.connector} · {c.powerKw} kW</p>
                  </button>
                ))}
              </div>

              {/* Date */}
              <label className="label mt-5">Select date</label>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {days.map((d, i) => (
                  <button
                    key={d}
                    onClick={() => setDay(i)}
                    className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      day === i ? 'border-volt-500 bg-volt-50 text-volt-700 ring-1 ring-volt-500' : 'border-ink-200 text-ink-600 hover:bg-ink-50'
                    }`}
                  >
                    {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d}
                  </button>
                ))}
              </div>

              {/* Time */}
              <label className="label mt-5">Select time</label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                      time === t ? 'border-volt-500 bg-volt-50 text-volt-700 ring-1 ring-volt-500' : 'border-ink-200 text-ink-600 hover:bg-ink-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Duration */}
              <label className="label mt-5">Estimated duration</label>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition ${
                      duration === d ? 'border-volt-500 bg-volt-50 text-volt-700 ring-1 ring-volt-500' : 'border-ink-200 text-ink-600 hover:bg-ink-50'
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-5 rounded-xl bg-ink-50 p-4">
                <h3 className="font-display text-sm font-bold text-ink-900">Payment summary</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <SumRow label={`Reservation fee`} value={`₹${reservationFee}`} />
                  <SumRow label={`Estimated charging (${estEnergy} kWh)`} value={`₹${estCost}`} />
                  <div className="h-px bg-ink-200" />
                  <SumRow label="Total estimated" value={`₹${total}`} bold />
                </div>
                <p className="mt-3 text-[11px] text-ink-400">
                  Estimated cost is based on charger power and duration. Final amount depends on actual energy consumed. Deducted from your wallet (balance ₹{walletBalance}).
                </p>
              </div>
            </div>

            <div className="border-t border-ink-200 p-5">
              <button onClick={confirm} disabled={isBooking} className="btn-primary w-full text-base">
                {isBooking ? (
                  <span className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Processing...</span>
                ) : (
                  <><Calendar className="h-4 w-4" /> Confirm Reservation</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SumRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'font-bold text-ink-900' : 'text-ink-500'}>{label}</span>
      <span className={bold ? 'font-display text-lg font-bold text-ink-900' : 'font-semibold text-ink-900'}>{value}</span>
    </div>
  );
}

function ConfirmedView({
  id, date, time, duration, station, charger, total, onClose,
}: {
  id: string; date: string; time: string; duration: number;
  station: ChargingStation; charger: string; total: number; onClose: () => void;
}) {
  const { navigate } = useApp();
  return (
    <div className="overflow-y-auto p-6 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-volt-50">
        <CheckCircle2 className="h-9 w-9 text-volt-500" />
      </div>
      <h2 className="mt-4 font-display text-xl font-extrabold text-ink-900">Reservation Confirmed</h2>
      <p className="mt-1 text-sm text-ink-500">Your charger has been reserved. Show the QR code at the station.</p>

      <div className="mx-auto mt-5 grid max-w-xs place-items-center rounded-2xl bg-white p-4 ring-1 ring-ink-200 shadow-card">
        <div className="grid h-40 w-40 place-items-center rounded-xl bg-ink-900 p-3">
          <QrPlaceholder />
        </div>
        <p className="mt-3 font-mono text-xs text-ink-500">Booking ID</p>
        <p className="font-display text-lg font-bold text-ink-900">{id}</p>
      </div>

      <div className="mt-5 space-y-2.5 text-left">
        <DetailRow icon={<Calendar className="h-4 w-4" />} label="Station" value={station.name} />
        <DetailRow icon={<Car className="h-4 w-4" />} label="Charger" value={charger} />
        <DetailRow icon={<Calendar className="h-4 w-4" />} label="Date" value={date} />
        <DetailRow icon={<Clock className="h-4 w-4" />} label="Time" value={`${time} · ${duration} min`} />
        <DetailRow icon={<CheckCircle2 className="h-4 w-4" />} label="Amount" value={`₹${total} paid via wallet`} />
      </div>

      <div className="mt-6 flex gap-2.5">
        <button onClick={() => { onClose(); navigate('bookings'); }} className="btn-primary flex-1">View bookings</button>
        <button onClick={onClose} className="btn-ghost flex-1">Done</button>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-ink-600 ring-1 ring-ink-200">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-ink-400">{label}</p>
        <p className="truncate text-sm font-bold text-ink-900">{value}</p>
      </div>
    </div>
  );
}

function QrPlaceholder() {
  // Simple decorative QR-like grid
  const cells = Array.from({ length: 49 }, (_, i) => {
    const seed = (i * 7 + 13) % 5;
    return seed < 2;
  });
  return (
    <div className="grid grid-cols-7 gap-0.5">
      {cells.map((on, i) => (
        <div key={i} className={`h-4 w-4 rounded-[2px] ${on ? 'bg-white' : 'bg-ink-900'}`} />
      ))}
    </div>
  );
}
