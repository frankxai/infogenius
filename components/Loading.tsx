
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { BrainCircuit, Globe, Microscope, Atom, Cpu, Network } from 'lucide-react';

interface LoadingProps {
  status: string;
  step: number;
  facts?: string[];
}

const Loading: React.FC<LoadingProps> = ({ status, step, facts = [] }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  
  useEffect(() => {
    if (facts.length > 0) {
      const interval = setInterval(() => {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [facts]);

  const stages = [
    { name: "Grounding", icon: Globe, color: "text-amber-500" },
    { name: "Synthesis", icon: Cpu, color: "text-cyan-500" },
    { name: "Projection", icon: BrainCircuit, color: "text-purple-500" }
  ];

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto mt-8 min-h-[500px] overflow-hidden rounded-3xl bg-white/50 dark:bg-slate-900/40 border dark:border-white/10 shadow-2xl backdrop-blur-md">
      
      <style>{`
        @keyframes mesh-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes flow-line {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Orchestration Mesh Background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 800 600">
           <circle cx="400" cy="300" r="250" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" className="animate-[spin_60s_linear_infinite]" />
           <path d="M100,100 L700,500 M700,100 L100,500" stroke="currentColor" strokeWidth="0.2" />
           <circle cx="400" cy="300" r="100" fill="none" stroke="currentColor" strokeWidth="1" className="animate-[mesh-pulse_4s_ease-in-out_infinite]" />
        </svg>
      </div>

      {/* Progress Trackers */}
      <div className="flex gap-8 mb-12 relative z-20">
         {stages.map((stage, idx) => {
           const isActive = step > idx;
           const isCurrent = step === idx + 1;
           return (
             <div key={idx} className={`flex flex-col items-center gap-2 transition-all duration-700 ${isActive || isCurrent ? 'opacity-100 scale-110' : 'opacity-30 scale-90 grayscale'}`}>
                <div className={`p-4 rounded-2xl border-2 transition-all duration-500 ${isCurrent ? 'bg-white dark:bg-slate-800 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : isActive ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800'}`}>
                   <stage.icon className={`w-8 h-8 ${isCurrent ? 'animate-pulse' : ''}`} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stage.name}</span>
             </div>
           );
         })}
      </div>

      <div className="relative z-30 w-full max-w-lg bg-white/80 dark:bg-slate-950/80 p-8 rounded-[2.5rem] shadow-2xl border dark:border-white/10 text-center flex flex-col items-center min-h-[180px]">
        <div className="flex items-center gap-2 mb-6 text-cyan-600 dark:text-cyan-400">
           <Network className="w-4 h-4 animate-spin" />
           <h3 className="text-xs font-bold tracking-[0.3em] uppercase">{status}</h3>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
            {facts.length > 0 ? (
            <div key={currentFactIndex} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                <p className="text-xl text-slate-800 dark:text-slate-100 italic font-serif leading-relaxed">
                "{facts[currentFactIndex]}"
                </p>
            </div>
            ) : (
            <div className="flex items-center gap-3 text-slate-400">
                <div className="flex gap-1">
                    {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: `${i * 0.2}s`}}></div>)}
                </div>
                <span className="text-sm font-medium">Orchestrating Knowledge Base...</span>
            </div>
            )}
        </div>
        
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800/50 mt-8 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{ width: `${step * 33.3}%` }}
            />
        </div>
      </div>
    </div>
  );
};

export default Loading;
