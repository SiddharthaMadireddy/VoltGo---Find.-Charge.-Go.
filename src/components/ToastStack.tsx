import { useApp } from '@/store/app';
import { CheckCircle2, Info, XCircle, X } from 'lucide-react';

export function ToastStack() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto sm:px-0">
      {toasts.map((t) => {
        const Icon = t.tone === 'success' ? CheckCircle2 : t.tone === 'error' ? XCircle : Info;
        const tone = t.tone === 'success' ? 'text-volt-600' : t.tone === 'error' ? 'text-rosex-600' : 'text-spark-600';
        return (
          <div
            key={t.id}
            className="pointer-events-auto w-full max-w-sm animate-fade-up rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-200"
          >
            <div className="flex items-start gap-3">
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-900">{t.title}</p>
                {t.body && <p className="mt-0.5 text-xs text-ink-500">{t.body}</p>}
              </div>
              <button onClick={() => dismissToast(t.id)} className="rounded-lg p-1 text-ink-400 hover:bg-ink-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
