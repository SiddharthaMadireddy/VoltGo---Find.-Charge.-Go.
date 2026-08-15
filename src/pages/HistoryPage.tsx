import { useMemo, useState } from 'react';
import { useApp } from '@/store/app';
import { DashboardShell } from '@/components/DashboardShell';
import { SectionHeading } from '@/components/ui';
import {
  Download, Zap, Clock, Filter, X, FileText, Calendar,
} from 'lucide-react';
import { STATIONS, ConnectorType } from '@/data/stations';

const CONNECTOR_OPTIONS: ('All' | ConnectorType)[] = ['All', 'CCS2', 'Type 2', 'CHAdeMO', 'GB/T'];
const SORT_OPTIONS = ['Date', 'Amount', 'Energy'] as const;

export function HistoryPage() {
  const { sessions, toast } = useApp();
  const [connector, setConnector] = useState<'All' | ConnectorType>('All');
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]>('Date');
  const [stationFilter, setStationFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [invoice, setInvoice] = useState<typeof sessions[number] | null>(null);

  const stationNames = ['All', ...Array.from(new Set(sessions.map((s) => s.stationName)))];

  const filtered = useMemo(() => {
    let list = sessions.filter((s) => {
      if (connector !== 'All' && s.connector !== connector) return false;
      if (stationFilter !== 'All' && s.stationName !== stationFilter) return false;
      return true;
    });
    if (sort === 'Amount') list = [...list].sort((a, b) => b.amount - a.amount);
    if (sort === 'Energy') list = [...list].sort((a, b) => b.energyKwh - a.energyKwh);
    return list;
  }, [sessions, connector, stationFilter, sort]);

  const totalEnergy = filtered.reduce((a, s) => a + s.energyKwh, 0);
  const totalAmount = filtered.reduce((a, s) => a + s.amount, 0);
  const totalMins = filtered.reduce((a, s) => a + s.durationMin, 0);

  return (
    <DashboardShell title="Charging History">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryTile label="Total energy" value={`${totalEnergy.toFixed(1)} kWh`} icon={<Zap className="h-5 w-5 text-volt-600" />} accent="volt" />
        <SummaryTile label="Total spent" value={`₹${totalAmount}`} icon={<Calendar className="h-5 w-5 text-spark-600" />} accent="spark" />
        <SummaryTile label="Time charging" value={`${Math.floor(totalMins / 60)}h ${totalMins % 60}m`} icon={<Clock className="h-5 w-5 text-amberx-600" />} accent="amber" />
      </div>

      <div className="mt-5 card-pad">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-ink-900">All sessions</h3>
          <div className="flex items-center gap-2">
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="input py-2 text-sm w-auto">
              {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button onClick={() => setShowFilters((v) => !v)} className="btn-ghost btn-sm">
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-3 rounded-xl bg-ink-50 p-4 sm:grid-cols-2">
            <div>
              <label className="label">Station</label>
              <select value={stationFilter} onChange={(e) => setStationFilter(e.target.value)} className="input py-2.5 text-sm">
                {stationNames.map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Charger type</label>
              <div className="flex flex-wrap gap-2">
                {CONNECTOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setConnector(c)}
                    className={`chip px-3 py-1.5 text-xs ${connector === c ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Desktop table */}
        <div className="mt-4 hidden overflow-hidden rounded-xl ring-1 ring-ink-200 md:block">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs font-bold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Station</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Energy</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Charger</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-ink-50">
                  <td className="px-4 py-3 font-semibold text-ink-900">{s.stationName}</td>
                  <td className="px-4 py-3 text-ink-600">{s.date}</td>
                  <td className="px-4 py-3 font-semibold text-ink-900">{s.energyKwh} kWh</td>
                  <td className="px-4 py-3 text-ink-600">{s.durationMin} min</td>
                  <td className="px-4 py-3"><span className="chip-base px-2 py-1 text-[11px]">{s.connector}</span></td>
                  <td className="px-4 py-3 text-right font-display font-bold text-ink-900">₹{s.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setInvoice(s)} className="text-xs font-semibold text-volt-600 hover:underline">Invoice</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-4 space-y-3 md:hidden">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-xl border border-ink-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-ink-900">{s.stationName}</p>
                  <p className="text-xs text-ink-500">{s.date}</p>
                </div>
                <span className="font-display text-base font-bold text-ink-900">₹{s.amount}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                <span className="chip-base px-2 py-1">{s.connector}</span>
                <span>{s.energyKwh} kWh</span>
                <span>·</span>
                <span>{s.durationMin} min</span>
              </div>
              <button onClick={() => setInvoice(s)} className="btn-ghost btn-sm mt-3 w-full">
                <Download className="h-4 w-4" /> Download Invoice
              </button>
            </div>
          ))}
        </div>
      </div>

      {invoice && <InvoiceModal session={invoice} onClose={() => setInvoice(null)} onDownload={() => { toast('Invoice downloaded', `${invoice.stationName} · ${invoice.date}`, 'success'); }} />}
    </DashboardShell>
  );
}

function SummaryTile({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent: 'volt' | 'spark' | 'amber' }) {
  const accents = {
    volt: 'bg-volt-50 text-volt-600',
    spark: 'bg-spark-50 text-spark-600',
    amber: 'bg-amber-50 text-amberx-600',
  };
  return (
    <div className="card-pad flex items-center gap-4">
      <div className={`grid h-12 w-12 place-items-center rounded-xl ${accents[accent]}`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold text-ink-500">{label}</p>
        <p className="font-display text-2xl font-bold text-ink-900">{value}</p>
      </div>
    </div>
  );
}

function InvoiceModal({ session, onClose, onDownload }: { session: typeof STATIONS extends never ? never : { id: string; stationName: string; date: string; energyKwh: number; durationMin: number; connector: string; amount: number }; onClose: () => void; onDownload: () => void }) {
  const station = STATIONS.find((s) => s.name === session.stationName);
  const energyCost = session.amount;
  const tax = Math.round(energyCost * 0.05);
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-map animate-slide-up sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-ink-200 p-5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-volt-600" />
            <h2 className="font-display text-lg font-extrabold text-ink-900">Invoice</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5">
          <div className="rounded-xl bg-ink-50 p-4 text-center">
            <p className="font-display text-xl font-bold text-ink-900">{session.stationName}</p>
            <p className="text-xs text-ink-500">{station?.address}</p>
            <p className="mt-2 font-mono text-xs text-ink-500">INV-{session.id.toUpperCase()} · {session.date}</p>
          </div>
          <div className="mt-4 space-y-2.5 text-sm">
            <InvRow label="Charger type" value={session.connector} />
            <InvRow label="Energy consumed" value={`${session.energyKwh} kWh`} />
            <InvRow label="Charging duration" value={`${session.durationMin} minutes`} />
            <InvRow label="Energy cost" value={`₹${energyCost - tax}`} />
            <InvRow label="Taxes & fees" value={`₹${tax}`} />
            <div className="h-px bg-ink-200" />
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink-900">Total paid</span>
              <span className="font-display text-xl font-bold text-volt-600">₹{session.amount}</span>
            </div>
            <p className="text-[11px] text-ink-400">Paid via VoltGo Wallet</p>
          </div>
          <button onClick={onDownload} className="btn-primary mt-5 w-full">
            <Download className="h-4 w-4" /> Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

function InvRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  );
}
