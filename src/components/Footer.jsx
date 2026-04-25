import React from 'react';
import { Cpu, ShieldCheck, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050508] border-t border-white/5 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* STATUS INDICATOR */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest">
            <Activity size={14} className="animate-pulse" /> SYSTEM ONLINE
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-widest">
            <ShieldCheck size={14} className="text-[#00f0ff]" /> ENCRYPTED
          </div>
        </div>

        {/* COPYRIGHT */}
        <p className="text-slate-600 text-xs font-bold tracking-widest uppercase">
          &copy; {new Date().getFullYear()} IALKSNG.ME. ALL PROTOCOLS RESERVED.
        </p>
      </div>
    </footer>
  );
}