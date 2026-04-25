import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { Play, BrainCircuit, Save, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';

export default function Workspace() {
  const { pathId, lessonId } = useParams();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState(null);
  const [code, setCode] = useState("// Loading environment...");
  const [output, setOutput] = useState("Awaiting execution...");
  const [isExecuting, setIsExecuting] = useState(false);

  // Fetch lesson data (Mocked for this example, connect to your GET /path endpoint)
  useEffect(() => {
    // Replace with real fetch using pathId
    setLesson({
      title: "Introduction to Python Variables",
      content: "Variables are containers for storing data values.\n\nIn Python, a variable is created the moment you first assign a value to it.\n\n```python\nx = 5\ny = 'Hello'\n```",
      task: "Create a variable named 'hero' and assign the value 'Indra' to it. Print it.",
      codeSnippet: "# Write your code below\n"
    });
    setCode("# Write your code below\n");
  }, [pathId, lessonId]);

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput("Compiling and executing in secure sandbox...");
    try {
      // Points to the newly created backend route
      const res = await apiClient.post('/api/v1/gurukul/code/run', {
        sourceCode: code,
        languageId: 71 // 71 is Python in Judge0
      });
      setOutput(res.data.output || res.data.error || "Program exited with code 0.");
    } catch (err) {
      setOutput("Error connecting to execution sandbox.");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSaveToSmartSphere = async () => {
    // Trigger save to Vault
    alert("Snippet saved to SmartSphere Vault!");
  };

  if (!lesson) return <div className="text-white p-8">Loading Secure Environment...</div>;

  return (
    <div className="flex h-[calc(100vh-80px)] w-full bg-[#030308] text-white">
      
      {/* LEFT PANE: AI Lesson & Instructions */}
      <div className="w-1/2 border-r border-white/10 flex flex-col h-full bg-[#0a0a0f]/80">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-500 hover:text-[#00f0ff] uppercase transition-colors">
                <ArrowLeft size={16} /> Dashboard
            </button>
            <span className="text-xs font-bold tracking-widest text-[#b026ff] uppercase border border-[#b026ff]/30 px-3 py-1 rounded-full bg-[#b026ff]/10">
                ACTIVE MODULE
            </span>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <h2 className="text-3xl font-orbitron font-bold neon-text-cyan mb-6">{lesson.title}</h2>
          
          <div className="prose prose-invert max-w-none font-rajdhani text-lg leading-relaxed text-slate-300">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
          
          {/* Actionable Task Block */}
          <div className="mt-10 p-6 bg-[#b026ff]/10 border border-[#b026ff]/30 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#b026ff]"></div>
            <h4 className="font-bold font-orbitron tracking-widest text-[#b026ff] mb-3 flex items-center gap-2 uppercase">
              <BrainCircuit size={20}/> Mission Objective
            </h4>
            <p className="text-lg">{lesson.task}</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Code Editor & Terminal */}
      <div className="w-1/2 flex flex-col h-full">
        {/* Editor Toolbar */}
        <div className="h-14 bg-[#11111a] border-b border-white/5 flex items-center justify-between px-4">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">workspace.py</span>
            <div className="flex gap-3">
              <button onClick={handleSaveToSmartSphere} className="hover:bg-white/10 p-2 rounded-lg text-slate-400 hover:text-[#00f0ff] transition-all" title="Save to Vault">
                <Save size={18}/>
              </button>
              <button 
                onClick={handleRunCode} 
                disabled={isExecuting} 
                className="bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] px-6 py-1.5 rounded border border-[#00f0ff]/30 font-bold font-orbitron tracking-widest flex items-center gap-2 transition-all uppercase text-sm"
              >
                {isExecuting ? <Loader2 className="animate-spin" size={16}/> : <Play size={16}/>} 
                {isExecuting ? "Processing" : "Execute"}
              </button>
            </div>
        </div>

        {/* Code Editor (Monaco) */}
        <div className="flex-1 relative">
           <Editor
              height="100%"
              theme="vs-dark"
              language="python"
              value={code}
              onChange={(value) => setCode(value)}
              options={{ 
                  minimap: { enabled: false }, 
                  fontSize: 15, 
                  fontFamily: "'JetBrains Mono', monospace",
                  scrollBeyondLastLine: false,
                  padding: { top: 16 }
              }}
            />
        </div>

        {/* Terminal Output */}
        <div className="h-1/3 bg-[#050508] border-t border-white/10 p-4 overflow-y-auto flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 font-bold tracking-widest uppercase text-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Terminal Output
          </div>
          <pre className={`flex-1 font-mono text-sm whitespace-pre-wrap ${output.includes("Error") ? "text-red-400" : "text-slate-300"}`}>
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}