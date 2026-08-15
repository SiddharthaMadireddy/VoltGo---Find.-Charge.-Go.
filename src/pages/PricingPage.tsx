import { useApp } from '@/store/app';
import { PublicShell } from '@/components/PublicShell';
import { SectionHeading } from '@/components/ui';
import {
  Zap, Clock, Wallet, ShieldCheck, Info, Calculator, BatteryCharging, ArrowRight, Check,
} from 'lucide-react';
import { useState } from 'react';

export function PricingPage() {
  const { navigate } = useApp();
  return (
    <PublicShell>
      <div className="container-x py-16">
        <SectionHeading
          center
          eyebrow="Transparent Pricing"
          title="What you see is what you pay"
          desc="No hidden charges, no surprises. Every fee is shown before you start charging."
        />

        {/* Fee breakdown */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeeCard icon={Zap} label="Energy" value="₹18/kWh" desc="Pay only for the energy you consume. Rates vary by station and charger type." accent="volt" />
          <FeeCard icon={Clock} label="Parking" value="₹20/hour" desc="Parking fee applies at select stations after a grace period." accent="spark" />
          <FeeCard icon={BatteryCharging} label="Idle Fee" value="₹5/min" desc="Charged after a 10-minute grace once your session ends. Move your car to avoid it." accent="amber" />
          <FeeCard icon={Wallet} label="Reservation" value="₹10" desc="Small fee to hold your charger. Refundable if you cancel in time." accent="rose" />
        </div>

        <p className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-2 text-center text-sm text-ink-500">
          <Info className="h-4 w-4 shrink-0" />
          Prices may vary by station, city, and charger type. Always check the station details before starting a session.
        </p>

        {/* Cost calculator */}
        <div className="mx-auto mt-16 max-w-3xl">
          <CostCalculator />
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button onClick={() => navigate('find')} className="btn-primary text-base">
            Find a Charger <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </PublicShell>
  );
}

function FeeCard({ icon: Icon, label, value, desc, accent }: { icon: typeof Zap; label: string; value: string; desc: string; accent: 'volt' | 'spark' | 'amber' | 'rose' }) {
  const accents = {
    volt: 'bg-volt-50 text-volt-600',
    spark: 'bg-spark-50 text-spark-600',
    amber: 'bg-amber-50 text-amberx-600',
    rose: 'bg-rose-50 text-rosex-600',
  };
  return (
    <div className="card-pad">
      <div className={`grid h-12 w-12 place-items-center rounded-xl ${accents[accent]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-ink-500">{label}</h3>
      <p className="mt-1 font-display text-2xl font-extrabold text-ink-900">{value}</p>
      <p className="mt-2 text-xs text-ink-500">{desc}</p>
    </div>
  );
}

function CostCalculator() {
  const { navigate, toast } = useApp();
  const [battery, setBattery] = useState(60);
  const [current, setCurrent] = useState(25);
  const [target, setTarget] = useState(80);
  const pricePerKwh = 18;

  const energy = Math.max(0, ((target - current) / 100) * battery);
  const cost = Math.round(energy * pricePerKwh);

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center gap-3 border-b border-ink-200 bg-ink-50 p-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-volt-100 text-volt-600"><Calculator className="h-5 w-5" /></span>
        <div>
          <h3 className="font-display text-lg font-bold text-ink-900">Charging Cost Calculator</h3>
          <p className="text-xs text-ink-500">Estimate your charging cost before you plug in</p>
        </div>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className="label">Battery Capacity: {battery} kWh</label>
            <input type="range" min="20" max="120" value={battery} onChange={(e) => setBattery(Number(e.target.value))} className="w-full accent-volt-500" />
          </div>
          <div>
            <label className="label">Current Battery: {current}%</label>
            <input type="range" min="0" max="100" value={current} onChange={(e) => setCurrent(Number(e.target.value))} className="w-full accent-spark-500" />
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-spark-500" style={{ width: `${current}%` }} />
            </div>
          </div>
          <div>
            <label className="label">Target Battery: {target}%</label>
            <input type="range" min={Math.max(current + 1, 10)} max="100" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full accent-volt-500" />
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-volt-500" style={{ width: `${target}%` }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Estimated Energy</p>
          <p className="mt-1 font-display text-3xl font-extrabold">{energy.toFixed(1)} kWh</p>
          <div className="my-4 h-px bg-white/10" />
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Estimated Cost</p>
          <p className="mt-1 font-display text-4xl font-extrabold text-volt-400">₹{cost}</p>
          <p className="mt-2 text-xs text-white/50">Based on ₹{pricePerKwh}/kWh</p>
          <button
            onClick={() => { toast('Charging started', `Estimated cost ₹${cost} for ${energy.toFixed(1)} kWh.`, 'success'); navigate('find'); }}
            className="btn mt-5 bg-volt-500 text-white hover:bg-volt-600"
          >
            <Zap className="h-4 w-4" /> Start Charging
          </button>
        </div>
      </div>
    </div>
  );
}
