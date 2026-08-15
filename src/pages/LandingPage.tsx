import { useApp } from '@/store/app';
import { SectionHeading } from '@/components/ui';
import {
  Search, Zap, MapPin, Star, Clock, Wallet, ShieldCheck, Calendar,
  History, Plug, Navigation2, BatteryCharging, ArrowRight, Download,
  CheckCircle2, Gauge, Wifi, Car,
} from 'lucide-react';
import { STATIONS } from '@/data/stations';

const HERO_IMG = 'https://images.pexels.com/photos/4678065/pexels-photo-4678065.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400';
const HERO_IMG_2 = 'https://images.pexels.com/photos/28851165/pexels-photo-28851165.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400';

export function LandingPage() {
  const { navigate } = useApp();
  return (
    <div>
      <Hero />
      <StatsBar />
      <HowItWorks />
      <WhyVoltGo />
      <FeaturePreview />
      <ConnectorStrip />
      <CTA />
    </div>
  );
}

function Hero() {
  const { navigate } = useApp();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-ink-50 to-ink-50">
      <div className="absolute inset-0 grid-map opacity-40" />
      <div className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-volt-500/10 blur-3xl" />
      <div className="absolute -left-40 top-40 h-[28rem] w-[28rem] rounded-full bg-spark-500/10 blur-3xl" />

      <div className="container-x relative grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div className="animate-fade-up">
          <span className="chip-volt mb-5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-volt-500" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-volt-500" />
            </span>
            99% network uptime · live
          </span>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-ink-900 sm:text-6xl lg:text-7xl text-balance">
            Find. Charge. <span className="bg-gradient-to-r from-volt-500 to-spark-500 bg-clip-text text-transparent">Go.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-500 text-balance">
            Find available EV chargers near you, compare prices, check charger compatibility, and start your charging session in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={() => navigate('find')} className="btn-primary text-base">
              <Search className="h-5 w-5" /> Find a Charger
            </button>
            <button onClick={() => navigate('register')} className="btn-dark text-base">
              <Download className="h-5 w-5" /> Download App
            </button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-ink-500">
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-volt-500" /> Secure payments</div>
            <div className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-spark-500" /> Real-time availability</div>
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="relative overflow-hidden rounded-4xl shadow-map ring-1 ring-ink-200">
            <img src={HERO_IMG} alt="EV charging station" className="h-[420px] w-full object-cover sm:h-[480px]" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-volt-500" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-volt-500" />
              </span>
              <span className="text-xs font-bold text-ink-900">6 of 8 available</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/95 p-3 backdrop-blur">
              <div>
                <p className="font-display text-sm font-bold text-ink-900">VoltGo Gachibowli</p>
                <p className="text-xs text-ink-500">2.4 km · CCS2 · 120 kW</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-ink-400">from</p>
                <p className="font-display text-base font-bold text-volt-600">₹18/kWh</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden w-48 rotate-[-4deg] overflow-hidden rounded-2xl shadow-card ring-1 ring-ink-200 sm:block">
            <img src={HERO_IMG_2} alt="EV charging" className="h-28 w-full object-cover" />
          </div>
          <div className="absolute -right-4 top-8 hidden rounded-2xl bg-white p-3 shadow-card ring-1 ring-ink-200 sm:block">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-spark-50 text-spark-600"><BatteryCharging className="h-5 w-5" /></span>
              <div>
                <p className="text-[10px] text-ink-400">Charging now</p>
                <p className="font-display text-sm font-bold text-ink-900">32.5 kWh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SearchSection />
    </section>
  );
}

function SearchSection() {
  const { navigate } = useApp();
  return (
    <div className="container-x relative -mt-2 pb-10">
      <div className="card-pad">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-volt-500" />
          <h3 className="font-display text-lg font-bold text-ink-900">Where do you want to charge?</h3>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); navigate('find'); }}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input
              className="input pl-11"
              placeholder="Enter city, area or charging station"
            />
          </div>
          <button type="submit" className="btn-primary">
            <Search className="h-4 w-4" /> Find Chargers
          </button>
        </form>
      </div>
    </div>
  );
}

function StatsBar() {
  const stats = [
    { value: '2,500+', label: 'Charging Stations' },
    { value: '8,000+', label: 'Chargers' },
    { value: '50+', label: 'Cities' },
    { value: '99%', label: 'Uptime' },
  ];
  return (
    <section className="border-y border-ink-200/70 bg-white">
      <div className="container-x grid grid-cols-2 gap-px py-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="px-4 text-center">
            <p className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm font-semibold text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Search, title: 'Find a Charger', desc: 'Search by location or let the map show nearby stations with live availability.', color: 'text-spark-600 bg-spark-50' },
    { icon: Gauge, title: 'Check Availability', desc: 'See exactly how many chargers are free, their speed, connector and price.', color: 'text-volt-600 bg-volt-50' },
    { icon: BatteryCharging, title: 'Reserve or Start Charging', desc: 'Book a slot in advance or plug in and start your session instantly.', color: 'text-amberx-600 bg-amber-50' },
    { icon: Wallet, title: 'Pay Securely', desc: 'Use your VoltGo wallet, UPI or cards. Transparent pricing, no surprises.', color: 'text-rosex-600 bg-rose-50' },
  ];
  return (
    <section className="container-x py-20">
      <SectionHeading center eyebrow="How it works" title="Charging, simplified in 4 steps" desc="From finding a charger to hitting the road — VoltGo takes you from low battery to fully charged without the guesswork." />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.title} className="card-pad relative">
            <span className="absolute right-4 top-4 font-display text-4xl font-extrabold text-ink-100">{i + 1}</span>
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{s.title}</h3>
            <p className="mt-2 text-sm text-ink-500">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyVoltGo() {
  const features = [
    { icon: Zap, title: 'Real-time availability', desc: 'Live charger status updated every few seconds — no more arriving to occupied bays.', color: 'text-volt-600 bg-volt-50' },
    { icon: Wallet, title: 'Transparent pricing', desc: 'See ₹/kWh, parking, idle and reservation fees upfront. What you see is what you pay.', color: 'text-spark-600 bg-spark-50' },
    { icon: Plug, title: 'Multiple charger types', desc: 'CCS2, Type 2, CHAdeMO and GB/T — filter stations by your vehicle\'s connector.', color: 'text-amberx-600 bg-amber-50' },
    { icon: ShieldCheck, title: 'Secure digital wallet', desc: 'UPI, cards and net banking in one wallet. Recharge once, charge anywhere.', color: 'text-rosex-600 bg-rose-50' },
    { icon: Calendar, title: 'Easy reservations', desc: 'Reserve a charger up to 24 hours ahead with a small, refundable fee.', color: 'text-volt-600 bg-volt-50' },
    { icon: History, title: 'Charging history', desc: 'Every session logged with energy, duration, cost and downloadable invoices.', color: 'text-spark-600 bg-spark-50' },
  ];
  return (
    <section className="bg-white py-20">
      <div className="container-x">
        <SectionHeading center eyebrow="Why VoltGo" title="Built for the way EV owners actually charge" desc="Six reasons drivers switch to VoltGo and stay." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-pad group transition hover:-translate-y-0.5 hover:shadow-glow">
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturePreview() {
  const { navigate } = useApp();
  const featured = STATIONS.slice(0, 3);
  return (
    <section className="container-x py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Live network" title="Stations charging EVs right now" desc="A glimpse of the VoltGo network across Indian cities." />
        <button onClick={() => navigate('find')} className="btn-ghost btn-sm">
          View all stations <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {featured.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate('find')}
            className="card group overflow-hidden p-0 text-left transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-spark-100 to-volt-100 grid-map">
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/30 to-transparent" />
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 backdrop-blur">
                <span className={`h-2 w-2 rounded-full ${s.status === 'available' ? 'bg-volt-500' : s.status === 'limited' ? 'bg-amberx-500' : 'bg-rosex-500'}`} />
                <span className="text-xs font-bold text-ink-900">{s.status === 'available' ? 'Available' : s.status === 'limited' ? 'Limited' : 'Full'}</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <span className="flex items-center gap-1 text-xs font-semibold"><MapPin className="h-3.5 w-3.5" /> {s.area}</span>
                <span className="flex items-center gap-1 text-xs font-semibold"><Star className="h-3 w-3 fill-amberx-400 text-amberx-400" /> {s.rating}</span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-display text-base font-bold text-ink-900">{s.name}</h4>
              <p className="mt-1 text-xs text-ink-500">{s.distanceKm} km · {s.hours}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="chip-volt text-[11px]">{s.chargers.filter(c => c.status === 'available').length} available</span>
                <span className="font-display text-sm font-bold text-ink-900">₹18/kWh</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function ConnectorStrip() {
  const items = [
    { name: 'CCS2', power: '350 kW', type: 'DC Fast' },
    { name: 'Type 2', power: '22 kW', type: 'AC' },
    { name: 'CHAdeMO', power: '100 kW', type: 'DC Fast' },
    { name: 'GB/T', power: '120 kW', type: 'DC Fast' },
  ];
  const { navigate } = useApp();
  return (
    <section className="bg-ink-900 py-20 text-white">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip mb-3 bg-white/10 text-volt-300 text-[11px] uppercase tracking-wider">Compatibility</span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Every connector, one app</h2>
            <p className="mt-3 max-w-lg text-ink-300">VoltGo supports all major EV connectors used in India. Filter stations by your vehicle's connector and charge with confidence.</p>
          </div>
          <button onClick={() => navigate('connectors')} className="btn bg-white/10 text-white hover:bg-white/20">
            Connector guide <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c) => (
            <div key={c.name} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold">{c.name}</span>
                <Plug className="h-5 w-5 text-volt-400" />
              </div>
              <p className="mt-3 text-sm text-ink-300">{c.type}</p>
              <p className="mt-1 font-display text-2xl font-bold text-volt-400">{c.power}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const { navigate } = useApp();
  return (
    <section className="container-x py-20">
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-volt-500 to-spark-600 px-6 py-14 text-center text-white sm:px-12">
        <div className="absolute inset-0 grid-map opacity-20" />
        <div className="relative">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-balance">Ready to charge smarter?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90 text-balance">
            Create your free VoltGo account and join thousands of EV drivers charging across India.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate('register')} className="btn bg-white text-volt-700 hover:bg-ink-50">
              Create free account <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate('find')} className="btn bg-ink-900/20 text-white ring-1 ring-white/40 hover:bg-ink-900/30">
              Explore the map
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
