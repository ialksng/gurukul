import React, { useState } from 'react';
import { ExternalLink, Loader2, Database, Zap, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotesViewer({ title, notionUrl, productId }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // The API endpoint where SmartSphere saves RAG documents
    const API = import.meta.env.VITE_API_URL || "https://ialksng-backend.onrender.com";

    // ⚡ Magic Function: Push Notes to SmartSphere Vault
    const handleSaveToSmartSphere = async () => {
        setIsSaving(true);
        const token = localStorage.getItem("token");

        try {
            // NOTE: You will need a route on your backend like /api/smartsphere/vault to handle this.
            // We pass the title, the URL, and attach it to their default vault project.
            const res = await fetch(`${API}/api/smartsphere/vault`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: `Gurukul Notes: ${title}`,
                    sourceUrl: notionUrl,
                    type: "notes",
                    projectId: "default" // Assuming 'default' is their main SmartSphere workspace
                })
            });

            if (res.ok) {
                setIsSaved(true);
                toast.success(
                    <div className="flex flex-col gap-1">
                        <span className="font-bold">Saved to SmartSphere! ⚡</span>
                        <span className="text-xs">Indra can now answer questions about these notes.</span>
                    </div>,
                    { duration: 4000, position: 'bottom-right' }
                );
            } else {
                throw new Error("Failed to sync with vault");
            }
        } catch (error) {
            console.error("SmartSphere Sync Error:", error);
            toast.error("Could not save to SmartSphere. Try again later.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!notionUrl) {
        return (
            <div className="p-8 text-center bg-white/5 rounded-xl border border-white/10 mt-10">
                <h3 className="text-xl text-amber-400 mb-2 font-bold">Content Not Available</h3>
                <p className="text-slate-400">The link for these notes has not been uploaded yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] w-full bg-[#0f172a] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
            
            {/* Header Toolbar */}
            <div className="bg-black/40 backdrop-blur-md p-3 md:px-6 flex flex-wrap gap-4 justify-between items-center border-b border-white/5 z-20">
                
                <div className="flex items-center gap-3">
                    <span className="text-slate-200 font-bold tracking-wide">{title}</span>
                    <a 
                        href={notionUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors bg-white/5 px-3 py-1.5 rounded-full"
                    >
                        Expand <ExternalLink size={14} />
                    </a>
                </div>

                {/* The "Save to SmartSphere" Button */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSaveToSmartSphere}
                        disabled={isSaving || isSaved}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg
                            ${isSaved 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black hover:scale-105'
                            }
                        `}
                    >
                        {isSaving ? (
                            <><Loader2 size={16} className="animate-spin" /> Syncing...</>
                        ) : isSaved ? (
                            <><CheckCircle2 size={16} /> Saved to Vault</>
                        ) : (
                            <><Database size={16} /> Save to SmartSphere</>
                        )}
                    </button>
                    
                    {/* Optional Shortcut Link to open SmartSphere */}
                    {isSaved && (
                        <button 
                            onClick={() => window.open('https://smartsphere.ialksng.me', '_blank')}
                            className="p-2 bg-white/5 hover:bg-white/10 text-amber-400 rounded-lg transition-colors border border-white/10"
                            title="Open SmartSphere & Chat with Indra"
                        >
                            <Zap size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Iframe Rendering the Notes Content */}
            <div className="relative flex-1 w-full bg-white">
                {/* Loading Overlay (disappears when iframe finishes loading) */}
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#020617] text-amber-500">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-bold tracking-widest uppercase">Fetching Document...</p>
                    </div>
                )}

                <iframe 
                    src={notionUrl}
                    className={`w-full h-full border-none transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    title={title}
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
}