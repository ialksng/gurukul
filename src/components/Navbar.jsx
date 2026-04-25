import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, LayoutDashboard, Terminal, ArrowLeft, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = 'https://ialksng.me/login'; 
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* BRANDING */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl border border-[#00f0ff]/50 bg-[#00f0ff]/10 flex items-center justify-center group-hover:bg-[#00f0ff]/20 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
            <Cpu className="text-[#00f0ff]" size={28} />
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#b026ff] uppercase">
              GURUKUL
            </span>
            <span className="text-[9px] text-[#00f0ff] font-bold tracking-[0.3em]">SECURE NEXUS V2</span>
          </div>
        </div>

        {/* MAIN LINKS */}
        <div className="hidden lg:flex items-center gap-10 font-bold text-xs tracking-widest text-slate-400">
          <button onClick={() => navigate('/dashboard')} className="hover:text-[#00f0ff] transition-colors flex items-center gap-2 uppercase">
            <LayoutDashboard size={16}/> Dashboard
          </button>
          <button className="hover:text-[#b026ff] transition-colors flex items-center gap-2 uppercase">
            <Terminal size={16}/> Holo-Deck
          </button>
          <a href="https://ialksng.me/store" className="hover:text-white transition-colors flex items-center gap-2 uppercase">
            <ArrowLeft size={16}/> Main Portal
          </a>
        </div>

        {/* LOGOUT */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all font-bold text-xs tracking-widest uppercase"
        >
          <LogOut size={16} /> <span className="hidden sm:block">Disconnect</span>
        </button>
      </div>
    </nav>
  );
}