import { Zap } from 'lucide-react';

export function Logo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-volt-500 text-white shadow-glow">
        <Zap className="h-5 w-5 fill-white" />
      </span>
      <span className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink-900'}`}>
        Volt<span className="text-volt-500">Go</span>
      </span>
    </div>
  );
}
