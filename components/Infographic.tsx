
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { GeneratedAsset } from '../types';
import { Download, Maximize2, X, Play, Volume2, Video } from 'lucide-react';

interface InfographicProps {
  image: GeneratedAsset;
  onEdit: (prompt: string) => void;
  isEditing: boolean;
}

const Infographic: React.FC<InfographicProps> = ({ image }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isPortrait = image.aspectRatio === '9:16';

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-700">
      <div className={`relative group w-full ${isPortrait ? 'max-w-sm' : ''} bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border dark:border-white/10 aspect-video`} style={{ aspectRatio: image.aspectRatio.replace(':', '/') }}>
        
        {image.videoUrl ? (
          <video 
            src={image.videoUrl} 
            controls 
            autoPlay 
            loop 
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <img src={image.data} className="w-full h-full object-contain" />
        )}

        {/* Status Indicators */}
        <div className="absolute bottom-6 left-6 flex gap-3 z-30">
          {image.videoUrl && <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-cyan-500 text-white text-[10px] font-bold uppercase tracking-widest"><Video className="w-3 h-3" /> Motion Synced</div>}
          {image.audioUrl && <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-500 text-white text-[10px] font-bold uppercase tracking-widest"><Volume2 className="w-3 h-3" /> Narrated</div>}
        </div>

        <div className="absolute top-6 right-6 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsFullscreen(true)} className="bg-black/40 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-cyan-600">
            <Maximize2 className="w-5 h-5" />
          </button>
          <a href={image.videoUrl || image.data} download className="bg-black/40 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-cyan-600">
            <Download className="w-5 h-5" />
          </a>
        </div>
      </div>

      {image.audioUrl && (
        <div className="mt-8 w-full max-w-xl bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-white/5 flex items-center gap-4 shadow-xl">
           <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Volume2 className="w-5 h-5" />
           </div>
           <audio controls src={image.audioUrl} className="flex-1 h-8" />
        </div>
      )}

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in fade-in">
            <div className="p-4 flex justify-end">
                <button onClick={() => setIsFullscreen(false)} className="p-3 bg-white/10 text-white rounded-full hover:bg-red-500/20">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
                {image.videoUrl ? (
                  <video src={image.videoUrl} controls autoPlay className="max-w-full max-h-full" />
                ) : (
                  <img src={image.data} className="max-w-full max-h-full object-contain" />
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Infographic;
