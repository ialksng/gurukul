import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function AuthBridge() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Catch the token, productId, and category from the URL
    const token = searchParams.get('token');
    const productId = searchParams.get('productId');
    const category = searchParams.get('category') || 'course'; // Fallback to 'course' if missing

    if (token) {
      // 2. Save the token to Gurukul's local storage (This logs them in!)
      localStorage.setItem('token', token);
      
      // 3. Teleport them to the dynamic viewer
      if (productId) {
        // Will now dynamically navigate to /learn/notes/[id] or /learn/course/[id]
        navigate(`/learn/${category}/${productId}`, { replace: true });
      } else {
        // Fallback
        navigate('/dashboard', { replace: true });
      }
    } else {
      // Security fallback
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#020617] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-bold tracking-wide text-amber-400 uppercase">Securing Session...</h2>
        <p className="text-slate-400 text-sm">Preparing your learning environment</p>
      </div>
    </div>
  );
}