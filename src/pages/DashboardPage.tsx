import { useMemo } from 'react';
import { useApp } from '@/store/app';
import { DashboardShell } from '@/components/DashboardShell';
import { StatCard, StationCard, SectionHeading } from '@/components/ui';
import {
  Wallet, CalendarClock, Zap, History, ArrowRight, Plus,
  MapPin, TrendingUp, BatteryCharging,
} from 'lucide-react';
import { STATIONS, stationAvailableCount } from '@/data/stations';

export function DashboardPage() {
  const { user, walletBalance, bookings, sessions, navigate, favorites } = useApp();
  const lastSession = sessions[0];
  const nearby = [...STATIONS].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
  const upcoming = bookings.find((b) => b.status === 'upcoming');

  const connectorUsage = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return [
        { label: 'CCS2', pct: 0, color: 'bg-volt-500' },
        { label: 'Type 2', pct: 0, color: 'bg-spark-500' },
        { label: 'CHAdeMO', pct: 0, color: 'bg-amberx-500' },
      ];
    }
    
    const counts = sessions.reduce((acc, s) => {
      acc[s.connector] = (acc[s.connector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = sessions.length;
    
    const types = [
      { label: 'CCS2', color: 'bg-volt-500' },
      { label: 'Type 2', color: 'bg-spark-500' },
      { label: 'CHAdeMO', color: 'bg-amberx-500' },
      { label: 'GB/T', color: 'bg-rosex-500' }
    ];

    const result = types.map(t => ({
      ...t,
      pct: counts[t.label] ? Math.round((counts[t.label] / total) * 100) : 0
    })).filter(t => t.pct > 0);

    return result.sort((a, b) => b.pct - a.pct);
  }, [sessions]);

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
          Good evening, {user?.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-ink-500">Here's what's happening with your EV today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button onClick={() => navigate('wallet')} className="text-left">
          <StatCard label="Wallet Balance" value={`₹${walletBalance.toLocaleString('en-IN')}`} icon={<Wallet className="h-6 w-6 text-volt-600" />} accent="volt" sub="Tap to manage" />
        </button>
        <button onClick={() => navigate('bookings')} className="text-left">
          <StatCard
            label="Upcoming Booking"
            value={upcoming ? upcoming.time : 'None'}
            icon={<CalendarClock className="h-6 w-6 text-spark-600" />}
            accent="spark"
            sub={upcoming ? upcoming.date : 'Book a charger'}
          />
        </button>
        <StatCard
          label="Last Charging"
          value={lastSession ? `${lastSession.energyKwh} kWh` : 'None'}
          icon={<Zap className="h-6 w-6 text-amberx-600" />}
          accent="amber"
          sub={lastSession ? lastSession.stationName : 'No sessions yet'}
        />
        <StatCard
          label="Total Sessions"
          value={sessions.length}
          icon={<History className="h-6 w-6 text-rosex-600" />}
          accent="rose"
          sub={`${sessions.reduce((a, s) => a + s.energyKwh, 0).toFixed(1)} kWh total`}
        />
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <button onClick={() => navigate('find')} className="card-pad group flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-glow">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-volt-50 text-volt-600"><MapPin className="h-6 w-6" /></div>
          <div className="text-left">
            <p className="font-display font-bold text-ink-900">Find a charger</p>
            <p className="text-xs text-ink-500">Search nearby stations</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-ink-300 transition group-hover:translate-x-1 group-hover:text-volt-500" />
        </button>
        <button onClick={() => navigate('wallet')} className="card-pad group flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-glow">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-spark-50 text-spark-600"><Plus className="h-6 w-6" /></div>
          <div className="text-left">
            <p className="font-display font-bold text-ink-900">Add money</p>
            <p className="text-xs text-ink-500">Recharge your wallet</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-ink-300 transition group-hover:translate-x-1 group-hover:text-spark-500" />
        </button>
        <button onClick={() => navigate('vehicles')} className="card-pad group flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-glow">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amberx-600"><BatteryCharging className="h-6 w-6" /></div>
          <div className="text-left">
            <p className="font-display font-bold text-ink-900">My vehicle</p>
            <p className="text-xs text-ink-500">Manage your EV</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-ink-300 transition group-hover:translate-x-1 group-hover:text-amberx-500" />
        </button>
      </div>

      {/* Nearby chargers */}
      <div className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Near you" title="Nearby chargers" />
          <button onClick={() => navigate('find')} className="btn-ghost btn-sm">
            View map <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nearby.map((s) => (
            <StationCard key={s.id} station={s} onClick={() => navigate('find')} />
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card-pad">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-ink-900">Recent sessions</h3>
            <button onClick={() => navigate('history')} className="text-xs font-semibold text-volt-600 hover:underline">View all</button>
          </div>
          <div className="mt-4 space-y-3">
            {sessions.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-volt-100 text-volt-600">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-900">{s.stationName}</p>
                  <p className="text-xs text-ink-500">{s.date} · {s.durationMin} min · {s.connector}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm font-bold text-ink-900">₹{s.amount}</p>
                  <p className="text-xs text-ink-400">{s.energyKwh} kWh</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-pad">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-ink-900">Spending overview</h3>
            <TrendingUp className="h-5 w-5 text-volt-500" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gradient-to-br from-volt-500/10 to-spark-500/10 p-4">
              <p className="text-xs font-semibold text-ink-500">This month</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink-900">
                ₹{sessions.slice(0, 3).reduce((a, s) => a + s.amount, 0)}
              </p>
              <p className="mt-1 text-xs text-volt-600">12% less than last month</p>
            </div>
            <div className="rounded-xl bg-ink-50 p-4">
              <p className="text-xs font-semibold text-ink-500">Avg / session</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink-900">
                ₹{sessions.length ? Math.round(sessions.reduce((a, s) => a + s.amount, 0) / sessions.length) : 0}
              </p>
              <p className="mt-1 text-xs text-ink-400">{sessions.length} sessions total</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {connectorUsage.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-ink-600">{r.label}</span>
                  <span className="text-ink-400">{r.pct}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100">
                  <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
