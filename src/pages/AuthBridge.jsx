import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function AuthBridge() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Catch the token and productId from the URL
    const token = searchParams.get('token');
    const productId = searchParams.get('productId');

    if (token) {
      // 2. Save the token to Gurukul's local storage (This logs them in!)
      localStorage.setItem('token', token);
      
      // 3. Teleport them to the course viewer
      if (productId) {
        // NOTE: Change '/learn/' to whatever your actual course viewer route is in Gurukul!
        navigate(`/learn/${productId}`, { replace: true });
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