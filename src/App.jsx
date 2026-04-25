import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- IMPORT COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- IMPORT PAGES ---
import Landing from './pages/Landing';
import AuthBridge from './pages/AuthBridge';

// --- IMPORT APPS ---
import StudyDashboard from './apps/lms/StudyDashboard'; // Ensure you extract StudyDashboard to this file
import LearnViewer from './apps/lms/LearnViewer';       // Ensure you extract LearnViewer to this file
import Workspace from './apps/workspace/Workspace';
import NotesViewer from './apps/lms/NotesViewer';

// --- GLOBAL LAYOUT WRAPPER ---
function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen relative bg-[#030308] text-white selection:bg-[#00f0ff]/30">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// --- MAIN ROUTER ---
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Hero Page */}
          <Route path="/" element={<Landing />} />
          
          {/* Auth Bridge */}
          <Route path="/auth-bridge" element={<AuthBridge />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<StudyDashboard />} />
          <Route path="/learn/:category/:id" element={<LearnViewer />} />
          <Route path="/workspace/:pathId/:lessonId" element={<Workspace />} />
          
          {/* Fallback Login Route */}
          <Route path="/login" element={
            <div className="flex-1 flex items-center justify-center w-full bg-[#030308]">
              <div className="text-center p-12 bg-[#0a0a0f] border border-red-500/30 rounded-2xl max-w-lg w-full mx-4 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                <h2 className="text-3xl font-orbitron font-bold mb-4 uppercase tracking-widest text-white">Connection Severed</h2>
                <p className="text-slate-400 mb-10 font-bold tracking-wider text-sm">Secure session token missing. Please authenticate via the main portal.</p>
                <a href="https://ialksng.me/login" className="block w-full py-4 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                  RE-ESTABLISH LINK
                </a>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}