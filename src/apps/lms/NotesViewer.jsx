// File: src/apps/lms/NotesViewer.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Database, CheckCircle2, BotMessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify'; 
import './NotesViewer.css'; // Importing the new CSS

export default function NotesViewer({ title, productId }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [htmlContent, setHtmlContent] = useState(null);
    const [error, setError] = useState(null);
    
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
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Access Denied");
                }

                const rawHtml = await response.text();

                // MAGIC CONFIGURATION: 
                // FORCE_BODY and ADD_TAGS ensure Proton's inline <style> tags survive the purification
                const cleanHtml = DOMPurify.sanitize(rawHtml, {
                    FORCE_BODY: true,
                    ADD_TAGS: ['style', 'iframe'],
                    ALLOWED_ATTR: ['style', 'class', 'width', 'height', 'data-license-tracker', 'src', 'alt', 'href', 'id', 'align', 'valign'] 
                });

                setHtmlContent(cleanHtml);
            } catch (err) {
                console.error(err);
                setError(err.message || "Could not load the secure document. Please verify your purchase.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSecureContent();
    }, [productId, API]);

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
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/api/smartsphere/vault`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: `Gurukul Notes: ${title}`,
                    productId: productId, 
                    type: "notes",
                    projectId: "default" 
                })
            });

            if (!res.ok) throw new Error("Failed to save");

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
        <div className="nv-container">
            
            <div className="nv-header">
                <div className="nv-title">
                    <span>{title}</span>
                </div>

                <div className="nv-actions">
                    <button onClick={handleAskIndra} className="nv-btn nv-btn-indra">
                        <BotMessageSquare size={16} className="icon" />
                        Ask Indra
                    </button>

                    <button 
                        onClick={handleSaveToSmartSphere} 
                        disabled={isSaving || isSaved} 
                        className={`nv-btn ${isSaved ? 'nv-btn-saved' : 'nv-btn-save'}`}
                    >
                        {isSaving ? (
                            <><Loader2 size={16} className="spin-icon" /> Syncing...</>
                        ) : isSaved ? (
                            <><CheckCircle2 size={16} /> Saved to Vault</>
                        ) : (
                            <><Database size={16} /> Save to SmartSphere</>
                        )}
                    </button>
                </div>
            </div>

            <div className="nv-content-wrapper" ref={containerRef}>
                {isLoading && (
                    <div className="nv-loader-overlay">
                        <Loader2 size={40} className="spin-icon" />
                        <p className="nv-loader-text">Decrypting Content...</p>
                    </div>
                )}
                
                {!isLoading && error && (
                    <div className="nv-error-box">
                        <p>{error}</p>
                    </div>
                )}

                {!isLoading && !error && htmlContent && (
                    <div className="proton-doc-container">
                        <div 
                            className="proton-doc" 
                            dangerouslySetInnerHTML={{ __html: htmlContent }} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}