import { useState } from 'react';
import { useApp } from '@/store/app';
import { DashboardShell } from '@/components/DashboardShell';
import {
  Wallet, Plus, ArrowDownLeft, ArrowUpRight, Download, CreditCard,
  Send, Banknote, Smartphone, X, Check,
} from 'lucide-react';

const QUICK = [200, 500, 1000, 2000];
const METHODS = [
  { key: 'UPI', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
  { key: 'Credit Card', label: 'Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { key: 'Debit Card', label: 'Debit Card', icon: CreditCard, desc: 'All major banks' },
  { key: 'Net Banking', label: 'Net Banking', icon: Banknote, desc: '40+ banks supported' },
];

export function WalletPage() {
  const { walletBalance, walletTxns, addMoney, toast } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <DashboardShell title="Wallet">
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Wallet card */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white shadow-card">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-volt-500/20 blur-2xl" />
            <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-spark-500/20 blur-2xl" />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Current Balance</p>
                  <p className="mt-2 font-display text-4xl font-extrabold">₹{walletBalance.toLocaleString('en-IN')}</p>
                </div>
                <Wallet className="h-8 w-8 text-volt-400" />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-white/50">VoltGo Wallet · {walletTxns.length} transactions</p>
                  <p className="font-mono text-sm text-white/80">•••• 4471</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAdd(true)} className="btn bg-volt-500 text-white hover:bg-volt-600 btn-sm">
                    <Plus className="h-4 w-4" /> Add Money
                  </button>
                  <button onClick={() => toast('Send Money', 'Enter recipient details to send.', 'info')} className="btn bg-white/10 text-white hover:bg-white/20 btn-sm">
                    <Send className="h-4 w-4" /> Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <ActionTile icon={Plus} label="Add Money" onClick={() => setShowAdd(true)} />
            <ActionTile icon={Send} label="Send Money" onClick={() => toast('Send Money', 'Enter recipient details.', 'info')} />
            <ActionTile icon={CreditCard} label="Payment Methods" onClick={() => toast('Payment methods', 'Manage your saved cards and UPI.', 'info')} />
          </div>
        </div>

        {/* Summary */}
        <div className="card-pad">
          <h3 className="font-display font-bold text-ink-900">This month</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-volt-50 p-3.5">
              <p className="text-xs font-semibold text-volt-700">Money added</p>
              <p className="mt-1 font-display text-2xl font-bold text-volt-700">
                +₹{walletTxns.filter((t) => t.type === 'credit').reduce((a, t) => a + t.amount, 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="rounded-xl bg-rose-50 p-3.5">
              <p className="text-xs font-semibold text-rosex-600">Money spent</p>
              <p className="mt-1 font-display text-2xl font-bold text-rosex-600">
                -₹{walletTxns.filter((t) => t.type === 'debit').reduce((a, t) => a + t.amount, 0).toLocaleString('en-IN')}
              </p>
            </div>
            <button onClick={() => toast('Statement downloaded', 'Your wallet statement is ready.', 'success')} className="btn-ghost w-full btn-sm">
              <Download className="h-4 w-4" /> Download Statement
            </button>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div className="mt-6 card-pad">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink-900">Transaction history</h3>
          <span className="text-xs text-ink-400">{walletTxns.length} transactions</span>
        </div>
        <div className="mt-4 divide-y divide-ink-100">
          {walletTxns.map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-3">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                t.type === 'credit' ? 'bg-volt-50 text-volt-600' : 'bg-rose-50 text-rosex-600'
              }`}>
                {t.type === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-900">{t.title}</p>
                <p className="truncate text-xs text-ink-500">{t.subtitle} · {t.date}</p>
              </div>
              <p className={`font-display text-sm font-bold ${t.type === 'credit' ? 'text-volt-600' : 'text-ink-900'}`}>
                {t.type === 'credit' ? '+' : '−'} ₹{t.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showAdd && <AddMoneyModal balance={walletBalance} onClose={() => setShowAdd(false)} onAdd={addMoney} />}
    </DashboardShell>
  );
}

function ActionTile({ icon: Icon, label, onClick }: { icon: typeof Plus; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card-pad flex flex-col items-center gap-2 py-4 transition hover:-translate-y-0.5 hover:shadow-glow">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-volt-50 text-volt-600"><Icon className="h-5 w-5" /></span>
      <span className="text-xs font-bold text-ink-700">{label}</span>
    </button>
  );
}

function AddMoneyModal({ balance, onClose, onAdd }: { balance: number; onClose: () => void; onAdd: (a: number, m: string) => void }) {
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState('');
  const [method, setMethod] = useState('UPI');
  const finalAmount = custom ? Number(custom) : amount;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-map animate-slide-up sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-ink-200 p-5">
          <h2 className="font-display text-lg font-extrabold text-ink-900">Add money</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5">
          <p className="text-xs text-ink-500">Current balance</p>
          <p className="font-display text-2xl font-bold text-ink-900">₹{balance.toLocaleString('en-IN')}</p>

          <p className="mt-5 mb-2 text-sm font-bold text-ink-900">Quick add</p>
          <div className="grid grid-cols-4 gap-2">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => { setAmount(q); setCustom(''); }}
                className={`rounded-xl border py-2.5 text-sm font-bold transition ${
                  !custom && amount === q ? 'border-volt-500 bg-volt-50 text-volt-700 ring-1 ring-volt-500' : 'border-ink-200 text-ink-700 hover:bg-ink-50'
                }`}
              >
                ₹{q.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <p className="mt-4 mb-2 text-sm font-bold text-ink-900">Custom amount</p>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-lg font-bold text-ink-400">₹</span>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ''))}
              className="input pl-8"
              placeholder="Enter amount"
              inputMode="numeric"
            />
          </div>

          <p className="mt-5 mb-2 text-sm font-bold text-ink-900">Payment method</p>
          <div className="space-y-2">
            {METHODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  method === m.key ? 'border-volt-500 bg-volt-50 ring-1 ring-volt-500' : 'border-ink-200 hover:bg-ink-50'
                }`}
              >
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${method === m.key ? 'bg-volt-500 text-white' : 'bg-ink-100 text-ink-600'}`}>
                  <m.icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink-900">{m.label}</p>
                  <p className="text-[11px] text-ink-500">{m.desc}</p>
                </div>
                {method === m.key && <Check className="h-5 w-5 text-volt-500" />}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-ink-50 p-3.5">
            <span className="text-sm font-semibold text-ink-600">Adding</span>
            <span className="font-display text-xl font-bold text-ink-900">₹{(finalAmount || 0).toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={() => { if (finalAmount > 0) { onAdd(finalAmount, method); onClose(); } }}
            disabled={!finalAmount || finalAmount <= 0}
            className="btn-primary mt-4 w-full text-base"
          >
            <Plus className="h-4 w-4" /> Add ₹{(finalAmount || 0).toLocaleString('en-IN')}
          </button>
        </div>
      </div>
    </div>
  );
}
