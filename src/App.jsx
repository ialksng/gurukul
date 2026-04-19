import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookOpen, GraduationCap, LayoutDashboard, ArrowLeft, PlayCircle } from 'lucide-react';
import { useState } from 'react';

function StudyDashboard() {
  const [courses] = useState([
    { id: 1, title: 'Advanced Algorithms', progress: 75, totalModules: 12 },
    { id: 2, title: 'System Design', progress: 30, totalModules: 8 },
    { id: 3, title: 'Machine Learning', progress: 0, totalModules: 15 }
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <div className="w-64 bg-slate-800 border-r border-slate-700 p-4 flex flex-col">
        <div className="flex items-center gap-3 font-bold text-xl mb-8 text-emerald-400">
          <GraduationCap size={28} />
          Gurukul
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600/20 text-emerald-400 rounded-xl">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-slate-700 rounded-xl">
            <BookOpen size={20} /> My Courses
          </button>
        </nav>
        <a href="https://smartsphere.ialksng.me" className="flex items-center gap-2 text-gray-400 hover:text-white p-4">
          <ArrowLeft size={18} /> Exit to Portal
        </a>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome to Gurukul</h1>
          <p className="text-gray-400 mb-8">Pick up where you left off.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="h-32 bg-slate-700 rounded-xl mb-4 flex items-center justify-center">
                  <PlayCircle size={40} className="text-emerald-500 opacity-50" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{course.totalModules} Modules</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">{course.progress}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudyDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}