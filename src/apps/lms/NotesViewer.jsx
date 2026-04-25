import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Database, BotMessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify'; 

// IMPORT THE MODAL
import SmartSphereSaveModal from '../../components/SmartSphereSaveModal';

export default function NotesViewer({ title, productId }) {
    const [isLoading, setIsLoading] = useState(true);
    const [htmlContent, setHtmlContent] = useState(null);
    const [error, setError] = useState(null);
    
    // MODAL STATE
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    
    const containerRef = useRef(null);
    const API = import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

    useEffect(() => {
        const fetchSecureContent = async () => {
            if (!productId) return;
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");

                const response = await fetch(`${API}/api/notes/secure/${productId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Access Denied");
                }

                const rawHtml = await response.text();

                const cleanHtml = DOMPurify.sanitize(rawHtml, {
                    FORCE_BODY: true,
                    ADD_TAGS: ['style'],
                    ALLOWED_TAGS: [
                        'b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                        'ul', 'ol', 'li', 'div', 'span', 'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 
                        'style', 'br', 'hr', 'blockquote', 'pre', 'code', 'u', 's'
                    ],
                    ALLOWED_ATTR: [
                        'href', 'src', 'style', 'class', 'data-license-tracker', 
                        'width', 'height', 'alt', 'id', 'align', 'valign'
                    ] 
                });

                setHtmlContent(cleanHtml);
            } catch (err) {
                console.error(err);
                setError(err.message || "Could not load the secure document.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSecureContent();
    }, [productId, API]);

    // Anti-Piracy Event Listeners
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault(); 
        
        const handleCopy = (e) => {
            e.preventDefault();
            e.clipboardData.setData('text/plain', `Unauthorized copy. Content protected and licensed by IALKSNG.ME.`);
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

    const handleAskIndra = () => {
        window.postMessage({ type: 'OPEN_INDRA_WIDGET' }, '*');
        setTimeout(() => window.postMessage({ type: 'PREFILL_INDRA', payload: `I have a doubt about the "${title}" notes.` }, '*'), 400); 
    };

    // Helper to extract clean text from the HTML for the Vault
    const extractPlainText = (html) => {
        if (!html) return "";
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    };

    return (
        <>
            <div className="flex flex-col h-[calc(100vh-160px)] w-full glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative select-none">
                
                {/* TOOLBAR */}
                <div className="bg-[#050508]/90 backdrop-blur-xl p-4 flex flex-wrap gap-4 justify-between items-center border-b border-white/5 z-20">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
                        <span className="text-slate-200 font-orbitron font-bold tracking-widest uppercase">{title}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleAskIndra} 
                            className="flex items-center gap-2 px-5 py-2 bg-[#b026ff]/10 hover:bg-[#b026ff]/20 text-[#b026ff] border border-[#b026ff]/30 rounded-lg font-bold font-orbitron tracking-widest text-xs uppercase transition-all"
                        >
                            <BotMessageSquare size={16} />
                            Ask Indra
                        </button>

                        {/* TRIGGER MODAL */}
                        <button 
                            onClick={() => setIsSaveModalOpen(true)} 
                            className="flex items-center gap-2 px-5 py-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff] border border-[#00f0ff] text-[#00f0ff] hover:text-black font-bold font-orbitron tracking-widest text-xs uppercase rounded-lg transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                        >
                            <Database size={16} /> Save to SmartSphere
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="relative flex-1 w-full bg-[#cbd5e1] text-black overflow-y-auto p-6 md:p-12" ref={containerRef}>
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#030308] text-[#00f0ff]">
                            <Loader2 size={40} className="animate-spin mb-4 drop-shadow-[0_0_10px_#00f0ff]" />
                            <p className="text-sm font-bold font-orbitron tracking-widest uppercase">Decrypting Data Core...</p>
                        </div>
                    )}
                    
                    {!isLoading && error && (
                        <div className="text-red-400 text-center mt-10 p-6 border border-red-500/30 bg-[#0f172a] rounded-xl h-full flex flex-col justify-center max-w-2xl mx-auto shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                            <p className="font-bold text-xl font-orbitron tracking-widest uppercase">{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && htmlContent && (
                        <div className="bg-white max-w-[850px] mx-auto p-12 md:p-16 rounded shadow-2xl">
                            <div 
                                className="proton-doc" 
                                dangerouslySetInnerHTML={{ __html: htmlContent }} 
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* RENDER THE MODAL COMPONENT */}
            <SmartSphereSaveModal 
                isOpen={isSaveModalOpen} 
                onClose={(success) => {
                    setIsSaveModalOpen(false);
                    if (success) toast.success("Saved successfully to SmartSphere!");
                }} 
                content={extractPlainText(htmlContent)} 
                defaultFilename={`Gurukul_Note_${title.replace(/\s+/g, '_')}.txt`}
            />
        </>
    );
}