import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Cpu, Terminal, ArrowLeft } from 'lucide-react';
import NotesViewer from './NotesViewer';

export default function LearnViewer() {
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
        console.error("LearnViewer Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductMetadata();
  }, [id, navigate, API]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#00f0ff] bg-[#030308] min-h-screen w-full">
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#030308] min-h-screen w-full">
        <div className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
           <Terminal size={64} />
        </div>
        <h2 className="text-3xl font-orbitron font-bold mb-4 text-white uppercase tracking-widest">Access Denied</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto font-bold tracking-wide text-sm">{error}</p>
        <div className="flex gap-4 justify-center">
          <a href="https://ialksng.me/store" className="px-8 py-3 bg-[#ef4444]/20 border border-red-500 text-red-400 font-bold rounded-xl hover:bg-[#ef4444]/40 transition-all tracking-widest uppercase text-sm">Return to Base</a>
        </div>
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