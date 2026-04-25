import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Terminal, Database, BrainCircuit, ChevronRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center w-full relative overflow-hidden bg-[#030308]">
      
      {/* --- BACKGROUND GLOW EFFECTS --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00f0ff]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#b026ff]/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <div className="mb-6 px-4 py-1.5 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 flex items-center gap-2 text-[#00f0ff] text-xs font-bold tracking-[0.2em] uppercase">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
          Neural Learning Environment V2
        </div>

        <h1 className="text-6xl md:text-8xl font-orbitron font-black text-white mb-8 tracking-wider uppercase leading-tight">
          Enter The <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#b026ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            Gurukul Nexus
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl font-rajdhani tracking-widest mb-12 max-w-3xl leading-relaxed">
          ABANDON TRADITIONAL COURSES. LEARN THROUGH DIRECT NEURAL INTERFACE WITH AI TUTORS, EXECUTE CODE IN SECURE SANDBOXES, AND BUILD YOUR PERSONAL KNOWLEDGE VAULT.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="group relative px-10 py-4 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] font-orbitron font-bold tracking-widest uppercase rounded-lg transition-all hover:bg-[#00f0ff] hover:text-black overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <span className="relative z-10 flex items-center gap-2">Initiate Sequence <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/></span>
          </button>

          <a 
            href="https://ialksng.me/store"
            className="px-10 py-4 bg-white/5 border border-white/10 text-white font-orbitron font-bold tracking-widest uppercase rounded-lg transition-all hover:bg-white/10 hover:border-white/30"
          >
            Return to Portal
          </a>
        </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        
        {/* Feature 1 */}
        <div className="bg-[#0a0a0f]/60 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:border-[#00f0ff]/50 transition-all group">
          <div className="w-14 h-14 bg-[#00f0ff]/10 rounded-xl flex items-center justify-center mb-6 border border-[#00f0ff]/20 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
            <BrainCircuit size={28} className="text-[#00f0ff]" />
          </div>
          <h3 className="font-orbitron text-xl font-bold text-white mb-3 tracking-wide">Indra AI Tutor</h3>
          <p className="text-slate-400 text-sm leading-relaxed tracking-wide">
            Your personal neural guide. Indra doesn't just give answers; it analyzes your code and provides tactical hints to force adaptation and learning.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-[#0a0a0f]/60 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:border-[#b026ff]/50 transition-all group">
          <div className="w-14 h-14 bg-[#b026ff]/10 rounded-xl flex items-center justify-center mb-6 border border-[#b026ff]/20 group-hover:shadow-[0_0_20px_rgba(176,38,255,0.3)] transition-all">
            <Terminal size={28} className="text-[#b026ff]" />
          </div>
          <h3 className="font-orbitron text-xl font-bold text-white mb-3 tracking-wide">Secure Holo-Deck</h3>
          <p className="text-slate-400 text-sm leading-relaxed tracking-wide">
            An integrated Piston-powered execution sandbox. Write, compile, and deploy Python, JS, and C++ code directly within the learning matrix.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-[#0a0a0f]/60 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:border-emerald-500/50 transition-all group">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
            <Database size={28} className="text-emerald-400" />
          </div>
          <h3 className="font-orbitron text-xl font-bold text-white mb-3 tracking-wide">SmartSphere Vault</h3>
          <p className="text-slate-400 text-sm leading-relaxed tracking-wide">
            Extract and store vital code snippets, architectural notes, and AI insights into your personal, encrypted knowledge base for future deployment.
          </p>
        </div>

      </div>
    </div>
  );
}