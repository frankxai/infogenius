
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { GeneratedAsset, ComplexityLevel, VisualStyle, Language, SearchResultItem, AspectRatio } from './types';
import { 
  researchTopicForPrompt, 
  generateInfographicImage, 
  generateInfographicVideo,
  generateNarration
} from './services/geminiService';
import Infographic from './components/Infographic';
import Loading from './components/Loading';
import IntroScreen from './components/IntroScreen';
import SearchResults from './components/SearchResults';
import { 
  Search, AlertCircle, History, GraduationCap, Palette, Microscope, 
  Atom, Globe, Sun, Moon, Key, CreditCard, ExternalLink, 
  Video, Mic, Layers, Download, Plus, Zap
} from 'lucide-react';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [topic, setTopic] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [complexityLevel, setComplexityLevel] = useState<ComplexityLevel>('High School');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('Default');
  const [language, setLanguage] = useState<Language>('English');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [loadingFacts, setLoadingFacts] = useState<string[]>([]);
  
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSearchResults, setCurrentSearchResults] = useState<SearchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
      setError(null);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    if (!hasApiKey && window.aistudio?.openSelectKey) {
        await handleSelectKey();
        return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep(1);
    setLoadingMessage("Grounding: Extracting domain intelligence...");

    try {
      const research = await researchTopicForPrompt(topic, complexityLevel, visualStyle, language, aspectRatio);
      setLoadingFacts(research.facts);
      setCurrentSearchResults(research.searchResults);
      
      setLoadingStep(2);
      setLoadingMessage("Synthesis: Architecting visual layout...");
      await new Promise(r => setTimeout(r, 800));

      setLoadingStep(3);
      setLoadingMessage("Visualization: Projecting neural imagery...");
      const imageData = await generateInfographicImage(research.imagePrompt, aspectRatio);

      const newAsset: GeneratedAsset = {
        id: Date.now().toString(),
        data: imageData,
        prompt: topic,
        timestamp: Date.now(),
        level: complexityLevel,
        style: visualStyle,
        language,
        aspectRatio,
        facts: research.facts
      };

      setAssets([newAsset, ...assets]);
      setCurrentIndex(0);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("permission") || err.message?.includes("403")) {
          setError("Permission Denied: Please select a PAID project API key via the Key icon below.");
          setHasApiKey(false);
      } else {
          setError(err.message || "Engine failure. Check API key/billing.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimate = async () => {
    const asset = assets[currentIndex];
    if (asset.videoUrl || isLoading) return;

    setIsLoading(true);
    setLoadingStep(3);
    setLoadingMessage("Motion Synthesis: Rendering cinematic sequence...");
    
    try {
      const research = await researchTopicForPrompt(asset.prompt, asset.level, asset.style, asset.language, asset.aspectRatio);
      const videoUrl = await generateInfographicVideo(research.videoPrompt, asset.aspectRatio);
      
      const updatedAssets = [...assets];
      updatedAssets[currentIndex] = { ...asset, videoUrl };
      setAssets(updatedAssets);
    } catch (err: any) {
      setError("Video failed. Ensure you have a paid project selected.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNarrate = async () => {
    const asset = assets[currentIndex];
    if (asset.audioUrl || isLoading) return;
    setIsLoading(true);
    setLoadingMessage("Vocal Synthesis: Projecting audio narration...");
    try {
      const audioUrl = await generateNarration(asset.facts);
      const updatedAssets = [...assets];
      updatedAssets[currentIndex] = { ...asset, audioUrl };
      setAssets(updatedAssets);
    } catch (err) {
      setError("Narration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans overflow-hidden">
      {!hasApiKey && !showIntro && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 text-center">
            <div className="max-w-sm bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-amber-500/50 shadow-2xl space-y-6">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto">
                    <Key className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">API Key Required</h3>
                <p className="text-sm text-slate-500">Gemini 3 Pro & Veo require a <b>Paid Google Cloud Project</b> key. Free keys will result in 403 errors.</p>
                <button onClick={handleSelectKey} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all">
                    Select Paid Key
                </button>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block text-xs text-cyan-600 hover:underline">About Billing</a>
            </div>
        </div>
      )}

      {/* Workspace Sidebar */}
      <aside className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 flex flex-col z-50">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-500 fill-current" />
            <span className="font-display font-bold text-xl tracking-tight dark:text-white">Studio</span>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">History</div>
          {assets.map((asset, idx) => (
            <button 
              key={asset.id} 
              onClick={() => setCurrentIndex(idx)}
              className={`w-full group flex items-center gap-3 p-3 rounded-xl transition-all border ${currentIndex === idx ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0">
                <img src={asset.data} className="w-full h-full object-cover" />
              </div>
              <div className="text-left truncate">
                <p className="text-xs font-bold dark:text-slate-200 truncate">{asset.prompt}</p>
                <p className="text-[10px] text-slate-500">{asset.aspectRatio}</p>
              </div>
            </button>
          ))}
          {!assets.length && <div className="text-center py-12 text-slate-500 text-xs italic">No projects yet</div>}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/5">
           <button onClick={handleSelectKey} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-cyan-500 transition-colors">
              <Key className="w-3.5 h-3.5" /> {hasApiKey ? "Change API Key" : "Select API Key"}
           </button>
        </div>
      </aside>

      {/* Main Studio Area */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
        
        <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex items-center px-8 justify-between z-40">
           <div className="flex items-center gap-6">
              <h2 className="text-sm font-bold dark:text-white truncate max-w-xs">{assets[currentIndex]?.prompt || "New Visual Project"}</h2>
           </div>
           <div className="flex items-center gap-3">
              <button disabled={!assets[currentIndex] || isLoading} onClick={handleNarrate} title="Narrate with AI" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-cyan-500 disabled:opacity-30">
                <Mic className="w-4 h-4" />
              </button>
              <button disabled={!assets[currentIndex] || isLoading} onClick={handleAnimate} title="Animate with Veo" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-cyan-500 disabled:opacity-30">
                <Video className="w-4 h-4" />
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center custom-scrollbar">
          {isLoading ? (
            <Loading status={loadingMessage} step={loadingStep} facts={loadingFacts} />
          ) : assets.length > 0 ? (
            <div className="w-full max-w-5xl space-y-12 pb-24">
               <Infographic image={assets[currentIndex]} onEdit={() => {}} isEditing={false} />
               <SearchResults results={currentSearchResults} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-500">
                  <Plus className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-display font-bold dark:text-white">Start your first research visual</h3>
               <p className="text-slate-500 max-w-sm">Enter a topic below and choose your aesthetic to begin.</p>
            </div>
          )}
        </div>

        {/* Input Dock */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-50">
          <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900 shadow-2xl rounded-[2rem] border border-slate-200 dark:border-white/10 p-2 flex flex-col gap-2">
            <div className="flex flex-1 items-center px-4">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                value={topic} 
                onChange={e => setTopic(e.target.value)}
                placeholder="Topic for research..." 
                className="w-full bg-transparent border-none outline-none font-medium py-3 text-slate-800 dark:text-white"
              />
            </div>
            
            <div className="flex items-center justify-between gap-2 p-1 border-t border-slate-100 dark:border-white/5 pt-2">
               <div className="flex gap-2">
                   <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as any)} className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold px-3 py-2 rounded-xl border-none">
                     <option value="16:9">16:9</option>
                     <option value="9:16">9:16</option>
                     <option value="1:1">1:1</option>
                   </select>
                   <select value={complexityLevel} onChange={e => setComplexityLevel(e.target.value as any)} className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold px-3 py-2 rounded-xl border-none">
                     <option value="Elementary">Kids</option>
                     <option value="High School">General</option>
                     <option value="College">Academic</option>
                     <option value="Expert">Technical</option>
                   </select>
                   <select value={visualStyle} onChange={e => setVisualStyle(e.target.value as any)} className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold px-3 py-2 rounded-xl border-none">
                     <option value="Default">Modern Science</option>
                     <option value="Minimalist">Minimalist</option>
                     <option value="Realistic">Realistic</option>
                     <option value="Vintage">Vintage</option>
                     <option value="Futuristic">Futuristic</option>
                     <option value="3D Render">3D Render</option>
                     <option value="Sketch">Technical Sketch</option>
                   </select>
               </div>
               
               <button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all active:scale-95">
                 <Zap className="w-4 h-4 fill-current" /> GENERATE
               </button>
            </div>
          </form>
          {error && <p className="mt-4 text-center text-red-500 text-[10px] font-bold animate-pulse px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default App;
