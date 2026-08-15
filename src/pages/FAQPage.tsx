import { useState } from 'react';
import { useApp } from '@/store/app';
import { PublicShell } from '@/components/PublicShell';
import { SectionHeading } from '@/components/ui';
import { ChevronDown, Search, MessageSquare, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I find a charger?',
    a: 'Open the "Find Chargers" page to see an interactive map of all VoltGo stations near you. You can search by city, area or station name, and filter by charger type, availability and amenities. Each marker shows real-time status — green means available, orange means limited, red means fully occupied.',
  },
  {
    q: 'How do I know if a charger is available?',
    a: 'Every station card and map marker shows live availability. The status updates every few seconds, so you always see how many chargers are free before you head over. You can also filter the map to show only available chargers.',
  },
  {
    q: 'How do I reserve a charger?',
    a: 'Open any station, pick an available charger, select your date, time and estimated duration, then confirm. A small reservation fee (typically ₹10) holds your slot. You will receive a booking ID and QR code to show at the station.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'You can pay using your VoltGo Wallet, UPI (Google Pay, PhonePe, Paytm), credit cards, debit cards and net banking. The wallet is the fastest option — recharge once and charge anywhere without entering details each time.',
  },
  {
    q: 'How does pricing work?',
    a: 'You pay for the energy you consume, billed per kWh (typically ₹18/kWh, varies by station). Some stations also charge a parking fee per hour and an idle fee if you leave your car plugged in after charging completes. All fees are shown before you start.',
  },
  {
    q: 'What happens if I exceed my reservation time?',
    a: 'You get a 10-minute grace period after your reserved slot ends. After that, a small idle fee (₹5–10/min) may apply. If another user has reserved the charger after you, you will receive a notification to free up the bay.',
  },
  {
    q: 'What is an idle fee?',
    a: 'An idle fee is charged when your car stays plugged in after charging is complete. It encourages drivers to move their vehicle so others can charge. There is a 10-minute grace period before the fee kicks in.',
  },
  {
    q: 'Can I cancel a reservation?',
    a: 'Yes. You can cancel any upcoming booking from the "My Bookings" page. Cancellations made more than 30 minutes before the slot are fully refunded. Later cancellations may forfeit the reservation fee.',
  },
  {
    q: 'How do I add money to my wallet?',
    a: 'Go to the Wallet page, tap "Add Money", choose a quick amount (₹200, ₹500, ₹1,000, ₹2,000) or enter a custom amount, select a payment method (UPI, card, net banking) and confirm. Your balance updates instantly.',
  },
  {
    q: 'Which EV connectors are supported?',
    a: 'VoltGo supports all major connectors used in India: CCS2 (DC fast, up to 350 kW), Type 2 (AC, up to 22 kW), CHAdeMO (DC fast, up to 100 kW) and GB/T (DC fast, up to 120 kW). Filter stations by your vehicle\'s connector on the Find Chargers page.',
  },
];

export function FAQPage() {
  const { navigate } = useApp();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<number | null>(0);

  const filtered = FAQS.filter((f) =>
    !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <PublicShell>
      <div className="container-x py-16">
        <SectionHeading
          center
          eyebrow="Help Center"
          title="Frequently Asked Questions"
          desc="Everything you need to know about charging with VoltGo. Can't find an answer? Reach out to our 24/7 support."
        />

        {/* Search */}
        <div className="mx-auto mt-8 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input pl-11"
              placeholder="Search questions…"
            />
          </div>
        </div>

        {/* FAQ list */}
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {filtered.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 p-5 text-left"
                >
                  <span className="font-display text-[15px] font-bold text-ink-900">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="animate-fade-in px-5 pb-5 text-sm leading-relaxed text-ink-500">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="card-pad py-10 text-center text-sm text-ink-500">
              No questions match "{query}".
            </div>
          )}
        </div>

        {/* Still need help */}
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="card-pad flex flex-col items-center gap-4 bg-gradient-to-br from-ink-900 to-ink-800 text-center text-white sm:flex-row sm:text-left">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10"><MessageSquare className="h-6 w-6 text-volt-400" /></span>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold">Still need help?</h3>
              <p className="text-sm text-white/70">Our support team is available 24/7 to assist you.</p>
            </div>
            <button onClick={() => navigate('contact')} className="btn bg-volt-500 text-white hover:bg-volt-600 btn-sm">
              Contact support <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
