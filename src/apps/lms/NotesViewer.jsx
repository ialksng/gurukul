import React, { useState, useEffect } from 'react';
import { ExternalLink, Loader2, Database, Zap, CheckCircle2, BotMessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import NotionRenderer from './NotionRenderer'; // Import the renderer you copied

export default function NotesViewer({ title, notionUrl, productId }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const [error, setError] = useState(null);

    const API = import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

    // Fetch Notion Content via your Backend
    useEffect(() => {
        const fetchNotionContent = async () => {
            if (!notionUrl) return;
            
            try {
                setIsLoading(true);
                const response = await fetch(`${API}/api/lms/notion-content`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notionUrl })
                });

                if (!response.ok) throw new Error("Failed to load notes content");
                
                const data = await response.json();
                setBlocks(data.blocks || []);
            } catch (err) {
                console.error(err);
                setError("Could not load the document. Ensure the Notion page is published or shared with your Notion integration.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotionContent();
    }, [notionUrl, API]);

    // ⚡ Save to SmartSphere
    const handleSaveToSmartSphere = async () => {
        setIsSaving(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API}/api/smartsphere/vault`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    title: `Gurukul Notes: ${title}`,
                    sourceUrl: notionUrl,
                    type: "notes",
                    projectId: "default" 
                })
            });

            if (res.ok) {
                setIsSaved(true);
                toast.success(
                    <div className="flex flex-col gap-1">
                        <span className="font-bold">Saved to SmartSphere! ⚡</span>
                        <span className="text-xs">Indra can now access this via your vault.</span>
                    </div>,
                    { duration: 4000, position: 'bottom-right' }
                );
            } else { throw new Error("Failed to sync"); }
        } catch (error) {
            toast.error("Could not save to SmartSphere.");
        } finally {
            setIsSaving(false);
        }
    };

    // 🤖 Ask Indra
    const handleAskIndra = () => {
        window.postMessage({ type: 'OPEN_INDRA_WIDGET' }, '*');
        setTimeout(() => {
            window.postMessage({ 
                type: 'PREFILL_INDRA', 
                payload: `I have a doubt about the "${title}" notes I'm reading.` 
            }, '*');
        }, 400); 
    };

    if (!notionUrl) return <div className="p-8 text-center text-white mt-10">Link not added yet.</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] w-full bg-[#0f172a] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
            
            {/* Header Toolbar */}
            <div className="bg-black/40 backdrop-blur-md p-3 md:px-6 flex flex-wrap gap-4 justify-between items-center border-b border-white/5 z-20">
                <div className="flex items-center gap-3">
                    <span className="text-slate-200 font-bold tracking-wide">{title}</span>
                    <a href={notionUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors bg-white/5 px-3 py-1.5 rounded-full">
                        View Original <ExternalLink size={14} />
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleAskIndra}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-bold text-sm transition-all"
                    >
                        <BotMessageSquare size={16} className="text-amber-400" />
                        Ask Indra
                    </button>

                    <button 
                        onClick={handleSaveToSmartSphere}
                        disabled={isSaving || isSaved}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg ${isSaved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-black hover:scale-105'}`}
                    >
                        {isSaving ? <><Loader2 size={16} className="animate-spin" /> Syncing...</> : isSaved ? <><CheckCircle2 size={16} /> Saved to Vault</> : <><Database size={16} /> Save to SmartSphere</>}
                    </button>
                </div>
            </div>

            {/* Notes Content */}
            <div className="relative flex-1 w-full bg-[#0f172a] overflow-y-auto p-6 md:p-12">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0f172a] text-amber-500">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-bold tracking-widest uppercase">Fetching Document Natively...</p>
                    </div>
                )}
                
                {!isLoading && error && (
                    <div className="text-red-400 text-center mt-10 p-4 border border-red-500/30 bg-red-500/10 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Render Native React Components */}
                {!isLoading && !error && (
                    <NotionRenderer content={blocks} />
                )}
            </div>
        </div>
    );
}