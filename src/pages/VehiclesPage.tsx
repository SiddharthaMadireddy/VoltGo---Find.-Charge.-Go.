import { useState } from 'react';
import { useApp } from '@/store/app';
import { DashboardShell } from '@/components/DashboardShell';
import {
  Vehicle, ConnectorType, STATIONS, stationConnectors, stationAvailableCount, stationMinPrice, stationMaxPower,
} from '@/data/stations';
import {
  Plus, Car, Pencil, Trash2, X, Zap, BatteryCharging, Plug, Check,
  MapPin, Star,
} from 'lucide-react';
import { ConnectorIcon } from '@/components/ui';

export function VehiclesPage() {
  const { vehicles, addVehicle, updateVehicle, removeVehicle, navigate, toast } = useApp();
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <DashboardShell title="My Vehicle">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} in your garage</p>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary btn-sm">
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {vehicles.map((v) => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            onEdit={() => { setEditing(v); setShowForm(true); }}
            onRemove={() => removeVehicle(v.id)}
          />
        ))}
        {vehicles.length === 0 && (
          <div className="card-pad col-span-full py-12 text-center">
            <Car className="mx-auto h-10 w-10 text-ink-300" />
            <p className="mt-3 text-sm text-ink-500">No vehicles yet. Add your EV to get compatible charger recommendations.</p>
          </div>
        )}
      </div>

      {/* Recommended chargers */}
      {vehicles.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-lg font-bold text-ink-900">Recommended chargers for {vehicles[0].name}</h3>
          <p className="text-sm text-ink-500">Based on your vehicle's connector compatibility</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STATIONS.filter((s) => stationConnectors(s).some((c) => vehicles[0].connectors.includes(c)))
              .slice(0, 3)
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => navigate('find')}
                  className="card group p-4 text-left transition hover:-translate-y-0.5 hover:shadow-glow"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-display text-sm font-bold text-ink-900">{s.name}</h4>
                    <span className="chip-base px-2 py-1 text-[11px]"><Star className="h-3 w-3 fill-amberx-500 text-amberx-500" />{s.rating}</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-500"><MapPin className="h-3 w-3" /> {s.area} · {s.distanceKm} km</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="chip-volt text-[11px]">{stationAvailableCount(s)} available</span>
                    <span className="font-display text-sm font-bold text-ink-900">{stationMinPrice(s) === 0 ? 'Free' : `₹${stationMinPrice(s)}/kWh`}</span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {showForm && (
        <VehicleForm
          vehicle={editing}
          onClose={() => setShowForm(false)}
          onSave={(v) => {
            if (editing) updateVehicle(v);
            else addVehicle(v);
            setShowForm(false);
          }}
        />
      )}
    </DashboardShell>
  );
}

function VehicleCard({ vehicle, onEdit, onRemove }: { vehicle: Vehicle; onEdit: () => void; onRemove: () => void }) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-ink-900 to-ink-800">
        <div className="absolute inset-0 grid-map opacity-20" />
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-volt-500/20 blur-xl" />
        <div className="absolute bottom-4 left-5 flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur"><Car className="h-5 w-5" /></span>
          <div>
            <p className="font-display text-lg font-bold">{vehicle.name}</p>
            <p className="text-xs text-white/70">{vehicle.model}</p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-ink-50 p-3">
            <BatteryCharging className="mx-auto h-4 w-4 text-volt-500" />
            <p className="mt-1 font-display text-base font-bold text-ink-900">{vehicle.batteryKwh}</p>
            <p className="text-[10px] text-ink-400">kWh battery</p>
          </div>
          <div className="rounded-xl bg-ink-50 p-3">
            <Zap className="mx-auto h-4 w-4 text-spark-500" />
            <p className="mt-1 font-display text-base font-bold text-ink-900">{vehicle.maxChargingKw}</p>
            <p className="text-[10px] text-ink-400">kW max</p>
          </div>
          <div className="rounded-xl bg-ink-50 p-3">
            <Plug className="mx-auto h-4 w-4 text-amberx-500" />
            <p className="mt-1 text-[11px] font-bold text-ink-900">{vehicle.connectors.join(' / ')}</p>
            <p className="text-[10px] text-ink-400">Connectors</p>
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-ink-50 px-3 py-2 text-center">
          <p className="text-[11px] text-ink-400">Registration</p>
          <p className="font-mono text-sm font-bold text-ink-900">{vehicle.regNumber}</p>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={onEdit} className="btn-ghost btn-sm flex-1"><Pencil className="h-4 w-4" /> Edit</button>
          <button onClick={onRemove} className="btn-ghost btn-sm flex-1 text-rosex-600"><Trash2 className="h-4 w-4" /> Remove</button>
        </div>
      </div>
    </div>
  );
}

const ALL_CONNECTORS: ConnectorType[] = ['CCS2', 'Type 2', 'CHAdeMO', 'GB/T'];

function VehicleForm({ vehicle, onClose, onSave }: { vehicle: Vehicle | null; onClose: () => void; onSave: (v: Vehicle) => void }) {
  const [name, setName] = useState(vehicle?.name ?? '');
  const [model, setModel] = useState(vehicle?.model ?? '');
  const [battery, setBattery] = useState(vehicle?.batteryKwh?.toString() ?? '');
  const [maxKw, setMaxKw] = useState(vehicle?.maxChargingKw?.toString() ?? '');
  const [reg, setReg] = useState(vehicle?.regNumber ?? '');
  const [connectors, setConnectors] = useState<ConnectorType[]>(vehicle?.connectors ?? ['Type 2', 'CCS2']);

  function toggle(c: ConnectorType) {
    setConnectors((cs) => cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]);
  }

  function save() {
    if (!name || !battery || connectors.length === 0) return;
    onSave({
      id: vehicle?.id ?? `v${Date.now()}`,
      name, model: model || 'Standard',
      batteryKwh: Number(battery), maxChargingKw: Number(maxKw) || 50,
      regNumber: reg || '—', connectors,
    });
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto scrollbar-thin rounded-t-3xl bg-white shadow-map animate-slide-up sm:rounded-3xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-ink-200 bg-white p-5">
          <h2 className="font-display text-lg font-extrabold text-ink-900">{vehicle ? 'Edit vehicle' : 'Add vehicle'}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Vehicle Name</label>
              <input className="input" placeholder="Tesla Model 3" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Vehicle Model</label>
              <input className="input" placeholder="Long Range 2024" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div>
              <label className="label">Battery Capacity (kWh)</label>
              <input className="input" type="number" placeholder="60" value={battery} onChange={(e) => setBattery(e.target.value)} />
            </div>
            <div>
              <label className="label">Max Charging Speed (kW)</label>
              <input className="input" type="number" placeholder="170" value={maxKw} onChange={(e) => setMaxKw(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Registration Number</label>
              <input className="input" placeholder="TS 09 EV 4471" value={reg} onChange={(e) => setReg(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Connector Types</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ALL_CONNECTORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggle(c)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition ${
                      connectors.includes(c) ? 'border-volt-500 bg-volt-50 text-volt-700 ring-1 ring-volt-500' : 'border-ink-200 text-ink-600 hover:bg-ink-50'
                    }`}
                  >
                    <ConnectorIcon type={c} className="h-4 w-4" /> {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-2.5">
            <button onClick={save} disabled={!name || !battery || connectors.length === 0} className="btn-primary flex-1">
              <Check className="h-4 w-4" /> {vehicle ? 'Save changes' : 'Add vehicle'}
            </button>
            <button onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
