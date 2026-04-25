import { BrowserRouter, Routes, Route, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, GraduationCap, LayoutDashboard, ArrowLeft, PlayCircle, Loader2, Cpu, LogOut, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';
import Workspace from './apps/workspace/Workspace';
import NotesViewer from './apps/lms/NotesViewer';

// --- 1. GLOBAL COMPONENTS ---

function GlobalNavbar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = 'https://ialksng.me/login'; 
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-white/10 w-full">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg neon-border-cyan flex items-center justify-center bg-black/50 group-hover:scale-105 transition-transform">
            <Cpu className="text-[#00f0ff]" size={24} />
          </div>
          <span className="font-orbitron font-bold text-2xl tracking-widest neon-text-cyan uppercase">
            GURUKUL
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-widest text-slate-300">
          <button onClick={() => navigate('/dashboard')} className="hover:text-[#00f0ff] transition-colors flex items-center gap-2">
            <LayoutDashboard size={16}/> DASHBOARD
          </button>
          <button className="hover:text-[#00f0ff] transition-colors flex items-center gap-2">
            <Terminal size={16}/> MY MODULES
          </button>
          <a href="https://ialksng.me/store" className="hover:text-[#b026ff] transition-colors flex items-center gap-2">
            <ArrowLeft size={16}/> PORTAL
          </a>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors font-bold text-sm"
        >
          <LogOut size={18} /> <span className="hidden sm:block">DISCONNECT</span>
        </button>
      </div>
    </nav>
  );
}

function GlobalFooter() {
  return (
    <footer className="glass-panel border-t border-white/5 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold tracking-widest">
          <Cpu size={16} className="text-[#b026ff]"/> SYSTEM V2.0 // ONLINE
        </div>
        <p className="text-slate-600 text-sm">
          &copy; {new Date().getFullYear()} IALKSNG.ME SECURE NETWORK. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen relative bg-[#030308]">
      <GlobalNavbar />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      <GlobalFooter />
    </div>
  );
}


// --- 2. PUBLIC HERO LANDING PAGE ---
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden w-full">
      {/* Ambient Glowing Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f0ff]/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#b026ff]/20 blur-[120px] rounded-full pointer-events-none"></div>

      <Cpu size={80} className="text-[#00f0ff] mb-8 opacity-80" />
      <h1 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-6 tracking-wider uppercase">
        <span className="neon-text-cyan">Gurukul</span> Nexus
      </h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-rajdhani tracking-widest mb-10 leading-relaxed">
        THE NEXT-GENERATION AI LEARNING ENVIRONMENT. MASTER PROTOCOLS, EXECUTE CODE, AND UPGRADE YOUR SKILLS IN A SECURE SANDBOX.
      </p>

      <button 
        onClick={() => navigate('/dashboard')}
        className="px-10 py-4 bg-[#00f0ff]/10 border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black font-orbitron font-bold tracking-widest uppercase rounded-lg transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)]"
      >
        Initiate Sequence
      </button>
    </div>
  );
}


// --- 3. DASHBOARD ---
function StudyDashboard() {
  const [courses] = useState([
    { id: 1, title: 'Advanced Algorithms', progress: 75, totalModules: 12, type: 'CORE' },
    { id: 2, title: 'System Design Protocol', progress: 30, totalModules: 8, type: 'ARCHITECTURE' },
    { id: 3, title: 'Neural Networks', progress: 0, totalModules: 15, type: 'AI' }
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-fade-in">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="glass-panel rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden border border-white/5 hover:border-[#00f0ff]/50">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/0 to-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-[#00f0ff]/10 text-[#00f0ff] px-3 py-1 rounded-full border border-[#00f0ff]/20">
                {course.type}
              </span>
              <PlayCircle size={28} className="text-slate-600 group-hover:text-[#00f0ff] transition-colors" />
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
            
            <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold tracking-widest text-sm text-slate-300 group-hover:bg-[#00f0ff]/10 group-hover:border-[#00f0ff]/50 group-hover:text-[#00f0ff] transition-all">
              {course.progress > 0 ? 'RESUME LINK' : 'INITIATE'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4. SECURE VIEWER ---
function LearnViewer() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

  useEffect(() => {
    const fetchProductMetadata = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${API}/api/products/${id}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        
        const data = await res.json();
        const productData = data.product || data.data || data;

        if (!res.ok || !productData) {
          throw new Error("Data block corrupted or inaccessible.");
        }

        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductMetadata();
  }, [id, navigate, API]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#00f0ff]">
        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-t-2 border-[#00f0ff] animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-[#b026ff] animate-spin animate-reverse"></div>
          <Cpu size={24} className="animate-pulse" />
        </div>
        <p className="tracking-[0.3em] uppercase font-bold text-sm animate-pulse">Decrypting File Protocol...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
           <Terminal size={64} />
        </div>
        <h2 className="text-3xl font-orbitron font-bold mb-4 text-white uppercase tracking-widest">Access Denied</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto font-bold tracking-wide text-sm">{error}</p>
        <a href="https://ialksng.me/store" className="px-8 py-3 bg-[#ef4444]/20 border border-red-500 text-red-400 font-bold rounded-xl hover:bg-[#ef4444]/40 transition-all tracking-widest uppercase text-sm">Return to Base</a>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="p-4 md:p-8 flex-1 flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-6xl">
        <button onClick={() => navigate('/dashboard')} className="mb-6 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-500 hover:text-[#00f0ff] transition-colors uppercase">
          <ArrowLeft size={16} /> Back to Hub
        </button>
        
        {category === 'notes' ? (
          <NotesViewer title={product.title} productId={product._id} />
        ) : (
          <div className="p-16 text-center glass-panel neon-border-cyan rounded-2xl flex flex-col items-center justify-center">
             <Cpu size={48} className="text-[#00f0ff] mb-6 opacity-50" />
             <h2 className="text-3xl font-orbitron font-bold mb-4 uppercase tracking-widest neon-text-cyan">Holo-Deck Coming Soon</h2>
             <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">Module [{product.title}] is currently rendering...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 5. AUTH BRIDGE ---
function AuthBridge() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const productId = searchParams.get('productId');
    const category = searchParams.get('category') || 'course';

    if (token) {
      localStorage.setItem('token', token);
      setTimeout(() => {
        if (productId) navigate(`/learn/${category}/${productId}`, { replace: true });
        else navigate('/dashboard', { replace: true });
      }, 1500); 
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full">
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <div className="absolute inset-0 rounded-full border-t-4 border-[#00f0ff] animate-spin shadow-[0_0_15px_#00f0ff]"></div>
        <div className="absolute inset-4 rounded-full border-b-4 border-[#b026ff] animate-spin shadow-[0_0_15px_#b026ff]" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <Cpu size={32} className="text-white animate-pulse" />
      </div>
      <h2 className="text-2xl font-orbitron font-bold tracking-[0.2em] neon-text-cyan uppercase mb-2">Establishing Link...</h2>
      <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Handshaking with secure servers</p>
    </div>
  );
}

// --- 6. MAIN ROUTER ---
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Default Route is now the Public Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/dashboard" element={<StudyDashboard />} />
          <Route path="/auth-bridge" element={<AuthBridge />} />
          <Route path="/learn/:category/:id" element={<LearnViewer />} />
          
          <Route path="/login" element={
            <div className="flex-1 flex items-center justify-center w-full">
              <div className="text-center p-12 glass-panel neon-border-cyan rounded-2xl max-w-lg w-full mx-4">
                <div className="text-[#00f0ff] mb-8 mx-auto w-fit drop-shadow-[0_0_15px_#00f0ff]">
                  <LogOut size={64} />
                </div>
                <h2 className="text-3xl font-orbitron font-bold mb-4 uppercase tracking-widest text-white">Connection Lost</h2>
                <p className="text-slate-400 mb-10 font-bold tracking-wider text-sm">Your secure session token is missing. Return to portal to re-authenticate.</p>
                <a href="https://ialksng.me/login" className="block w-full py-4 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                  RE-ESTABLISH LINK
                </a>
              </div>
            </div>
          } />
          
          <Route path="/workspace/:pathId/:lessonId" element={<Workspace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}