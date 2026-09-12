'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  eventName: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Event Live / Commenced</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <div className="flex flex-col items-center justify-center min-w-[40px] sm:min-w-[48px] py-1 px-1 sm:px-1.5 rounded-lg bg-[#070e1b] border border-[#162744]">
        <span className="font-bold text-sm sm:text-xl text-white font-mono">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="text-[8px] sm:text-[9px] uppercase font-medium text-blue-400">Days</span>
      </div>
      <span className="text-blue-500 font-bold text-sm">:</span>
      <div className="flex flex-col items-center justify-center min-w-[40px] sm:min-w-[48px] py-1 px-1 sm:px-1.5 rounded-lg bg-[#070e1b] border border-[#162744]">
        <span className="font-bold text-sm sm:text-xl text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[8px] sm:text-[9px] uppercase font-medium text-blue-400">Hours</span>
      </div>
      <span className="text-blue-500 font-bold text-sm">:</span>
      <div className="flex flex-col items-center justify-center min-w-[40px] sm:min-w-[48px] py-1 px-1 sm:px-1.5 rounded-lg bg-[#070e1b] border border-[#162744]">
        <span className="font-bold text-sm sm:text-xl text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[8px] sm:text-[9px] uppercase font-medium text-blue-400">Mins</span>
      </div>
      <span className="text-blue-500 font-bold text-sm">:</span>
      <div className="flex flex-col items-center justify-center min-w-[40px] sm:min-w-[48px] py-1 px-1 sm:px-1.5 rounded-lg bg-[#070e1b] border border-[#162744]">
        <span className="font-bold text-sm sm:text-xl text-[#38bdf8] font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[8px] sm:text-[9px] uppercase font-medium text-[#38bdf8]">Secs</span>
      </div>
    </div>
  );
}
