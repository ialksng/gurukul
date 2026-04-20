import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, LayoutDashboard, ArrowLeft, PlayCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import your new components
import AuthBridge from './pages/AuthBridge';
import NotesViewer from './apps/lms/NotesViewer';

// --- 1. YOUR EXISTING DASHBOARD ---
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

// --- 2. NEW: COURSE FETCH WRAPPER ---
// This acts as the middleman between the URL and the NotesViewer
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
          headers: { Authorization: `Bearer ${token}` }
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
        <p className="tracking-widest uppercase font-bold text-sm">Decrypting Content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020617] text-white">
        <div className="text-red-500 text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <a href="https://ialksng.me/store" className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400">
          Return to Store
        </a>
      </div>
    );
  }

  if (!product) return null;

  // Render the NotesViewer and pass the data from your database!
  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8">
      <NotesViewer 
        title={product.title} 
        notionUrl={product.notionUrl || product.fileUrl} // Mapping to whatever field holds your notes link
        productId={product._id}
      />
    </div>
  );
}


// --- 3. MAIN APP ROUTER ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Main Dashboard */}
        <Route path="/" element={<StudyDashboard />} />
        <Route path="/dashboard" element={<StudyDashboard />} />

        {/* The Magic Gatekeeper */}
        <Route path="/auth-bridge" element={<AuthBridge />} />

        {/* The Content Viewer Route */}
        <Route path="/learn/:id" element={<LearnViewer />} />

        {/* Fallback Login Route (If they land on Gurukul logged out) */}
        <Route path="/login" element={
          <div className="h-screen flex items-center justify-center bg-[#020617] text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Please log in to your account</h2>
              <a href="https://ialksng.me/login" className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg">
                Go to Main Login
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}