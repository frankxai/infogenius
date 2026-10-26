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
  generateNarration,
} from './services/geminiService';
import Infographic from './components/Infographic';
import Loading from './components/Loading';
import IntroScreen from './components/IntroScreen';
import SearchResults from './components/SearchResults';
import {
  Search,
  Sun,
  Moon,
  Key,
  ExternalLink,
  Video,
  Mic,
  Plus,
  Zap,
} from 'lucide-react';

const INITIAL_SHOWCASE_ASSETS: GeneratedAsset[] = [
  {
    id: 'showcase-1',
    data: '/showcase/agentic-creator-os.png',
    prompt: 'Agentic Creator OS: 6-Layer Closed-Loop Operating Model',
    timestamp: Date.now() - 120000,
    level: 'Expert',
    style: 'Premium',
    language: 'English',
    aspectRatio: '16:9',
    facts: [
      'Adobe 2025 Creators Toolkit survey: 86% of creators actively use generative AI across editing (55%), asset generation (52%), and ideation (48%).',
      'Six-layer closed-loop operating model: 1 Sense → 2 Strategize → 3 Create → 4 Orchestrate → 5 Approve & Publish → 6 Learn & Optimize.',
      'Separates autonomous Maker execution lanes from Independent Verifier gates and fail-closed human approval.',
    ],
  },
  {
    id: 'showcase-2',
    data: '/showcase/sovereign-ai-gateway.png',
    prompt: 'Sovereign Multi-Tenant AI Gateway Architecture',
    timestamp: Date.now() - 240000,
    level: 'College',
    style: 'Glassmorphic',
    language: 'English',
    aspectRatio: '16:9',
    facts: [
      'Request path: Tenant Application → Authenticated Gateway → Tenant-Aware Policy & DLP Controls → Sovereign Model Endpoint.',
      'Multi-tenancy isolates tenant identity, encryption keys, vector stores, caches, quotas, and audit logs.',
      'EU AI Act Article 26 requires deployer-controlled log retention for at least 6 months alongside NIST AI RMF lifecycle governance.',
    ],
  },
  {
    id: 'showcase-3',
    data: '/showcase/transformer-architecture.png',
    prompt: 'How Transformer Architecture Powers Modern AI LLMs',
    timestamp: Date.now() - 360000,
    level: 'Expert',
    style: '3D Render',
    language: 'English',
    aspectRatio: '16:9',
    facts: [
      'Self-attention exhibits O(n²d) compute complexity for QKᵀV matrix multiplications across context windows.',
      'Multi-Head Attention executes 8 to 64 parallel attention heads capturing syntactic, semantic, and long-range dependencies.',
      'Positional encodings (RoPE / sinusoidal) combine element-wise with token embeddings before stacked decoder blocks.',
    ],
  },
  {
    id: 'showcase-4',
    data: '/showcase/quantum-computing-2026.png',
    prompt: 'Quantum Computing: Mechanisms & 2026 Impact',
    timestamp: Date.now() - 480000,
    level: 'College',
    style: 'Futuristic',
    language: 'English',
    aspectRatio: '16:9',
    facts: [
      'Global quantum computing market projected to grow from USD 1.88B in 2026 to USD 19.44B by 2035 (29.73% CAGR).',
      'Princeton achieved >1ms qubit coherence (3x laboratory record and ~15x commercial processor standard).',
      'Over 50% of enterprises plan Post-Quantum Cryptography (PQC) deployment to protect against quantum decryption.',
    ],
  },
];

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [topic, setTopic] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [complexityLevel, setComplexityLevel] = useState<ComplexityLevel>('College');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('Glassmorphic');
  const [language] = useState<Language>('English');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [loadingFacts, setLoadingFacts] = useState<string[]>([]);

  const [assets, setAssets] = useState<GeneratedAsset[]>(INITIAL_SHOWCASE_ASSETS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSearchResults, setCurrentSearchResults] = useState<SearchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const saved = window.localStorage.getItem('infogenius_api_key') || '';
    if (saved) setCustomApiKey(saved);
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        setHasApiKey(Boolean(saved || process.env.API_KEY));
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
      setError(null);
    } else {
      setShowKeyModal(true);
    }
  };

  const handleSaveCustomKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (customApiKey.trim()) {
      window.localStorage.setItem('infogenius_api_key', customApiKey.trim());
      setHasApiKey(true);
      setError(null);
    } else {
      window.localStorage.removeItem('infogenius_api_key');
      setHasApiKey(Boolean(process.env.API_KEY));
    }
    setShowKeyModal(false);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    const activeKey = window.localStorage.getItem('infogenius_api_key')?.trim() || process.env.API_KEY;
    if (!activeKey && !window.aistudio?.openSelectKey) {
      setShowKeyModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep(1);
    setLoadingMessage('Grounding: Extracting domain intelligence...');

    try {
      const research = await researchTopicForPrompt(topic, complexityLevel, visualStyle, language, aspectRatio);
      setLoadingFacts(research.facts);
      setCurrentSearchResults(research.searchResults);

      setLoadingStep(2);
      setLoadingMessage('Synthesis: Architecting visual layout...');
      await new Promise((r) => setTimeout(r, 600));

      setLoadingStep(3);
      setLoadingMessage('Visualization: Projecting neural imagery...');
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
        facts: research.facts,
      };

      setAssets([newAsset, ...assets]);
      setCurrentIndex(0);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('permission') || err.message?.includes('403') || err.message?.includes('API key')) {
        setError('API Key Required: Click "Configure API Key" in the sidebar or use the Multi-Tenant Studio on frankx.ai/infogenius.');
        setShowKeyModal(true);
      } else {
        setError(err.message || 'Engine failure. Check API key/billing.');
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
    setLoadingMessage('Motion Synthesis: Rendering cinematic sequence...');

    try {
      const research = await researchTopicForPrompt(asset.prompt, asset.level, asset.style, asset.language, asset.aspectRatio);
      const videoUrl = await generateInfographicVideo(research.videoPrompt, asset.aspectRatio);

      const updatedAssets = [...assets];
      updatedAssets[currentIndex] = { ...asset, videoUrl };
      setAssets(updatedAssets);
    } catch (err: any) {
      setError('Video requires a Google AI Studio key with Veo 3.1 enabled.');
      setShowKeyModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNarrate = async () => {
    const asset = assets[currentIndex];
    if (asset.audioUrl || isLoading) return;
    setIsLoading(true);
    setLoadingMessage('Vocal Synthesis: Projecting audio narration...');
    try {
      const audioUrl = await generateNarration(asset.facts);
      const updatedAssets = [...assets];
      updatedAssets[currentIndex] = { ...asset, audioUrl };
      setAssets(updatedAssets);
    } catch (err) {
      setError('Narration requires a Google Gemini API key.');
      setShowKeyModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans overflow-hidden">
      {showKeyModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCustomKey}
            className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-cyan-500/40 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold dark:text-white">Connect Gemini API Key</h3>
                  <p className="text-xs text-slate-400">Stored locally in your browser (BYOK)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste your Google AI Studio <code className="text-cyan-400">GEMINI_API_KEY</code> to generate live 2K/4K visuals, Veo 3.1 motion loops, and Kore TTS audio, or use{' '}
              <a
                href="https://www.frankx.ai/infogenius#studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 underline font-semibold"
              >
                frankx.ai/infogenius
              </a>{' '}
              with 15 Free Managed Workspace Credits.
            </p>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="Paste GEMINI_API_KEY..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Save Key &amp; Continue
              </button>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
              >
                Get Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </form>
        </div>
      )}

      {/* Workspace Sidebar */}
      <aside className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 flex flex-col z-50">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-500 fill-current" />
            <span className="font-display font-bold text-xl tracking-tight dark:text-white">
              InfoGenius v5.2
            </span>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Verified 2K Gallery &amp; History
          </div>
          {assets.map((asset, idx) => (
            <button
              key={asset.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-full group flex items-center gap-3 p-3 rounded-xl transition-all border ${
                currentIndex === idx
                  ? 'bg-cyan-500/10 border-cyan-500/50'
                  : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0">
                <img src={asset.data} alt={asset.prompt} className="w-full h-full object-cover" />
              </div>
              <div className="text-left truncate">
                <p className="text-xs font-bold dark:text-slate-200 truncate">{asset.prompt}</p>
                <p className="text-[10px] text-cyan-400">
                  {asset.style} · {asset.aspectRatio}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-2">
          <button
            onClick={handleSelectKey}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
          >
            <Key className="w-3.5 h-3.5" /> {customApiKey ? 'BYOK Key Active' : 'Configure API Key'}
          </button>
          <a
            href="https://www.frankx.ai/infogenius"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
          >
            FrankX Multi-Tenant Studio &amp; Pro Pack <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>

      {/* Main Studio Area */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}

        <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex items-center px-8 justify-between z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold dark:text-white truncate max-w-md">
              {assets[currentIndex]?.prompt || 'New Visual Project'}
            </h2>
            {assets[currentIndex] && (
              <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                {assets[currentIndex].style} · {assets[currentIndex].level}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={!assets[currentIndex] || isLoading}
              onClick={handleNarrate}
              title="Narrate with Kore TTS"
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-cyan-400 flex items-center gap-1.5 disabled:opacity-30"
            >
              <Mic className="w-3.5 h-3.5" /> Narrate
            </button>
            <button
              disabled={!assets[currentIndex] || isLoading}
              onClick={handleAnimate}
              title="Animate with Veo 3.1"
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-cyan-400 flex items-center gap-1.5 disabled:opacity-30"
            >
              <Video className="w-3.5 h-3.5" /> Animate (Veo 3.1)
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center custom-scrollbar">
          {isLoading ? (
            <Loading status={loadingMessage} step={loadingStep} facts={loadingFacts} />
          ) : assets.length > 0 ? (
            <div className="w-full max-w-5xl space-y-8 pb-28">
              <Infographic image={assets[currentIndex]} onEdit={() => {}} isEditing={false} />
              {assets[currentIndex].facts && assets[currentIndex].facts.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Grounded Knowledge Facts Rendered in Visual
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    {assets[currentIndex].facts.map((fact, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="font-mono font-bold text-cyan-400">{i + 1}.</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <SearchResults results={currentSearchResults} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-500">
                <Plus className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-bold dark:text-white">
                Start your first research visual
              </h3>
              <p className="text-slate-500 max-w-sm">
                Enter a topic below and choose your aesthetic to begin.
              </p>
            </div>
          )}
        </div>

        {/* Input Dock */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-50">
          <form
            onSubmit={handleGenerate}
            className="bg-white dark:bg-slate-900 shadow-2xl rounded-[2rem] border border-slate-200 dark:border-white/10 p-2 flex flex-col gap-2"
          >
            <div className="flex flex-1 items-center px-4">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter any technical topic, system architecture, or concept to research & visualize..."
                className="w-full bg-transparent border-none outline-none font-medium py-3 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-1 border-t border-slate-100 dark:border-white/5 pt-2">
              <div className="flex flex-wrap gap-2">
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-2 rounded-xl border-none dark:text-white"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Vertical</option>
                  <option value="1:1">1:1 Square</option>
                </select>
                <select
                  value={complexityLevel}
                  onChange={(e) => setComplexityLevel(e.target.value as any)}
                  className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-2 rounded-xl border-none dark:text-white"
                >
                  <option value="Elementary">Elementary</option>
                  <option value="High School">High School</option>
                  <option value="College">University</option>
                  <option value="Expert">Industry Expert</option>
                </select>
                <select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value as any)}
                  className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-2 rounded-xl border-none dark:text-white"
                >
                  <option value="Glassmorphic">3D Glassmorphic (v5.2)</option>
                  <option value="Premium">Luxury Brand (v5.2)</option>
                  <option value="Default">Modern Science</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Realistic">Realistic</option>
                  <option value="Vintage">Vintage</option>
                  <option value="Futuristic">Futuristic</option>
                  <option value="3D Render">3D Render</option>
                  <option value="Sketch">Da Vinci Sketch</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all active:scale-95 text-xs"
              >
                <Zap className="w-4 h-4 fill-current" /> GENERATE 2K VISUAL
              </button>
            </div>
          </form>
          {error && (
            <p className="mt-3 text-center text-amber-300 text-xs font-semibold px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/30">
              {error}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
