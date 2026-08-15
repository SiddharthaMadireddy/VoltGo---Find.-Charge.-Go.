import { useApp } from '@/store/app';
import { PublicShell } from '@/components/PublicShell';
import { SectionHeading, ConnectorIcon } from '@/components/ui';
import { CONNECTORS, ConnectorType, STATIONS, stationConnectors } from '@/data/stations';
import { Zap, Check, ArrowRight, Car } from 'lucide-react';

const ORDER: ConnectorType[] = ['CCS2', 'Type 2', 'CHAdeMO', 'GB/T'];

export function ConnectorsPage() {
  const { navigate } = useApp();
  return (
    <PublicShell>
      <div className="container-x py-16">
        <SectionHeading
          center
          eyebrow="Connector Compatibility"
          title="Every connector, one app"
          desc="VoltGo supports all major EV connectors used in India. Filter stations by your vehicle's connector and charge with confidence."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {ORDER.map((type) => {
            const meta = CONNECTORS[type];
            const count = STATIONS.filter((s) => stationConnectors(s).includes(type)).length;
            return (
              <div key={type} className="card-pad">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-14 w-14 place-items-center rounded-2xl ${meta.current === 'DC' ? 'bg-volt-50 text-volt-600' : 'bg-spark-50 text-spark-600'}`}>
                      <ConnectorIcon type={type} className="h-7 w-7" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold text-ink-900">{type}</h3>
                      <p className="text-sm text-ink-500">{meta.speed} · {meta.current}</p>
                    </div>
                  </div>
                  <span className="chip-volt text-[11px]">{count} stations</span>
                </div>

                <p className="mt-4 text-sm text-ink-500">{meta.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-ink-50 p-3">
                    <p className="text-[11px] text-ink-400">Maximum Power</p>
                    <p className="font-display text-lg font-bold text-ink-900">{meta.maxPower}</p>
                  </div>
                  <div className="rounded-xl bg-ink-50 p-3">
                    <p className="text-[11px] text-ink-400">Current Type</p>
                    <p className="font-display text-lg font-bold text-ink-900">{meta.current}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-500">
                    <Car className="h-3.5 w-3.5" /> Compatible Vehicles
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {meta.vehicles.map((v) => (
                      <span key={v} className="chip-base text-[11px]">{v}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="mt-12 overflow-hidden rounded-2xl ring-1 ring-ink-200">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs font-bold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3">Connector</th>
                <th className="px-5 py-3">Current</th>
                <th className="px-5 py-3">Max Power</th>
                <th className="px-5 py-3">Speed</th>
                <th className="px-5 py-3">Typical Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 bg-white">
              {ORDER.map((t) => {
                const m = CONNECTORS[t];
                return (
                  <tr key={t} className="hover:bg-ink-50">
                    <td className="px-5 py-3 font-bold text-ink-900">{t}</td>
                    <td className="px-5 py-3 text-ink-600">{m.current}</td>
                    <td className="px-5 py-3 font-semibold text-ink-900">{m.maxPower}</td>
                    <td className="px-5 py-3 text-ink-600">{m.speed}</td>
                    <td className="px-5 py-3 text-ink-600">{m.description.split('—')[0]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => navigate('find')} className="btn-primary text-base">
            <Zap className="h-4 w-4" /> Find Compatible Chargers <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </PublicShell>
  );
}
