"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
};

function computeTimeLeft(targetTs: number): TimeLeft {
  const diff = Math.max(0, targetTs - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

// ---------- Time unit box (defined OUTSIDE the component) ----------
function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg font-black text-navy-900 shadow-md sm:h-14 sm:w-14 sm:text-xl">
        {String(value).padStart(2, "0")}
        <span className="absolute inset-x-0 top-1/2 h-px bg-gray-200/70" />
      </div>
      <span className="mt-1 text-[9px] font-black uppercase tracking-widest text-white/70">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ endsAt }: { endsAt: Date }) {
  const isClient = useIsClient();
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!isClient) return;
    const targetTs = endsAt.getTime();

    // Initial tick (async so it doesn't trigger the sync-setState-in-effect rule)
    const t = setTimeout(() => setTime(computeTimeLeft(targetTs)), 0);

    const interval = setInterval(() => {
      setTime(computeTimeLeft(targetTs));
    }, 1000);

    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, [isClient, endsAt]);

  // Placeholder before client mount to prevent hydration mismatch
  const display: TimeLeft = time ?? { hours: 0, minutes: 0, seconds: 0 };

  return (
    <div className="flex items-center gap-2">
      <TimeBox value={display.hours} label="Hrs" />
      <span className="text-xl font-black text-white/60">:</span>
      <TimeBox value={display.minutes} label="Min" />
      <span className="text-xl font-black text-white/60">:</span>
      <TimeBox value={display.seconds} label="Sec" />
    </div>
  );
}