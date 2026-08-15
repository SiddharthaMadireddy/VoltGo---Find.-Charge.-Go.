import { useState } from 'react';
import { useApp } from '@/store/app';
import { PublicShell } from '@/components/PublicShell';
import { SectionHeading } from '@/components/ui';
import {
  Mail, Phone, Clock, Send, Check, MapPin, MessageSquare, ArrowRight,
} from 'lucide-react';

export function ContactPage() {
  const { navigate, toast } = useApp();
  const [sent, setSent] = useState(false);

  return (
    <PublicShell>
      <div className="container-x py-16">
        <SectionHeading
          center
          eyebrow="Get in Touch"
          title="We're here to help, 24/7"
          desc="Questions, feedback or need support with a charging session? Our team responds around the clock."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          {/* Contact info */}
          <div className="space-y-4">
            <ContactCard icon={Mail} title="Customer Support" value="support@voltgo.app" desc="Email us anytime — we reply within 2 hours" color="bg-volt-50 text-volt-600" />
            <ContactCard icon={Phone} title="Phone" value="+91 98765 43210" desc="Mon–Sun, including holidays" color="bg-spark-50 text-spark-600" />
            <ContactCard icon={Clock} title="Support Hours" value="24/7" desc="Round-the-clock assistance for all users" color="bg-amber-50 text-amberx-600" />
            <ContactCard icon={MapPin} title="Headquarters" value="Hitech City, Hyderabad" desc="VoltGo Mobility Pvt. Ltd., Telangana 500081" color="bg-rose-50 text-rosex-600" />

            <div className="card-pad bg-gradient-to-br from-ink-900 to-ink-800 text-white">
              <h3 className="font-display text-lg font-bold">Need quick answers?</h3>
              <p className="mt-2 text-sm text-white/70">Our FAQ covers charging, payments, reservations and more.</p>
              <button onClick={() => navigate('faq')} className="btn mt-4 bg-white/10 text-white hover:bg-white/20 btn-sm">
                Visit FAQ <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="card-pad">
            {sent ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-volt-50">
                  <Check className="h-8 w-8 text-volt-500" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink-900">Message sent!</h3>
                <p className="mt-2 text-sm text-ink-500">Thanks for reaching out. Our team will get back to you within 2 hours.</p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-5 btn-sm">Send another message</button>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); toast('Message sent', 'We will reply within 2 hours.', 'success'); }}
                className="space-y-4"
              >
                <h3 className="font-display text-lg font-bold text-ink-900">Send us a message</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Name</label>
                    <input className="input" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input className="input" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <select className="input">
                      <option>General enquiry</option>
                      <option>Charging issue</option>
                      <option>Payment / wallet</option>
                      <option>Reservation</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea className="input min-h-[120px] resize-y" placeholder="Tell us how we can help…" required />
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  <Send className="h-4 w-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PublicShell>
  );
}

function ContactCard({ icon: Icon, title, value, desc, color }: { icon: typeof Mail; title: string; value: string; desc: string; color: string }) {
  return (
    <div className="card-pad flex items-start gap-4">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-xs font-semibold text-ink-500">{title}</p>
        <p className="font-display text-lg font-bold text-ink-900">{value}</p>
        <p className="mt-0.5 text-xs text-ink-400">{desc}</p>
      </div>
    </div>
  );
}
