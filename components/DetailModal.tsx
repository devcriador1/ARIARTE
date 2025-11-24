import React, { useState } from 'react';
import { Product, PrintSettings } from '../types';
import { analyzePrintSettings } from '../services/geminiService';
import { IconX, IconSparkles, IconCpu, Icon3D } from './Icons';
import ModelViewer from './ModelViewer';

interface DetailModalProps {
  product: Product;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ product, onClose }) => {
  const [analysis, setAnalysis] = useState<(PrintSettings & { tips: string[] }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'image' | '3d'>('3d');

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzePrintSettings(product.name, product.description);
    setAnalysis(result);
    setLoading(false);
  };

  const hasModel = !!product.modelUrl;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-6xl bg-cyber-dark border border-cyber-primary/50 shadow-[0_0_50px_rgba(6,182,212,0.15)] clip-corner text-gray-100 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-cyber-primary hover:text-white bg-black/50 hover:bg-cyber-primary/20 rounded-full transition-all"
        >
          <IconX />
        </button>

        {/* Media Section */}
        <div className="w-full md:w-1/2 relative bg-black/50 h-1/2 md:h-full flex flex-col">
          <div className="flex-1 relative overflow-hidden">
             {viewMode === '3d' && hasModel ? (
               <ModelViewer src={product.modelUrl!} poster={product.imageUrl} alt={product.name} />
             ) : (
               <div className="w-full h-full relative">
                 <img 
                   src={product.imageUrl} 
                   alt={product.name} 
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark to-transparent opacity-80" />
               </div>
             )}
          </div>
          
          {/* View Toggles */}
          {hasModel && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              <button 
                onClick={() => setViewMode('image')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-all ${viewMode === 'image' ? 'bg-cyber-primary text-black border-cyber-primary' : 'bg-black/60 text-white border-white/20 hover:border-cyber-primary'}`}
              >
                Imagem
              </button>
              <button 
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-all flex items-center gap-2 ${viewMode === '3d' ? 'bg-cyber-primary text-black border-cyber-primary' : 'bg-black/60 text-white border-white/20 hover:border-cyber-primary'}`}
              >
                <Icon3D className="w-4 h-4" /> 3D View
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs font-display font-bold border border-cyber-secondary text-cyber-secondary rounded">
              {product.category.toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs font-display font-bold border rounded ${
              product.difficulty === 'Fácil' ? 'border-green-500 text-green-500' : 
              product.difficulty === 'Médio' ? 'border-yellow-500 text-yellow-500' : 'border-red-500 text-red-500'
            }`}>
              {product.difficulty.toUpperCase()}
            </span>
          </div>

          <h2 className="text-4xl font-display font-bold text-white mb-2 uppercase tracking-wider">{product.name}</h2>
          
          {/* Price Tag in Modal */}
          <div className="mb-6 pb-6 border-b border-white/10">
            {product.promotionalPrice ? (
              <div className="flex items-baseline gap-3">
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-500 uppercase font-bold">Preço Original</span>
                   <span className="text-lg text-gray-500 line-through decoration-red-500/50">{formatPrice(product.price)}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs text-cyber-primary uppercase font-bold">Oferta Ariarte</span>
                    <span className="text-4xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                      {formatPrice(product.promotionalPrice)}
                    </span>
                 </div>
              </div>
            ) : (
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold">Preço</span>
                <span className="text-3xl font-display font-bold text-white">{formatPrice(product.price)}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6 text-xs font-mono text-gray-400">
             <span className="bg-white/5 px-2 py-1 rounded">Escala: {product.scale}</span>
             <span className="bg-white/5 px-2 py-1 rounded">Detalhe: {product.detailLevel}</span>
             <span className="bg-white/5 px-2 py-1 rounded">Material Sugerido: {product.material}</span>
          </div>

          <p className="text-gray-400 mb-8 leading-relaxed font-sans text-lg border-l-2 border-cyber-primary/30 pl-4">
            {product.description}
          </p>

          <div className="mb-8">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Cores Disponíveis</h4>
            <div className="flex gap-2">
              {product.colors.map(color => (
                <span key={color} className="px-3 py-1 border border-white/10 rounded-full text-xs text-gray-300 hover:border-cyber-primary/50 transition-colors cursor-default">
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white/5 border-l-2 border-cyber-primary">
              <p className="text-xs text-cyber-primary uppercase">Tempo Estimado</p>
              <p className="text-xl font-bold">{product.printTime}</p>
            </div>
            <div className="p-4 bg-white/5 border-l-2 border-cyber-secondary">
              <p className="text-xs text-cyber-secondary uppercase">Material Base</p>
              <p className="text-xl font-bold">{product.material}</p>
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <div className="bg-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconCpu className="text-cyber-accent" />
                <h3 className="font-display font-bold text-cyber-accent">AI PRINT ADVISOR</h3>
              </div>
              {!analysis && (
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-cyber-accent/20 hover:bg-cyber-accent/40 text-cyber-accent border border-cyber-accent/50 rounded transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-pulse">Analysando...</span>
                  ) : (
                    <>
                      <IconSparkles className="w-4 h-4" />
                      <span>Gerar Specs</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {analysis && (
              <div className="p-6 bg-black/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6 font-mono text-sm">
                  <div>
                    <span className="text-gray-500 block">Bico (Nozzle)</span>
                    <span className="text-cyber-primary font-bold">{analysis.nozzleTemp}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Mesa (Bed)</span>
                    <span className="text-cyber-primary font-bold">{analysis.bedTemp}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Altura Camada</span>
                    <span className="text-white font-bold">{analysis.layerHeight}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Preenchimento</span>
                    <span className="text-white font-bold">{analysis.infill}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Notas Técnicas</h4>
                  <p className="text-sm text-gray-300 bg-white/5 p-3 rounded border-l-2 border-cyber-primary">
                    {analysis.notes}
                  </p>
                </div>

                 <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Pro Tips</h4>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    {analysis.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;