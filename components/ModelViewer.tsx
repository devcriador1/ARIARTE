import React from 'react';
import { Icon3D } from './Icons';

interface ModelViewerProps {
  src: string;
  poster: string;
  alt: string;
}

// Global declaration removed to prevent conflicts with React's JSX definitions

const ModelViewer: React.FC<ModelViewerProps> = ({ src, poster, alt }) => {
  return (
    <div className="w-full h-full relative group">
      {/* @ts-ignore */}
      <model-viewer
        src={src}
        poster={poster}
        alt={alt}
        camera-controls
        auto-rotate
        ar
        ar-modes="webxr scene-viewer quick-look"
        shadow-intensity="1"
        exposure="0.8"
        className="w-full h-full"
      >
        <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-cyber-dark/50">
          <div className="animate-pulse flex flex-col items-center text-cyber-primary">
            <Icon3D className="w-12 h-12 mb-2" />
            <span className="font-display text-sm tracking-widest">CARREGANDO MODELO...</span>
          </div>
        </div>
        
        <button slot="ar-button" className="absolute bottom-4 right-4 px-4 py-2 bg-cyber-primary text-cyber-black font-bold rounded font-display text-xs tracking-wider shadow-lg transform hover:scale-105 transition-transform z-10">
          VER EM RA
        </button>
      </model-viewer>
      
      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="bg-black/60 backdrop-blur border border-cyber-primary/30 px-3 py-1 text-xs text-cyber-primary rounded font-mono flex items-center gap-2">
          <Icon3D className="w-3 h-3" />
          INTERATIVO
        </span>
      </div>
    </div>
  );
};

export default ModelViewer;