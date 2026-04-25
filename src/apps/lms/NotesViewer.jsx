import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Database, CheckCircle2, BotMessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify'; 
import apiClient from '../../services/apiClient'; 

export default function NotesViewer({ title, productId }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [htmlContent, setHtmlContent] = useState(null);
    const [error, setError] = useState(null);
    
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchSecureContent = async () => {
            if (!productId) return;
            try {
                setIsLoading(true);
                const response = await apiClient.get(`/api/notes/secure/${productId}`, {
                    responseType: 'text'
                });

                const cleanHtml = DOMPurify.sanitize(response.data, {
                    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'div', 'span', 'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'style'],
                    ALLOWED_ATTR: ['href', 'src', 'style', 'class', 'data-license-tracker'] 
                });

                setHtmlContent(cleanHtml);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Could not load the secure document. Please verify your purchase.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSecureContent();
    }, [productId]);

    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault(); 
        
        const handleCopy = (e) => {
            e.preventDefault();
            e.clipboardData.setData('text/plain', `Unauthorized copy. Content protected and licensed by ialksng.me.`);
            toast.error("Copying is disabled for premium notes.");
        };

        const handleKeyDown = (e) => {
            if (
                (e.ctrlKey && ['p', 's', 'c'].includes(e.key.toLowerCase())) || 
                e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
            ) {
                e.preventDefault();
                toast.error("Action restricted for security purposes.");
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleSaveToSmartSphere = async () => {
        setIsSaving(true);
        try {
            await apiClient.post(`/api/smartsphere/vault`, {
                title: `Gurukul Notes: ${title}`,
                productId: productId, 
                type: "notes",
                projectId: "default" 
            });
            setIsSaved(true);
            toast.success("Saved to SmartSphere! ⚡");
        } catch (error) {
            toast.error("Could not save to SmartSphere.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAskIndra = () => {
        window.postMessage({ type: 'OPEN_INDRA_WIDGET' }, '*');
        setTimeout(() => window.postMessage({ type: 'PREFILL_INDRA', payload: `I have a doubt about the "${title}" notes.` }, '*'), 400); 
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] w-full bg-[#0f172a] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative select-none">
            
            <style>
                {`
                    @media print {
                        body { display: none !important; }
                    }
                    .secure-content-wrapper ::selection { background: rgba(255,0,0,0.1); color: inherit; }
                    .secure-content-wrapper img { pointer-events: none; } 
                `}
            </style>

            <div className="bg-black/40 backdrop-blur-md p-3 md:px-6 flex flex-wrap gap-4 justify-between items-center border-b border-white/5 z-20">
                <div className="flex items-center gap-3">
                    <span className="text-slate-200 font-bold tracking-wide">{title}</span>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={handleAskIndra} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-bold text-sm transition-all">
                        <BotMessageSquare size={16} className="text-amber-400" />
                        Ask Indra
                    </button>

                    <button onClick={handleSaveToSmartSphere} disabled={isSaving || isSaved} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg ${isSaved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-black hover:scale-105'}`}>
                        {isSaving ? <><Loader2 size={16} className="animate-spin" /> Syncing...</> : isSaved ? <><CheckCircle2 size={16} /> Saved to Vault</> : <><Database size={16} /> Save to SmartSphere</>}
                    </button>
                </div>
            </div>

            <div className="relative flex-1 w-full bg-white text-black overflow-y-auto p-6 md:p-12 secure-content-wrapper" ref={containerRef}>
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0f172a] text-amber-500">
                        <Loader2 size={40} className="animate-spin mb-4" />
                        <p className="text-sm font-bold tracking-widest uppercase">Decrypting Content...</p>
                    </div>
                )}
                
                {!isLoading && error && (
                    <div className="text-red-400 text-center mt-10 p-4 border border-red-500/30 bg-[#0f172a] rounded-lg h-full flex flex-col justify-center">
                        <p className="font-bold text-xl">{error}</p>
                    </div>
                )}

                {!isLoading && !error && htmlContent && (
                    <div 
                        className="max-w-4xl mx-auto prose prose-lg" 
                        dangerouslySetInnerHTML={{ __html: htmlContent }} 
                    />
                )}
            </div>
        </div>
    );
}