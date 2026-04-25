import React, { useState } from 'react';
import { Database, Cloud, HardDrive, X, Loader2, FolderKey, FileText } from 'lucide-react';
import apiClient from '../services/apiClient';

export default function SmartSphereSaveModal({ isOpen, onClose, content, defaultFilename, defaultType = 'file' }) {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState(null); // 'vault', 'gdrive', 'onedrive'
  const [filename, setFilename] = useState(defaultFilename || 'Gurukul_Note.txt');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (destination === 'vault') {
        // Saving to SmartSphere Local Database (Insight Model)
        await apiClient.post('/api/v1/smartsphere/dochub/file', {
          filename,
          content,
          folderId: null 
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        // Cloud Integration Route (Google Drive / OneDrive)
        // Ensure you have a corresponding route in your cloud.routes.js to handle direct uploads
        await apiClient.post('/api/v1/smartsphere/cloud/upload-text', {
          filename,
          content,
          targetCloud: destination 
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      // Reset and close on success
      setTimeout(() => {
        setIsSaving(false);
        setStep(1);
        onClose(true); // pass true to indicate success
      }, 500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to sync with SmartSphere.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030308]/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="glass-panel border border-[#00f0ff]/30 rounded-2xl w-full max-w-lg shadow-[0_0_30px_rgba(0,240,255,0.15)] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center">
              <Database size={16} className="text-[#00f0ff]" />
            </div>
            <h3 className="font-orbitron font-bold text-lg tracking-widest text-white uppercase">Save to SmartSphere</h3>
          </div>
          <button onClick={() => onClose(false)} className="text-slate-400 hover:text-red-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-bold tracking-widest text-center">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in">
              <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-4 text-center">Select Storage Destination</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vault Option */}
                <button 
                  onClick={() => { setDestination('vault'); setStep(2); }}
                  className="flex flex-col items-center p-6 border border-[#00f0ff]/30 rounded-xl bg-[#00f0ff]/5 hover:bg-[#00f0ff]/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all group"
                >
                  <HardDrive size={32} className="text-[#00f0ff] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-orbitron font-bold text-white tracking-widest text-sm uppercase">Local Vault</span>
                  <span className="text-xs text-slate-500 mt-1">SmartSphere Encrypted DB</span>
                </button>

                {/* Cloud Option */}
                <button 
                  onClick={() => { setDestination('gdrive'); setStep(2); }} // Defaulting to GDrive for this example
                  className="flex flex-col items-center p-6 border border-[#b026ff]/30 rounded-xl bg-[#b026ff]/5 hover:bg-[#b026ff]/10 hover:shadow-[0_0_15px_rgba(176,38,255,0.2)] transition-all group"
                >
                  <Cloud size={32} className="text-[#b026ff] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-orbitron font-bold text-white tracking-widest text-sm uppercase">CloudHub</span>
                  <span className="text-xs text-slate-500 mt-1">Google Drive / OneDrive</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-4 text-center">
                Configure File Details
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block flex items-center gap-2">
                    <FileText size={14} /> File Name
                  </label>
                  <input 
                    type="text" 
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full bg-[#050508] border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
                  />
                </div>

                <div className="p-4 bg-black/30 border border-white/5 rounded-lg flex items-start gap-3">
                  <FolderKey size={18} className={destination === 'vault' ? 'text-[#00f0ff]' : 'text-[#b026ff]'} />
                  <div>
                    <span className="block text-xs font-bold text-slate-300 uppercase tracking-widest">
                      Destination: {destination === 'vault' ? 'SmartSphere Local Vault' : 'CloudHub Remote Storage'}
                    </span>
                    <span className="block text-xs text-slate-500 mt-1">
                      File will be saved to the root directory.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setStep(1)}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold tracking-widest uppercase rounded-lg transition-all text-xs"
                >
                  Back
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving || !filename}
                  className="flex-1 py-3 bg-[#00f0ff]/10 hover:bg-[#00f0ff] border border-[#00f0ff] text-[#00f0ff] hover:text-black font-bold tracking-widest uppercase rounded-lg transition-all text-xs flex justify-center items-center gap-2"
                >
                  {isSaving ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : 'Confirm Save'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}