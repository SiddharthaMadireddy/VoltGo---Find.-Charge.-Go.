import { useState, useEffect } from 'react';
import { useApp } from '@/store/app';
import { Logo } from '@/components/Logo';

export function WelcomeOverlay() {
  const { user, clearJustLoggedIn } = useApp();
  const [phase, setPhase] = useState<'start' | 'center' | 'corner' | 'done'>('start');

  useEffect(() => {
    // 0.1s -> 'center' (scales up and moves to center)
    const t1 = setTimeout(() => setPhase('center'), 100);
    // 2.0s -> 'corner' (moves to top-left where DashboardShell sidebar has it)
    const t2 = setTimeout(() => setPhase('corner'), 2000);
    // 2.8s -> done (removes overlay)
    const t3 = setTimeout(() => {
      setPhase('done');
      clearJustLoggedIn();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [clearJustLoggedIn]);

  if (phase === 'done') return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-volt-50/95 backdrop-blur-md transition-opacity duration-[800ms] ${
        phase === 'corner' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div 
        className={`fixed transition-all duration-[900ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
          phase === 'start' 
            ? 'top-4 left-[5%] lg:left-[10%] scale-100 opacity-0' // Start invisibly near corner to avoid jump
            : phase === 'center'
            ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-24 scale-[2.5] opacity-100'
            : 'top-5 left-5 translate-x-0 translate-y-0 scale-100 opacity-100' // Target DashboardShell position
        }`}
      >
        <Logo />
      </div>
      
      <div 
        className={`mt-24 text-center transition-all duration-700 ease-out ${
          phase === 'center' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="font-display text-4xl font-extrabold text-ink-900 drop-shadow-sm">
          Welcome, {user?.name.split(' ')[0]}
        </h1>
        <p className="mt-3 text-ink-500 font-semibold text-lg">Preparing your dashboard...</p>
      </div>
    </div>
  );
}
