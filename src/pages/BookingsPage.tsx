import { useApp } from '@/store/app';
import { DashboardShell } from '@/components/DashboardShell';
import { CalendarClock, MapPin, Clock, QrCode, X, CheckCircle2, Plus, Car } from 'lucide-react';
import { useState } from 'react';

export function BookingsPage() {
  const { bookings, navigate } = useApp();
  const [showQrFor, setShowQrFor] = useState<string | null>(null);
  
  const upcoming = bookings.filter((b) => b.status === 'upcoming');
  const past = bookings.filter((b) => b.status !== 'upcoming');

  return (
    <DashboardShell title="My Bookings">
      {upcoming.length === 0 && past.length === 0 ? (
        <EmptyState onClick={() => navigate('find')} />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-ink-900">Upcoming</h3>
              <div className="grid gap-4 lg:grid-cols-2">
                {upcoming.map((b) => (
                  <BookingCard key={b.id} booking={b} upcoming onShowQr={setShowQrFor} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 font-display text-lg font-bold text-ink-900">Past bookings</h3>
              <div className="grid gap-4 lg:grid-cols-2">
                {past.map((b) => (
                  <BookingCard key={b.id} booking={b} onShowQr={setShowQrFor} />
                ))}
              </div>
            </div>
          )}
          <div className="mt-8 text-center">
            <button onClick={() => navigate('find')} className="btn-primary">
              <Plus className="h-4 w-4" /> Book another charger
            </button>
          </div>
        </>
      )}
      
      {showQrFor && (
        <QrModal bookingId={showQrFor} onClose={() => setShowQrFor(null)} />
      )}
    </DashboardShell>
  );
}

function BookingCard({ booking, upcoming, onShowQr }: { booking: ReturnType<typeof useApp>['bookings'][number]; upcoming?: boolean; onShowQr: (id: string) => void }) {
  const { cancelBooking } = useApp();
  
  return (
    <div className="card overflow-hidden p-0">
      <div className={`flex items-center justify-between px-5 py-3 ${upcoming ? 'bg-volt-50' : 'bg-ink-50'}`}>
        <span className={`chip ${upcoming ? 'chip-volt' : 'chip-gray'} text-[11px]`}>
          {upcoming ? <CheckCircle2 className="h-3 w-3" /> : <X className="h-3 w-3" />}
          {upcoming ? 'Confirmed' : 'Completed'}
        </span>
        <span className="font-mono text-xs font-bold text-ink-500">{booking.id}</span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-display text-base font-bold text-ink-900">{booking.stationName}</h4>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
              <Car className="h-3.5 w-3.5" /> {booking.chargerLabel}
            </p>
          </div>
          {upcoming && (
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-ink-900 p-1.5">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`h-1.5 w-1.5 rounded-[1px] ${(i * 3 + 7) % 4 < 2 ? 'bg-white' : 'bg-ink-700'}`} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-ink-50 p-2">
            <CalendarClock className="mx-auto h-4 w-4 text-ink-500" />
            <p className="mt-1 text-[11px] font-bold text-ink-900">{booking.date.split('·')[0].trim()}</p>
            <p className="text-[10px] text-ink-400">{booking.date.split('·')[1]?.trim()}</p>
          </div>
          <div className="rounded-lg bg-ink-50 p-2">
            <Clock className="mx-auto h-4 w-4 text-ink-500" />
            <p className="mt-1 text-[11px] font-bold text-ink-900">{booking.time}</p>
            <p className="text-[10px] text-ink-400">{booking.durationMin} min</p>
          </div>
          <div className="rounded-lg bg-ink-50 p-2">
            <span className="font-display text-sm font-bold text-volt-600">₹{booking.total}</span>
            <p className="text-[10px] text-ink-400">Total</p>
          </div>
        </div>
        {upcoming && (
          <div className="mt-4 flex gap-2">
            <button onClick={() => onShowQr(booking.id)} className="btn-ghost btn-sm flex-1"><QrCode className="h-4 w-4" /> Show QR</button>
            <button onClick={() => cancelBooking(booking.id)} className="btn-ghost btn-sm flex-1 text-rosex-600"><X className="h-4 w-4" /> Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

function QrModal({ bookingId, onClose }: { bookingId: string; onClose: () => void }) {
  const seedBase = bookingId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const cells = Array.from({ length: 49 }, (_, i) => (i * 7 + seedBase + 13) % 5 < 2);
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-map animate-slide-up">
        <div className="flex items-center justify-between border-b border-ink-200 p-5">
          <h2 className="font-display text-lg font-extrabold text-ink-900">Scan at Station</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-8 text-center">
          <div className="mx-auto grid h-48 w-48 place-items-center rounded-2xl bg-ink-900 p-4 shadow-xl">
            <div className="grid grid-cols-7 gap-1 w-full h-full">
              {cells.map((on, i) => (
                <div key={i} className={`rounded-[3px] ${on ? 'bg-white' : 'bg-ink-900'}`} />
              ))}
            </div>
          </div>
          <p className="mt-6 font-mono text-xs font-bold text-ink-500">BOOKING ID</p>
          <p className="font-display text-2xl font-extrabold text-ink-900">{bookingId}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClick }: { onClick: () => void }) {
  return (
    <div className="card-pad mx-auto max-w-md py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ink-100">
        <CalendarClock className="h-8 w-8 text-ink-400" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-ink-900">No bookings yet</h3>
      <p className="mt-1 text-sm text-ink-500">Find a charger and reserve your slot in seconds.</p>
      <button onClick={onClick} className="btn-primary mt-5"><Plus className="h-4 w-4" /> Find a charger</button>
    </div>
  );
}
