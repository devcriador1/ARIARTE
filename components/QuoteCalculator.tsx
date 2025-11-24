import React, { useState, useCallback } from 'react';
import { IconUpload, IconFile, IconCpu, IconSparkles, IconBox, IconClock } from './Icons';
import { CONTACT_INFO } from '../constants';

const QuoteCalculator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<{
    volume: number;
    weight: number;
    price: number;
    time: string;
  } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setFile(file);
    setResult(null);
    setAnalyzing(true);
    setProgress(0);

    // Simulated Slicing Process
    const steps = [
      { msg: 'Lendo geometria da malha...', duration: 800 },
      { msg: 'Verificando integridade dos polígonos...', duration: 1200 },
      { msg: 'Calculando suportes estruturais...', duration: 1500 },
      { msg: 'Estimando consumo de material...', duration: 1000 },
      { msg: 'Otimizando percurso de impressão...', duration: 800 }
    ];

    let currentStep = 0;
    
    const runStep = () => {
      if (currentStep >= steps.length) {
        setAnalyzing(false);
        // Generate mock results based on file size pseudo-randomness
        const mockVolume = (file.size / 1024 / 1024) * 25 + Math.random() * 20; // Rough proxy
        const mockWeight = mockVolume * 1.24; // PLA Density
        const mockPrice = (mockWeight * 0.9) + 15; // Material cost + Setup fee
        const hours = Math.floor(mockWeight / 10) + 2;
        
        setResult({
          volume: Math.round(mockVolume),
          weight: Math.round(mockWeight),
          price: mockPrice,
          time: `${hours}h ${Math.floor(Math.random()*60)}m`
        });
        return;
      }

      setStatus(steps[currentStep].msg);
      setProgress(((currentStep + 1) / steps.length) * 100);
      
      setTimeout(() => {
        currentStep++;
        runStep();
      }, steps[currentStep].duration);
    };

    runStep();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.stl') || droppedFile.name.endsWith('.obj'))) {
      processFile(droppedFile);
    } else {
      alert('Por favor, envie apenas arquivos .STL ou .OBJ');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
          <IconCpu className="text-cyber-primary" />
          ORÇAMENTO INTELIGENTE
        </h2>
        <p className="text-gray-400 font-mono text-sm border-l-2 border-cyber-secondary pl-3">
          Nossa IA analisa sua malha 3D e calcula o custo de impressão em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Area */}
        <div 
          className={`
            border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all h-80
            ${isDragging ? 'border-cyber-primary bg-cyber-primary/10' : 'border-white/20 bg-white/5 hover:border-white/40'}
            ${analyzing ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept=".stl,.obj" 
            className="hidden" 
            id="file-upload"
            onChange={handleFileSelect}
          />
          
          <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <IconUpload className="w-8 h-8 text-cyber-primary" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Arraste seu arquivo STL</h3>
          <p className="text-gray-500 text-sm mb-6">ou clique para selecionar do computador</p>
          
          <label 
            htmlFor="file-upload"
            className="px-6 py-2 bg-cyber-primary hover:bg-cyber-secondary text-black font-bold rounded cursor-pointer transition-colors"
          >
            SELECIONAR ARQUIVO
          </label>
        </div>

        {/* Status / Result Area */}
        <div className="bg-cyber-dark border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col">
          
          {!file && !analyzing && !result && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 opacity-50">
              <IconBox className="w-16 h-16 mb-4" />
              <p>Aguardando geometria...</p>
            </div>
          )}

          {/* Analysis Animation */}
          {analyzing && (
            <div className="flex-1 flex flex-col justify-center">
               <div className="mb-2 flex justify-between text-xs font-mono text-cyber-primary uppercase">
                 <span>{status}</span>
                 <span>{Math.round(progress)}%</span>
               </div>
               <div className="h-2 bg-black rounded-full overflow-hidden border border-white/10">
                 <div 
                   className="h-full bg-cyber-primary shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300"
                   style={{ width: `${progress}%` }}
                 />
               </div>
               
               {/* Decorative tech lines */}
               <div className="mt-8 space-y-2 opacity-50">
                 <div className="h-1 bg-white/5 w-3/4 animate-pulse"></div>
                 <div className="h-1 bg-white/5 w-1/2 animate-pulse delay-75"></div>
                 <div className="h-1 bg-white/5 w-full animate-pulse delay-150"></div>
               </div>
            </div>
          )}

          {/* Result Card */}
          {result && !analyzing && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyber-success/20 rounded text-cyber-success">
                     <IconFile />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 uppercase">Arquivo</p>
                    <p className="font-bold text-white truncate max-w-[150px]" title={file?.name}>{file?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase">Volume</p>
                  <p className="font-mono text-cyber-primary">{result.volume} cm³</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-3 rounded border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">Peso Estimado</p>
                  <p className="text-xl font-bold text-white">{result.weight}g</p>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">Tempo</p>
                  <div className="flex items-center gap-2">
                    <IconClock className="w-4 h-4 text-gray-400" />
                    <p className="text-xl font-bold text-white">{result.time}</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto bg-black/40 p-4 rounded-lg border border-cyber-secondary/30">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-400 text-sm">Orçamento Estimado</span>
                  <span className="text-3xl font-display font-bold text-cyber-secondary drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">
                    {formatPrice(result.price)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mb-4">*Valor sujeito a análise final técnica.</p>
                <a 
                  href={`https://wa.me/${CONTACT_INFO.phone.replace(/\D/g,'')}?text=Olá, fiz um orçamento no site. Arquivo: ${file?.name}, Valor aprox: ${formatPrice(result.price)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-3 bg-cyber-secondary hover:bg-white hover:text-black text-white font-bold text-center rounded uppercase tracking-wider transition-colors"
                >
                  Finalizar Pedido
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteCalculator;