/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import {
  GeneratedAsset,
  ComplexityLevel,
  VisualStyle,
  Language,
  SearchResultItem,
  AspectRatio,
  ImageResolution,
  BrandWorld,
} from './types';
import {
  researchTopicForPrompt,
  generateInfographicImage,
  generateInfographicVideo,
  generateNarration,
  buildInteractiveSvgBlueprint,
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
  Layers,
  Palette,
  CreditCard,
  Copy,
  Check,
  Download,
  Terminal,
  Code2,
  Radio,
} from 'lucide-react';

const BRAND_WORLDS: Array<{
  id: BrandWorld;
  name: string;
  shortLabel: string;
  tagline: string;
  whyBuyersPay: string;
  defaultStyle: VisualStyle;
  voidHex: string;
  primaryHex: string;
  secondaryHex: string;
  textHex: string;
  sampleTopics: string[];
}> = [
  {
    id: 'frankx',
    name: 'FrankX AI Architect',
    shortLabel: 'FrankX',
    tagline: 'Enterprise Systems · Cloud Blueprints · Da Vinci & 3D Isometric',
    whyBuyersPay:
      'CTOs, Solution Architects & Engineering Leaders use FrankX to turn complex AI/cloud architectures into board-ready 2K/4K blueprints in 18s.',
    defaultStyle: 'Glassmorphic',
    voidHex: '#0B1221',
    primaryHex: '#00B4D8',
    secondaryHex: '#C5A059',
    textHex: '#F8FAFC',
    sampleTopics: [
      'Sovereign Multi-Tenant AI Gateway Architecture',
      'Enterprise RAG & Agentic Governance Topology',
      'How Transformer Self-Attention Scales to 1M Tokens',
    ],
  },
  {
    id: 'starlight',
    name: 'Starlight Sovereign (SIP)',
    shortLabel: 'Starlight',
    tagline: 'Agent Swarms · 6 Memory Vaults · Cyber Observability',
    whyBuyersPay:
      'Multi-agent builders & DevTools teams use Starlight to visualize MCP meshes, agentic loops, and cryptographic provenance receipts.',
    defaultStyle: 'Starlight Cosmos',
    voidHex: '#07090E',
    primaryHex: '#00E5FF',
    secondaryHex: '#8B5CF6',
    textHex: '#F9FAFB',
    sampleTopics: [
      'Starlight 6-Vault Event-Sourced Memory Architecture',
      'Maker vs Independent Verifier Loop Topology',
      'Model Context Protocol (MCP) Multi-Agent Tool Mesh',
    ],
  },
  {
    id: 'gencreator',
    name: 'GenCreator Edition',
    shortLabel: 'GenCreator',
    tagline: 'Territory B Editorial · 6-Pillar CoE · Source-to-Edition',
    whyBuyersPay:
      'Newsletter operators, content teams & creator founders use GenCreator to turn Markdown essays into 5-slide LinkedIn/X carousels.',
    defaultStyle: 'GenCreator Editorial',
    voidHex: '#FBF9F5',
    primaryHex: '#C8322A',
    secondaryHex: '#D97706',
    textHex: '#221F1B',
    sampleTopics: [
      'Agentic Creator OS: 6-Layer Closed-Loop Operating Model',
      'The One-Person Media Lab: Source-to-Edition Pipeline',
      'GenCreator 6-Pillar Center of Excellence Blueprint',
    ],
  },
  {
    id: 'arcanea',
    name: 'Arcanea Canon',
    shortLabel: 'Arcanea',
    tagline: 'Ten Gates Sacred Geometry · Illuminated Lore Scrolls',
    whyBuyersPay:
      'Worldbuilders, game studios & fiction authors use Arcanea to render canon-locked cosmic maps, magic systems, and illuminated codices.',
    defaultStyle: 'Arcanea Sacred Geometry',
    voidHex: '#0A0D18',
    primaryHex: '#FFD700',
    secondaryHex: '#00BCD4',
    textHex: '#F4ECE1',
    sampleTopics: [
      'The Ten Gates of Arcanea: Harmonic Frequency Cosmology',
      'Starbound Crew & Astral Vessel Propulsion Schematic',
      'Scientific Magic: Resonance & Crystalline Conduit Physics',
    ],
  },
];

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
    imageSize: '2K',
    brandWorld: 'gencreator',
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
    imageSize: '2K',
    brandWorld: 'frankx',
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
    imageSize: '2K',
    brandWorld: 'starlight',
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
    imageSize: '2K',
    brandWorld: 'arcanea',
    facts: [
      'Global quantum computing market projected to grow from USD 1.88B in 2026 to USD 19.44B by 2035 (29.73% CAGR).',
      'Princeton achieved >1ms qubit coherence (3x laboratory record and ~15x commercial processor standard).',
      'Over 50% of enterprises plan Post-Quantum Cryptography (PQC) deployment to protect against quantum decryption.',
    ],
  },
];

const SAMPLE_ARTICLE = `# Sovereign AI Agent Swarms: The 6-Layer Operating Architecture

Modern multi-agent systems fail when every agent shares a single unverified context window. To scale autonomous execution without compounding hallucinations, an estate requires a separated maker-verifier topology.

## 1. Core Substrate & Event-Sourced Memory
- 6 semantic memory vaults indexed via SQLite FTS5 + append-only JSONL logs.
- 90-day temporal half-life with contradiction detection and background consolidation.
- Zero-Orphan provenance sidecars attached to every generated code and media artifact.

## 2. Maker vs. Independent Verifier Loop
- One maker owns each isolated git worktree and branch lane.
- An independent verifier model family audits every commit against deterministic gates before promotion.
- Money, credentials, DNS, and external sends fail closed behind named human approval.

## 3. Production Telemetry & Cost Economics
- Dynamic model routing cuts token spend by 68% by routing mechanical checks to deterministic scripts.
- 100% of visual and code outputs emit verifiable receipts into the central scoreboard.`;

const OFFER_TIERS = [
  {
    name: 'Starter Workspace & BYOK',
    price: '$0',
    period: 'Free Forever · 15 Trial Credits',
    unitCost: '3 Free 2K Visuals + Unlimited BYOK',
    badge: 'Instant Start · No Card Required',
    highlight: false,
    outputs: [
      '15 Managed Vercel AI Gateway Credits included on frankx.ai/infogenius',
      'Unlimited Client-Side BYOK mode (Google Gemini, Vercel AI Gateway vck_, OpenRouter sk-or-)',
      'Deterministic 1200×675 Vector SVG Blueprint + Interactive Code-Overlay HUD',
      'Unlimited Article → 5-Slide Carousel Prompt Decomposer',
      'Zero-Orphan .vis.provenance.json receipt on every generation',
    ],
    ctaLabel: 'Use Free Studio Now',
    ctaHref: 'https://www.frankx.ai/infogenius#studio',
  },
  {
    name: 'Creator 100-Credit Pack',
    price: '$19',
    period: 'One-Time Credit Pack · Never Expires',
    unitCost: '$0.95 per 2K Grounded Infographic',
    badge: '20 × 2K Visuals · Zero Key Setup',
    highlight: false,
    outputs: [
      '100 Managed Vercel AI Gateway Credits added to your Workspace ID',
      'Renders 20 × 2K Infographics (5 cr), 12 × 4K Print Visuals (8 cr), or 33 × 5-Slide Packs (3 cr)',
      'Live Perplexity Sonar & Google Search fact citations baked into every diagram',
      'Solo Kore TTS + 2-Speaker Executive Dialogue (Kore × Fenrir) in 24kHz WAV',
      'Persistent Workspace Gallery & Custom Brand Style Vault in Upstash Redis',
    ],
    ctaLabel: 'Top Up 100 Credits ($19)',
    ctaHref: 'https://www.frankx.ai/waitlist?intent=infogenius-pro&sku=infogenius-credits-100',
  },
  {
    name: 'InfoGenius Pro Visual Knowledge OS',
    price: '$49',
    period: 'One-Time License + 350 Managed Credits',
    unitCost: '$0.70 per 2K Infographic + Full Local CLI & MCP Plugin',
    badge: 'Most Popular · 70 × 2K Visuals + Code Plugin',
    highlight: true,
    outputs: [
      '350 Managed Vercel AI Gateway Credits (70 × 2K Infographics or 43 × 4K Print Visuals)',
      'Standalone Claude Code, Cursor & Antigravity Plugin (plugins/infogenius-visual-os/)',
      '6-Tool MCP Server + OpenAPI 3.1 REST endpoint (/api/byok/infogenius?format=openapi)',
      'All 26 Brand Presets across FrankX, Starlight (SIP), GenCreator Territory B & Arcanea',
      'Batch Markdown-to-5-Slide Carousel CLI (scripts/infogenius.mjs --from-file) + Veo 3.1 motion support',
    ],
    ctaLabel: 'Get Pro OS + 350 Credits ($49)',
    ctaHref: 'https://www.frankx.ai/products/infogenius-pro',
  },
  {
    name: 'Agency & Content Team OS',
    price: '$129',
    period: 'Multi-Seat Team Workspace + 1,000 Credits',
    unitCost: '$0.64 per 2K Grounded Infographic',
    badge: '200 × 2K Visuals · Multi-Brand Vault',
    highlight: false,
    outputs: [
      '1,000 Managed Vercel AI Gateway Credits (200 × 2K Infographics or 125 × 4K Print Visuals)',
      'Shared Multi-Tenant Team Workspace ID (X-Tenant-Id) across web and CLI agents',
      'Unlimited Custom Brand Style Presets persisted in your team Redis vault',
      'Full Claude Code / Cursor / Antigravity MCP Server + CI/CD provenance verification',
      'Priority onboarding for custom brand pack calibration',
    ],
    ctaLabel: 'Get Agency Team Pack ($129)',
    ctaHref: 'https://www.frankx.ai/waitlist?intent=infogenius-pro&sku=infogenius-team-1000',
  },
];

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'studio' | 'carousel' | 'brand' | 'mcp' | 'offers'>('studio');
  const [activeBrandWorld, setActiveBrandWorld] = useState<BrandWorld>('frankx');
  const [canvasView, setCanvasView] = useState<'hud' | 'raster' | 'svg'>('hud');
  const [showIntro, setShowIntro] = useState(false);
  const [topic, setTopic] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [imageSize, setImageSize] = useState<ImageResolution>('2K');
  const [complexityLevel, setComplexityLevel] = useState<ComplexityLevel>('College');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('Glassmorphic');
  const [language] = useState<Language>('English');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [loadingFacts, setLoadingFacts] = useState<string[]>([]);

  const [assets, setAssets] = useState<GeneratedAsset[]>(() =>
    INITIAL_SHOWCASE_ASSETS.map((a) => ({
      ...a,
      svgBlueprint: buildInteractiveSvgBlueprint({
        topic: a.prompt,
        facts: a.facts,
        style: a.style,
        brandWorld: a.brandWorld || 'frankx',
      }),
    }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSearchResults, setCurrentSearchResults] = useState<SearchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Carousel decomposer state
  const [articleText, setArticleText] = useState(SAMPLE_ARTICLE);

  // Brand builder state
  const [brandKey, setBrandKey] = useState('custom/sovereign-glass');
  const [brandName, setBrandName] = useState('Sovereign Crystal & Gold');
  const [brandVoidHex, setBrandVoidHex] = useState('#0b0e14');
  const [brandPrimaryHex, setBrandPrimaryHex] = useState('#7fffd4');
  const [brandSecondaryHex, setBrandSecondaryHex] = useState('#ffd700');
  const [brandTextHex, setBrandTextHex] = useState('#ffffff');
  const [brandMaterial, setBrandMaterial] = useState(
    'Frosted translucent crystal cards floating at multiple depths with directional upper-left rim lighting and luminous connection threads'
  );

  const currentBrandLens = BRAND_WORLDS.find((b) => b.id === activeBrandWorld) || BRAND_WORLDS[0];

  const handleSelectBrandWorld = (worldId: BrandWorld) => {
    setActiveBrandWorld(worldId);
    const lens = BRAND_WORLDS.find((b) => b.id === worldId);
    if (lens) {
      setVisualStyle(lens.defaultStyle);
      setBrandVoidHex(lens.voidHex);
      setBrandPrimaryHex(lens.primaryHex);
      setBrandSecondaryHex(lens.secondaryHex);
      setBrandTextHex(lens.textHex);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const saved = window.localStorage.getItem('infogenius_api_key') || '';
    if (saved) setCustomApiKey(saved);
  }, []);

  const copyToClipboard = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setError(null);
    } else {
      setShowKeyModal(true);
    }
  };

  const handleSaveCustomKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (customApiKey.trim()) {
      window.localStorage.setItem('infogenius_api_key', customApiKey.trim());
      setError(null);
    } else {
      window.localStorage.removeItem('infogenius_api_key');
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
      setLoadingMessage('Synthesis: Architecting visual layout & SVG blueprint...');
      const svgBlueprint = buildInteractiveSvgBlueprint({
        topic,
        facts: research.facts,
        style: visualStyle,
        brandWorld: activeBrandWorld,
      });
      await new Promise((r) => setTimeout(r, 400));

      setLoadingStep(3);
      setLoadingMessage(`Visualization: Projecting ${imageSize} neural imagery...`);
      const imageData = await generateInfographicImage(research.imagePrompt, aspectRatio, imageSize);

      const newAsset: GeneratedAsset = {
        id: Date.now().toString(),
        data: imageData,
        svgBlueprint,
        prompt: topic,
        timestamp: Date.now(),
        level: complexityLevel,
        style: visualStyle,
        language,
        aspectRatio,
        imageSize,
        brandWorld: activeBrandWorld,
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

  const handleNarrate = async (mode: 'solo' | 'dialogue' = 'solo') => {
    const asset = assets[currentIndex];
    if (isLoading) return;
    setIsLoading(true);
    setLoadingMessage(
      mode === 'dialogue'
        ? 'Vocal Synthesis: Recording 2-Host Dialogue (Architect Kore × Strategist Fenrir)...'
        : 'Vocal Synthesis: Projecting Solo Executive Briefing (Kore)...'
    );
    try {
      const { audioUrl, transcript } = await generateNarration(asset.facts, mode, asset.prompt);
      const updatedAssets = [...assets];
      updatedAssets[currentIndex] = { ...asset, audioUrl, audioTranscript: transcript };
      setAssets(updatedAssets);
    } catch (err) {
      setError('Narration requires a Google Gemini API key.');
      setShowKeyModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCurrentSvg = () => {
    const asset = assets[currentIndex];
    const svg =
      asset?.svgBlueprint ||
      buildInteractiveSvgBlueprint({
        topic: asset?.prompt || 'Architecture Blueprint',
        facts: asset?.facts || [],
        style: asset?.style || 'Glassmorphic',
        brandWorld: asset?.brandWorld || activeBrandWorld,
      });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infogenius-${(asset?.prompt || 'blueprint').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 42)}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Decompose markdown into 5 slides deterministically
  const decomposedSlides = React.useMemo(() => {
    const headings = articleText
      .split('\n')
      .filter((l) => l.trim().startsWith('#'))
      .map((l) => l.replace(/^#+\s*/, '').trim());
    const bullets = articleText
      .split('\n')
      .filter((l) => /^[-*•]\s+/.test(l.trim()))
      .map((l) => l.replace(/^[-*•]\s+/, '').trim());
    const docTitle = headings[0] || 'Executive System Architecture';
    const roles = [
      { role: 'Slide 01 · Hero Thesis', title: docTitle },
      { role: 'Slide 02 · Problem & Bottleneck', title: headings[1] || `${docTitle}: Core Bottlenecks` },
      { role: 'Slide 03 · 6-Layer Architecture', title: headings[2] || `${docTitle}: System Topology` },
      { role: 'Slide 04 · Verification & Proof', title: headings[3] || `${docTitle}: Telemetry & Proof` },
      { role: 'Slide 05 · Action Blueprint', title: `${docTitle}: Implementation Checklist` },
    ];
    return roles.map((r, idx) => {
      const slideFacts = bullets.slice(idx * 2, idx * 2 + 3);
      if (slideFacts.length === 0) {
        slideFacts.push(
          `Key architectural mechanism for ${r.title}`,
          `Verified telemetry and production guardrails`,
          `Zero-Orphan provenance and deterministic verification`
        );
      }
      const cli = `node scripts/infogenius.mjs "${r.title.replace(/"/g, '\\"')}" --style ${visualStyle.toLowerCase()} --aspect 1:1 --size 2K`;
      return {
        slideNumber: idx + 1,
        role: r.role,
        title: r.title,
        facts: slideFacts,
        cli,
      };
    });
  }, [articleText, visualStyle]);

  const customPresetJson = {
    key: brandKey,
    namespace: brandKey.split('/')[0] || 'custom',
    name: brandName,
    defaultAspect: aspectRatio,
    palette: [
      `${brandVoidHex} background void`,
      `${brandPrimaryHex} primary accent`,
      `${brandSecondaryHex} secondary highlight`,
      `${brandTextHex} typography`,
    ],
    promptFragment: `${brandName}. Background void (${brandVoidHex}). ${brandMaterial}. Primary accent (${brandPrimaryHex}), secondary highlight (${brandSecondaryHex}), crisp legible labels (${brandTextHex}).`,
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
        <div className="p-5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-500 fill-current" />
            <div>
              <span className="font-display font-bold text-lg tracking-tight dark:text-white block leading-none">
                InfoGenius v5.3
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold">
                Multi-Brand Visual Knowledge OS
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* 4 Sovereign Brand World Lens Selector */}
        <div className="p-3 border-b border-slate-200 dark:border-white/5 space-y-1.5">
          <div className="px-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Sovereign Brand Lens
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {BRAND_WORLDS.map((bw) => (
              <button
                key={bw.id}
                onClick={() => handleSelectBrandWorld(bw.id)}
                className={`text-left px-2.5 py-2 rounded-xl border text-[11px] font-bold transition-all ${
                  activeBrandWorld === bw.id
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300'
                    : 'border-white/5 bg-white/[0.02] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{bw.shortLabel}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: bw.primaryHex }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Navigation */}
        <div className="p-3 border-b border-slate-200 dark:border-white/5 grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setActiveMode('studio')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'studio'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> 1. 2K/4K Studio
          </button>
          <button
            onClick={() => setActiveMode('carousel')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'carousel'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> 2. 5-Slide Pack
          </button>
          <button
            onClick={() => setActiveMode('brand')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'brand'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> 3. Brand DNA
          </button>
          <button
            onClick={() => setActiveMode('mcp')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'mcp'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> 4. MCP &amp; API
          </button>
          <button
            onClick={() => setActiveMode('offers')}
            className={`col-span-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'offers'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> 5. Offers, Unit Economics &amp; Value
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Verified 2K Gallery &amp; History
          </div>
          {assets.map((asset, idx) => (
            <button
              key={asset.id}
              onClick={() => {
                setCurrentIndex(idx);
                setActiveMode('studio');
              }}
              className={`w-full group flex items-center gap-3 p-3 rounded-xl transition-all border ${
                currentIndex === idx && activeMode === 'studio'
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
                  {asset.style} · {asset.imageSize || '2K'} · {asset.aspectRatio}
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
            FrankX Multi-Tenant Platform <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}

        <header className="min-h-16 py-2 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-wrap items-center px-6 justify-between gap-2 z-40">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold dark:text-white truncate max-w-md">
              {activeMode === 'studio'
                ? assets[currentIndex]?.prompt || 'New Visual Project'
                : activeMode === 'carousel'
                  ? 'Article / Markdown → 5-Slide Executive Carousel Decomposer'
                  : activeMode === 'brand'
                    ? 'Custom Brand Style DNA Builder (infogenius-presets.json)'
                    : activeMode === 'mcp'
                      ? 'MCP Server, Vercel AI SDK v6 & OpenAPI 3.1 Hub'
                      : 'InfoGenius v5.3 Offers, Unit Economics, E2E Workflows & Outputs'}
            </h2>
            {activeMode === 'studio' && assets[currentIndex] && (
              <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                {assets[currentIndex].style} · {assets[currentIndex].imageSize || '2K'}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeMode === 'studio' && (
              <>
                <div className="inline-flex rounded-lg border border-white/10 bg-slate-900 p-0.5">
                  <button
                    onClick={() => setCanvasView('hud')}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                      canvasView === 'hud' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400'
                    }`}
                  >
                    + HUD Overlay
                  </button>
                  <button
                    onClick={() => setCanvasView('raster')}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                      canvasView === 'raster' ? 'bg-violet-500/25 text-violet-300' : 'text-slate-400'
                    }`}
                  >
                    Pure Raster
                  </button>
                  <button
                    onClick={() => setCanvasView('svg')}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                      canvasView === 'svg' ? 'bg-amber-500/25 text-amber-300' : 'text-slate-400'
                    }`}
                  >
                    Vector SVG
                  </button>
                </div>

                <button
                  disabled={!assets[currentIndex] || isLoading}
                  onClick={() => handleNarrate('solo')}
                  title="Narrate Solo Briefing (Kore TTS)"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-cyan-400 flex items-center gap-1 disabled:opacity-30"
                >
                  <Mic className="w-3.5 h-3.5" /> Solo (Kore)
                </button>
                <button
                  disabled={!assets[currentIndex] || isLoading}
                  onClick={() => handleNarrate('dialogue')}
                  title="2-Host Executive Dialogue (Kore × Fenrir)"
                  className="px-2.5 py-1.5 rounded-lg bg-violet-500/15 border border-violet-400/30 text-xs font-semibold text-violet-200 hover:bg-violet-500/25 flex items-center gap-1 disabled:opacity-30"
                >
                  <Radio className="w-3.5 h-3.5" /> 2-Host Dialogue
                </button>
                <button
                  disabled={!assets[currentIndex]}
                  onClick={downloadCurrentSvg}
                  title="Download Deterministic Vector SVG Blueprint"
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-400/30 text-xs font-semibold text-amber-200 hover:bg-amber-500/25 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> .svg
                </button>
                <button
                  disabled={!assets[currentIndex] || isLoading}
                  onClick={handleAnimate}
                  title="Animate with Veo 3.1"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-cyan-400 flex items-center gap-1 disabled:opacity-30"
                >
                  <Video className="w-3.5 h-3.5" /> Veo 3.1
                </button>
              </>
            )}
            <a
              href="https://www.frankx.ai/products/infogenius-pro"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1"
            >
              Pro OS ($49) <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* MODE 1: STUDIO & 2K/4K GALLERY */}
        {activeMode === 'studio' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center custom-scrollbar">
              {isLoading ? (
                <Loading status={loadingMessage} step={loadingStep} facts={loadingFacts} />
              ) : assets.length > 0 ? (
                <div className="w-full max-w-5xl space-y-6 pb-32">
                  {/* Brand World Context Strip */}
                  <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                        Active Sovereign Brand World · {currentBrandLens.name}
                      </span>
                      <p className="text-xs text-slate-300 mt-0.5">{currentBrandLens.whyBuyersPay}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentBrandLens.sampleTopics.map((sample) => (
                        <button
                          key={sample}
                          type="button"
                          onClick={() => setTopic(sample)}
                          className="rounded-full border border-white/10 bg-white/5 hover:border-cyan-400/40 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white"
                        >
                          {sample}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio Player + Transcript if Narrated */}
                  {assets[currentIndex].audioUrl && (
                    <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-bold text-cyan-200">
                          Gemini 2.5 Flash 24kHz WAV Audio Briefing
                        </span>
                        <audio controls src={assets[currentIndex].audioUrl} className="h-8" />
                      </div>
                      {assets[currentIndex].audioTranscript && (
                        <pre className="rounded-xl bg-slate-950/80 border border-white/10 p-3 text-[11px] font-mono text-slate-300 whitespace-pre-wrap">
                          {assets[currentIndex].audioTranscript}
                        </pre>
                      )}
                    </div>
                  )}

                  {/* Canvas View: Vector SVG Blueprint OR Raster + HUD Code-Overlay */}
                  {canvasView === 'svg' ? (
                    <div className="rounded-2xl border border-amber-400/35 bg-slate-950 p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                        <span>Deterministic 1200×675 Vector SVG Blueprint (Zero Spelling Errors)</span>
                        <button onClick={downloadCurrentSvg} className="underline font-sans font-bold">
                          Download .svg →
                        </button>
                      </div>
                      <div
                        className="w-full overflow-hidden rounded-xl border border-white/10"
                        dangerouslySetInnerHTML={{
                          __html:
                            assets[currentIndex].svgBlueprint ||
                            buildInteractiveSvgBlueprint({
                              topic: assets[currentIndex].prompt,
                              facts: assets[currentIndex].facts,
                              style: assets[currentIndex].style,
                              brandWorld: assets[currentIndex].brandWorld || activeBrandWorld,
                            }),
                        }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Infographic image={assets[currentIndex]} onEdit={() => {}} isEditing={false} />
                      {canvasView === 'hud' && assets[currentIndex].facts?.length > 0 && (
                        <div className="rounded-2xl border border-cyan-500/25 bg-slate-950/90 p-4">
                          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-cyan-400 mb-2.5">
                            <span>Anti-Slop Code-Overlay HUD · Verified Node Callouts</span>
                            <span>Built on SIP</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {assets[currentIndex].facts.slice(0, 3).map((fact, idx) => (
                              <div
                                key={idx}
                                className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs text-slate-200"
                              >
                                <div className="text-[10px] font-mono font-bold text-cyan-400 mb-1">
                                  NODE 0{idx + 1} · VERIFIED
                                </div>
                                <p className="text-[11px] leading-snug">{fact}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
                    placeholder={`Enter a ${currentBrandLens.shortLabel} topic, system architecture, or concept to research & visualize...`}
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
                      value={imageSize}
                      onChange={(e) => setImageSize(e.target.value as ImageResolution)}
                      className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-2 rounded-xl border-none dark:text-white"
                    >
                      <option value="1K">1K Fast</option>
                      <option value="2K">2K Production</option>
                      <option value="4K">4K Print</option>
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
                      <option value="Glassmorphic">3D Glassmorphic (v5.3)</option>
                      <option value="Premium">Luxury Brand (v5.3)</option>
                      <option value="Starlight Cosmos">Starlight Neural Cosmos (SIP)</option>
                      <option value="GenCreator Editorial">GenCreator Territory B Editorial</option>
                      <option value="Arcanea Sacred Geometry">Arcanea Sacred Geometry</option>
                      <option value="Da Vinci Blueprint">FrankX Da Vinci Blueprint</option>
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
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-7 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all active:scale-95 text-xs"
                  >
                    <Zap className="w-4 h-4 fill-current" /> GENERATE {imageSize} VISUAL
                  </button>
                </div>
              </form>
              {error && (
                <p className="mt-3 text-center text-amber-300 text-xs font-semibold px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/30">
                  {error}
                </p>
              )}
            </div>
          </>
        )}

        {/* MODE 4: MCP SERVER, VERCEL AI SDK & OPENAPI 3.1 HUB */}
        {activeMode === 'mcp' && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto space-y-6 pb-16">
              <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    Agent-Native Visual Intelligence Substrate
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Connect InfoGenius v5.3 to Claude Code, Cursor, Antigravity &amp; Next.js
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Active Brand World: <strong className="text-white">{currentBrandLens.name}</strong> · Active Style: <code className="text-cyan-300">{visualStyle}</code>
                  </p>
                </div>
                <a
                  href="https://www.frankx.ai/api/byok/infogenius?format=openapi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-teal-400/40 bg-teal-500/10 text-xs font-bold text-teal-200 flex items-center gap-1.5"
                >
                  OpenAPI 3.1 Spec (JSON) <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-cyan-300">
                      1. Claude Code / Cursor / Antigravity .mcp.json
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'mcp-cfg',
                          JSON.stringify(
                            {
                              mcpServers: {
                                'infogenius-visual-os': {
                                  command: 'node',
                                  args: ['scripts/infogenius-mcp-server.mjs'],
                                  env: {
                                    INFOGENIUS_DEFAULT_BRAND: activeBrandWorld,
                                    INFOGENIUS_DEFAULT_STYLE: visualStyle.toLowerCase(),
                                  },
                                },
                              },
                            },
                            null,
                            2
                          )
                        )
                      }
                      className="px-3 py-1 rounded-lg bg-white/5 text-xs text-white flex items-center gap-1"
                    >
                      {copiedId === 'mcp-cfg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy .mcp.json
                    </button>
                  </div>
                  <pre className="rounded-xl bg-slate-950 border border-white/10 p-3.5 text-[11px] font-mono text-cyan-200 overflow-x-auto">
                    {JSON.stringify(
                      {
                        mcpServers: {
                          'infogenius-visual-os': {
                            command: 'node',
                            args: ['scripts/infogenius-mcp-server.mjs'],
                            env: {
                              INFOGENIUS_DEFAULT_BRAND: activeBrandWorld,
                              INFOGENIUS_DEFAULT_STYLE: visualStyle.toLowerCase(),
                            },
                          },
                        },
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-violet-300">
                      2. Multi-Tenant REST API (cURL)
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'curl-cfg',
                          `curl -X POST https://www.frankx.ai/api/byok/infogenius \\\n  -H "Content-Type: application/json" \\\n  -d '{"action":"generate","topic":"${(topic || 'Sovereign AI Swarm Architecture').replace(/"/g, '\\"')}","style":"${visualStyle.toLowerCase()}","imageSize":"${imageSize}"}'`
                        )
                      }
                      className="px-3 py-1 rounded-lg bg-white/5 text-xs text-white flex items-center gap-1"
                    >
                      {copiedId === 'curl-cfg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy cURL
                    </button>
                  </div>
                  <pre className="rounded-xl bg-slate-950 border border-white/10 p-3.5 text-[11px] font-mono text-violet-200 overflow-x-auto">
                    {`curl -X POST https://www.frankx.ai/api/byok/infogenius \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "action": "generate",\n    "topic": "${(topic || 'Sovereign AI Swarm Architecture').replace(/"/g, '\\"')}",\n    "style": "${visualStyle.toLowerCase()}",\n    "imageSize": "${imageSize}"\n  }'`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: ARTICLE TO 5-SLIDE CAROUSEL DECOMPOSER */}
        {activeMode === 'carousel' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Paste Article, Whitepaper, or GitHub README
                    </h3>
                    <p className="text-xs text-slate-400">
                      Automatically decomposes into a 5-slide executive visual pack (Hero Thesis, Problem, Architecture, Proof, Action).
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'batch-cli',
                        decomposedSlides.map((s) => s.cli).join('\n')
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    {copiedId === 'batch-cli' ? <Check className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
                    {copiedId === 'batch-cli' ? 'Copied All 5 CLI Commands' : 'Copy 5-Slide Batch CLI Script'}
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={articleText}
                  onChange={(e) => setArticleText(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-4 text-xs font-mono text-slate-200 focus:border-violet-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {decomposedSlides.map((slide) => (
                  <div
                    key={slide.slideNumber}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-violet-400">
                          {slide.role}
                        </span>
                        <h4 className="text-base font-bold text-white">{slide.title}</h4>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(`cli-${slide.slideNumber}`, slide.cli)}
                          className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                        >
                          {copiedId === `cli-${slide.slideNumber}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          Copy CLI
                        </button>
                        <button
                          onClick={() => {
                            setTopic(slide.title);
                            setActiveMode('studio');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5" /> Open in Studio
                        </button>
                      </div>
                    </div>
                    <ul className="grid sm:grid-cols-3 gap-2 text-xs text-slate-300">
                      {slide.facts.map((f, i) => (
                        <li key={i} className="rounded-xl border border-white/5 bg-slate-950/60 p-2.5">
                          <span className="font-mono text-cyan-400 font-bold mr-1">{i + 1}.</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: CUSTOM BRAND DNA BUILDER */}
        {activeMode === 'brand' && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Custom Brand Style Pack Builder (<code>infogenius-presets.json</code>)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Lock your team&apos;s hex palette and material physics into a reusable preset for the Web Studio, local CLI, and Claude Code / Cursor MCP Server.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Preset Key
                    </label>
                    <input
                      value={brandKey}
                      onChange={(e) => setBrandKey(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Brand Display Name
                    </label>
                    <input
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Void Background', val: brandVoidHex, set: setBrandVoidHex },
                    { label: 'Primary Accent', val: brandPrimaryHex, set: setBrandPrimaryHex },
                    { label: 'Secondary Highlight', val: brandSecondaryHex, set: setBrandSecondaryHex },
                    { label: 'Typography', val: brandTextHex, set: setBrandTextHex },
                  ].map((c) => (
                    <div key={c.label} className="rounded-xl border border-white/10 bg-slate-950 p-3">
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-2">
                        {c.label}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={c.val}
                          onChange={(e) => c.set(e.target.value)}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          value={c.val}
                          onChange={(e) => c.set(e.target.value)}
                          className="w-full bg-transparent text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Material &amp; Lighting Physics
                  </label>
                  <textarea
                    rows={3}
                    value={brandMaterial}
                    onChange={(e) => setBrandMaterial(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-amber-400">
                      Compiled .preset.json
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard('brand-json', JSON.stringify(customPresetJson, null, 2))
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                    >
                      {copiedId === 'brand-json' ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                      {copiedId === 'brand-json' ? 'Copied Preset JSON' : 'Copy Preset JSON'}
                    </button>
                  </div>
                  <pre className="rounded-xl bg-slate-950 border border-white/10 p-4 text-xs font-mono text-amber-200 overflow-x-auto">
                    {JSON.stringify(customPresetJson, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 5: OFFERS, COSTS, UNIT ECONOMICS & E2E WORKFLOWS */}
        {activeMode === 'offers' && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto space-y-8 pb-16">
              {/* Unit Economics Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <div className="text-xs font-bold uppercase text-slate-400">
                    Traditional Design Agency
                  </div>
                  <div className="text-2xl font-black text-white mt-1">$150 – $400 / visual</div>
                  <p className="text-xs text-slate-400 mt-2">
                    2–4 days turnaround · Manual fact checking · Static raster file with no CLI automation or provenance sidecar.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <div className="text-xs font-bold uppercase text-slate-400">
                    Raw ChatGPT / Midjourney
                  </div>
                  <div className="text-2xl font-black text-white mt-1">$20 / mo + 45 mins</div>
                  <p className="text-xs text-slate-400 mt-2">
                    Hallucinated numbers · Misspelled labels · Inconsistent brand colors · No 5-slide Markdown decomposer or MCP server.
                  </p>
                </div>
                <div className="rounded-2xl border border-cyan-400/50 bg-cyan-500/10 p-5">
                  <div className="text-xs font-bold uppercase text-cyan-300">
                    InfoGenius v5.3 Visual Knowledge OS
                  </div>
                  <div className="text-2xl font-black text-white mt-1">$0.64 – $0.95 / 2K visual</div>
                  <p className="text-xs text-cyan-100/80 mt-2">
                    ~18 seconds · Live Perplexity Sonar &amp; Google Search citations · 4 Brand Worlds · Vector SVG + 2-Speaker Dialogue TTS.
                  </p>
                </div>
              </div>

              {/* 4 Offer Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {OFFER_TIERS.map((tier) => (
                  <div
                    key={tier.name}
                    className={`rounded-2xl border p-5 flex flex-col justify-between ${
                      tier.highlight
                        ? 'border-cyan-400 bg-slate-900 shadow-xl shadow-cyan-500/10'
                        : 'border-white/10 bg-slate-900/60'
                    }`}
                  >
                    <div className="space-y-3">
                      <span className="inline-block rounded-full bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                        {tier.badge}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-white">{tier.name}</h4>
                        <div className="text-3xl font-black text-white mt-1">{tier.price}</div>
                        <div className="text-[11px] text-slate-400">{tier.period}</div>
                        <div className="text-xs font-bold text-cyan-400 mt-1">{tier.unitCost}</div>
                      </div>
                      <ul className="space-y-2 pt-3 border-t border-white/10 text-xs text-slate-300">
                        {tier.outputs.map((out, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-cyan-400 font-bold">✓</span>
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href={tier.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-5 w-full py-2.5 rounded-xl text-xs font-bold text-center block ${
                        tier.highlight
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                          : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {tier.ctaLabel} ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
