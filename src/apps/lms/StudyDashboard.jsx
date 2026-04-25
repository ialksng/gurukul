import React, { useState } from 'react';
import { BookOpen, PlayCircle } from 'lucide-react';

export default function StudyDashboard() {
  const [courses] = useState([
    { id: 1, title: 'Advanced Algorithms', progress: 75, totalModules: 12, type: 'CORE' },
    { id: 2, title: 'System Design Protocol', progress: 30, totalModules: 8, type: 'ARCHITECTURE' },
    { id: 3, title: 'Neural Networks', progress: 0, totalModules: 15, type: 'AI' }
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-fade-in">
      {/* Header Profile Section */}
      <div className="glass-panel neon-border-cyan rounded-2xl p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f0ff] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div>
          <h1 className="text-4xl md:text-5xl font-orbitron font-black text-white mb-2 uppercase tracking-wide">
            Welcome, <span className="neon-text-cyan">Operator</span>
          </h1>
          <p className="text-slate-400 font-bold tracking-widest text-sm">SECURE LEARNING ENVIRONMENT ACTIVATED</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-black/50 border border-[#00f0ff]/30 p-4 rounded-xl text-center min-w-[120px]">
            <p className="text-slate-500 text-xs font-bold tracking-widest mb-1">MODULES</p>
            <p className="text-3xl font-orbitron font-bold text-[#00f0ff]">3</p>
          </div>
          <div className="bg-black/50 border border-[#b026ff]/30 p-4 rounded-xl text-center min-w-[120px]">
            <p className="text-slate-500 text-xs font-bold tracking-widest mb-1">COMPLETION</p>
            <p className="text-3xl font-orbitron font-bold text-[#b026ff]">35%</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <BookOpen className="text-[#00f0ff]" size={24} />
        <h2 className="text-2xl font-orbitron font-bold tracking-widest uppercase text-white">Active Databanks</h2>
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="glass-panel rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden border border-white/5 hover:border-[#00f0ff]/50">
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/0 to-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-[#00f0ff]/10 text-[#00f0ff] px-3 py-1 rounded-full border border-[#00f0ff]/20">
                {course.type}
              </span>
              <PlayCircle size={28} className="text-slate-600 group-hover:text-[#00f0ff] transition-colors cursor-pointer" />
            </div>

            <h3 className="font-orbitron font-bold text-xl mb-2 text-white group-hover:neon-text-cyan transition-all">{course.title}</h3>
            <p className="text-sm text-slate-500 font-bold tracking-widest mb-6">{course.totalModules} SECTORS</p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold tracking-widest">
                <span className="text-slate-400">INTEGRATION</span>
                <span className={course.progress > 0 ? "text-[#00f0ff]" : "text-slate-500"}>{course.progress}%</span>
              </div>
              <div className="w-full bg-black/80 rounded-full h-1.5 border border-white/5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 relative" 
                  style={{ 
                    width: `${course.progress}%`,
                    background: `linear-gradient(90deg, #00f0ff, #b026ff)`,
                    boxShadow: '0 0 10px #00f0ff'
                  }} 
                />
              </div>
            </div>
            
            {/* Holographic Button */}
            <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold tracking-widest text-sm text-slate-300 group-hover:bg-[#00f0ff]/10 group-hover:border-[#00f0ff]/50 group-hover:text-[#00f0ff] transition-all">
              {course.progress > 0 ? 'RESUME LINK' : 'INITIATE'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}