import { useApp } from '@/store/app';
import { PublicShell } from '@/components/PublicShell';
import { SectionHeading } from '@/components/ui';
import {
  Zap, Target, Eye, Heart, ShieldCheck, MapPin, Wallet, Users,
  TrendingUp, ArrowRight, Leaf,
} from 'lucide-react';

export function AboutPage() {
  const { navigate } = useApp();
  return (
    <PublicShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-ink-50 py-16">
        <div className="absolute inset-0 grid-map opacity-30" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-volt-500/10 blur-3xl" />
        <div className="container-x relative text-center">
          <span className="chip-volt mx-auto mb-4 text-xs uppercase tracking-wider">About VoltGo</span>
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-extrabold text-ink-900 sm:text-5xl text-balance">
            Powering India's transition to electric mobility
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-500 text-balance">
            VoltGo is building the largest smart EV charging network in India — making charging simple, accessible and reliable for every driver.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-ink-200 bg-white">
        <div className="container-x grid grid-cols-2 gap-px py-10 md:grid-cols-4">
          {[
            { value: '2,500+', label: 'Stations' },
            { value: '8,000+', label: 'Chargers' },
            { value: '50+', label: 'Cities' },
            { value: '150K+', label: 'Users' },
          ].map((s) => (
            <div key={s.label} className="px-4 text-center">
              <p className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm font-semibold text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story / Mission / Vision */}
      <section className="container-x py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <StoryCard
            icon={Heart}
            title="Our Story"
            color="bg-rose-50 text-rosex-600"
            body="Founded in 2024 by a team of EV enthusiasts and engineers, VoltGo was born from a simple frustration: finding a working charger shouldn't be harder than finding a petrol pump. We set out to build a network that makes charging effortless, transparent and dependable — from first-time EV buyers to fleet operators."
          />
          <StoryCard
            icon={Target}
            title="Our Mission"
            color="bg-volt-50 text-volt-600"
            body="To accelerate India's transition to electric mobility by building the most reliable, accessible and user-friendly charging network in the country. We believe charging should be as easy as pulling up to a station and plugging in — no apps to fight, no surprise fees, no dead chargers."
          />
          <StoryCard
            icon={Eye}
            title="Our Vision"
            color="bg-spark-50 text-spark-600"
            body="A future where every Indian driver can choose an EV without worrying about where to charge. We envision a network dense enough that range anxiety becomes a thing of the past, powered by renewable energy and smart technology that adapts to how people actually drive."
          />
        </div>
      </section>

      {/* Why VoltGo */}
      <section className="bg-white py-20">
        <div className="container-x">
          <SectionHeading center eyebrow="Why VoltGo" title="How we make EV charging easier" desc="Six ways VoltGo removes the friction from everyday EV charging." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: MapPin, title: 'Charging everywhere', desc: '2,500+ stations across 50+ cities, from metros to highways, with new locations added weekly.' },
              { icon: Zap, title: 'Real-time availability', desc: 'Live charger status means you never arrive at an occupied bay again.' },
              { icon: Wallet, title: 'Transparent pricing', desc: 'See every fee upfront. Pay with wallet, UPI or card. No hidden charges, ever.' },
              { icon: ShieldCheck, title: 'Dependable network', desc: '99% uptime with proactive monitoring and on-ground maintenance teams.' },
              { icon: Leaf, title: 'Clean energy', desc: 'A growing share of our stations are powered by solar, reducing your carbon footprint further.' },
              { icon: Users, title: 'Built with drivers', desc: 'Every feature — from reservations to invoices — came from real EV owner feedback.' },
            ].map((f) => (
              <div key={f.title} className="card-pad group transition hover:-translate-y-0.5 hover:shadow-glow">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-volt-50 text-volt-600">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20 text-center">
        <h2 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl text-balance">Join the electric revolution</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-500 text-balance">Create your free VoltGo account and start charging today.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate('register')} className="btn-primary">Create account <ArrowRight className="h-4 w-4" /></button>
          <button onClick={() => navigate('find')} className="btn-ghost">Explore the map</button>
        </div>
      </section>
    </PublicShell>
  );
}

function StoryCard({ icon: Icon, title, color, body }: { icon: typeof Heart; title: string; color: string; body: string }) {
  return (
    <div className="card-pad">
      <div className={`grid h-12 w-12 place-items-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-ink-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-500">{body}</p>
    </div>
  );
}
