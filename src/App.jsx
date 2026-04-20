import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, LayoutDashboard, ArrowLeft, PlayCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import your components
import AuthBridge from './pages/AuthBridge';
import NotesViewer from './apps/lms/NotesViewer';

// --- 1. DASHBOARD ---
function StudyDashboard() {
  const [courses] = useState([
    { id: 1, title: 'Advanced Algorithms', progress: 75, totalModules: 12 },
    { id: 2, title: 'System Design', progress: 30, totalModules: 8 },
    { id: 3, title: 'Machine Learning', progress: 0, totalModules: 15 }
  ]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      <div className="w-64 bg-slate-900 border-r border-white/10 p-4 flex flex-col">
        <div className="flex items-center gap-3 font-bold text-xl mb-8 text-amber-400">
          <GraduationCap size={28} />
          Gurukul
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <BookOpen size={20} /> My Courses
          </button>
        </nav>
        <a href="https://ialksng.me/store" className="flex items-center gap-2 text-gray-400 hover:text-amber-400 p-4 transition-colors">
          <ArrowLeft size={18} /> Back to Store
        </a>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome to Gurukul</h1>
          <p className="text-gray-400 mb-8">Pick up where you left off.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-colors">
                <div className="h-32 bg-black/40 rounded-xl mb-4 flex items-center justify-center">
                  <PlayCircle size={40} className="text-amber-500 opacity-50" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{course.totalModules} Modules</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-400 font-medium">{course.progress}% Complete</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all" 
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

// --- 2. SECURE LEARNING VIEWER ---
function LearnViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

  useEffect(() => {
    const fetchSecureContent = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${API}/api/products/access/secure/${id}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load content");
        }

        setProduct(data.data);
      } catch (err) {
        console.error("Access error:", err);
        setError("Access Denied. You must purchase this item to view it.");
      } finally {
        setLoading(false);
      }
    };

    fetchSecureContent();
  }, [id, navigate, API]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020617] text-amber-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="tracking-widest uppercase font-bold text-sm">Verifying Access...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020617] text-white">
        <div className="text-red-500 text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <a href="https://ialksng.me/store" className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors">
          Return to Store
        </a>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <button 
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-amber-400 transition-colors"
        >
            <ArrowLeft size={16} /> Back to Dashboard
        </button>
        
        <NotesViewer 
          title={product.title} 
          notionUrl={product.notionUrl || product.fileUrl} 
          productId={product._id}
        />
      </div>
    </div>
  );
}


// --- 3. MAIN ROUTER ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudyDashboard />} />
        <Route path="/dashboard" element={<StudyDashboard />} />
        <Route path="/auth-bridge" element={<AuthBridge />} />
        <Route path="/learn/:id" element={<LearnViewer />} />
        
        <Route path="/login" element={
          <div className="h-screen flex items-center justify-center bg-[#020617] text-white">
            <div className="text-center">
              <div className="text-amber-500 text-6xl mb-4 mx-auto w-fit">⚠️</div>
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Please return to the main portal to log in and access your educational content.</p>
              <a href="https://ialksng.me/login" className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors">
                Go to Main Login
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}