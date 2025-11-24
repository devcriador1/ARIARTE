import React, { useState, useMemo, useRef } from 'react';
import { PRODUCTS, CATEGORIES, MATERIALS, SCALES, DETAIL_LEVELS, ALL_COLORS, CONTACT_INFO, PRODUCT_TYPES } from './constants';
import { Product, Category, Material, Scale, DetailLevel, FilterState, ProductType } from './types';
import DetailModal from './components/DetailModal';
import ChatBot from './components/ChatBot';
import HeroCarousel from './components/HeroCarousel';
import QuoteCalculator from './components/QuoteCalculator';
import FallingObjectsBackground from './components/FallingObjectsBackground';
import { IconBox, IconSearch, IconFilter, IconInstagram, IconPhone, IconX, IconMenu, IconEyedropper, IconCpu, IconDownload } from './components/Icons';

function App() {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<'shop' | 'quote'>('shop');
  
  // Advanced Filter State
  const [filters, setFilters] = useState<FilterState>({
    category: 'Todas',
    materials: [],
    scales: [],
    detailLevel: [],
    colors: [],
    searchTerm: '',
    types: []
  });

  // Color Picker State
  const [pickerTab, setPickerTab] = useState<'solid' | 'gradient'>('solid');
  const [customHex, setCustomHex] = useState('#FFDE00');
  const [detectedColorName, setDetectedColorName] = useState<string>('');
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = filters.category === 'Todas' || product.category === filters.category;
      const matchesSearch = product.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesMaterial = filters.materials.length === 0 || filters.materials.includes(product.material);
      const matchesScale = filters.scales.length === 0 || filters.scales.includes(product.scale);
      const matchesDetail = filters.detailLevel.length === 0 || filters.detailLevel.includes(product.detailLevel);
      const matchesColor = filters.colors.length === 0 || product.colors.some(c => filters.colors.includes(c));
      const matchesType = filters.types.length === 0 || filters.types.includes(product.type);

      return matchesCategory && matchesSearch && matchesMaterial && matchesScale && matchesDetail && matchesColor && matchesType;
    });
  }, [filters]);

  const newArrivals = useMemo(() => PRODUCTS.filter(p => p.isNew), []);

  // Compute Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'Todas': PRODUCTS.length };
    CATEGORIES.forEach(cat => {
      counts[cat] = PRODUCTS.filter(p => p.category === cat).length;
    });
    return counts;
  }, []);

  const toggleFilter = <T extends string>(
    key: keyof Pick<FilterState, 'materials' | 'scales' | 'detailLevel' | 'colors' | 'types'>,
    value: T
  ) => {
    setFilters(prev => {
      const current = prev[key] as string[];
      const exists = current.includes(value);
      // If toggling off, clear detected name
      if (exists && key === 'colors' && value === detectedColorName) {
        setDetectedColorName('');
      }
      return {
        ...prev,
        [key]: exists ? current.filter(v => v !== value) : [...current, value]
      };
    });
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
    }
  };

  const getSwatchColor = (colorName: string) => {
    const map: Record<string, string> = {
      'Preto': '#1a1a1a',
      'Branco': '#f5f5f5',
      'Azul': '#3b82f6',
      'Vermelho': '#ef4444',
      'Neon': '#ccfbf1',
      'Cinza': '#6b7280',
      'Laranja': '#f97316',
      'Rainbow': 'linear-gradient(45deg, red, yellow, green, blue)',
      'Gradiente': 'linear-gradient(45deg, #FFDE00, #ef4444, #3b82f6)',
      'Dourado': '#eab308',
      'Roxo': '#a855f7',
      'Seda': '#fef3c7',
      'Amarelo': '#FFDE00',
      'Cinza Primer': '#9ca3af',
      'Cinza Transparente': 'rgba(107, 114, 128, 0.5)'
    };
    return map[colorName] || '#cccccc';
  };

  // --- Smart Color Matching Logic ---
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getColorDistance = (color1: {r:number, g:number, b:number}, color2: {r:number, g:number, b:number}) => {
    return Math.sqrt(
      Math.pow(color1.r - color2.r, 2) +
      Math.pow(color1.g - color2.g, 2) +
      Math.pow(color1.b - color2.b, 2)
    );
  };

  const findClosestCatalogColor = (hex: string): string | null => {
    const inputRgb = hexToRgb(hex);
    if (!inputRgb) return null;

    const catalogReferences: Record<string, string> = {
      'Preto': '#000000',
      'Branco': '#FFFFFF',
      'Azul': '#0000FF',
      'Vermelho': '#FF0000',
      'Neon': '#00FF00',
      'Cinza': '#808080',
      'Laranja': '#FFA500',
      'Dourado': '#FFD700',
      'Roxo': '#800080',
      'Seda': '#FFFDD0',
      'Amarelo': '#FFFF00',
      'Cinza Primer': '#A9A9A9'
    };

    let minDistance = Infinity;
    let closestColor = null;

    Object.entries(catalogReferences).forEach(([name, refHex]) => {
      const refRgb = hexToRgb(refHex);
      if (refRgb) {
        const distance = getColorDistance(inputRgb, refRgb);
        if (distance < minDistance) {
          minDistance = distance;
          closestColor = name;
        }
      }
    });

    return closestColor;
  };

  const handleColorChange = (hex: string) => {
    setCustomHex(hex);
    
    const match = findClosestCatalogColor(hex);
    if (match) {
      setDetectedColorName(match);
      if (!filters.colors.includes(match)) {
        toggleFilter('colors', match);
      }
    }
  };

  const handleEyeDropper = async () => {
    if (!('EyeDropper' in window)) {
      alert('Seu navegador não suporta a ferramenta de conta-gotas.');
      return;
    }
    try {
      // @ts-ignore
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      handleColorChange(result.sRGBHex);
      setPickerTab('solid');
    } catch (e) {
      console.log('User canceled the selection');
    }
  };

  const handleCustomColorSelect = () => {
     if (pickerTab === 'gradient') {
        if (!filters.colors.includes('Gradiente')) toggleFilter('colors', 'Gradiente');
     } else {
        colorInputRef.current?.click();
     }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const switchView = (view: 'shop' | 'quote') => {
    setCurrentView(view);
    if (window.innerWidth < 768) setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative font-sans text-gray-100 overflow-x-hidden bg-cyber-black selection:bg-cyber-primary selection:text-black">
      
      <FallingObjectsBackground />
      <div className="fixed inset-0 z-0 cyber-grid bg-grid-pattern opacity-10 pointer-events-none"></div>
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-24 bg-cyber-black/80 backdrop-blur-xl border-b border-cyber-primary/20 z-40 transition-all shadow-2xl">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleSidebar}
              className="p-2 text-cyber-primary hover:text-white border border-cyber-primary/20 hover:bg-cyber-primary/10 rounded-md transition-all hover:scale-105"
              title="Toggle Menu"
            >
              <IconMenu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 cursor-pointer" onClick={() => switchView('shop')}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyber-secondary to-cyber-primary rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <img 
                  src={CONTACT_INFO.logoUrl} 
                  alt="Ariarte 3D" 
                  className="relative w-12 h-12 rounded-full border-2 border-cyber-black object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-display font-bold tracking-widest text-white leading-none">
                  ARI<span className="text-cyber-primary">ARTE</span>
                </h1>
                <span className="text-[10px] text-gray-400 tracking-[0.2em] font-mono">3D PRINTING STUDIO</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
             <div className="relative group">
              <input 
                type="text" 
                placeholder="Buscar no catálogo..." 
                value={filters.searchTerm}
                onChange={(e) => {
                  setFilters(prev => ({...prev, searchTerm: e.target.value}));
                  setCurrentView('shop');
                }}
                className="bg-black/50 border border-white/10 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:border-cyber-primary transition-all text-sm shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              />
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyber-primary" />
             </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-28 pb-20 px-4 lg:px-8 max-w-[1920px] mx-auto flex items-start gap-8">
        
        {/* Sidebar Filters */}
        <aside className={`
          flex-shrink-0 transition-all duration-300 z-30
          ${isDesktopSidebarOpen ? 'w-0 opacity-0 md:w-72 md:opacity-100' : 'w-0 opacity-0'}
          fixed inset-y-0 left-0 md:static md:block
          ${isMobileMenuOpen ? 'translate-x-0 w-80 bg-cyber-black/95 p-6 border-r border-cyber-primary/20 backdrop-blur-xl' : 'md:translate-x-0'}
          ${!isMobileMenuOpen && 'hidden md:block'}
        `}>
          <div className="flex justify-between items-center md:hidden mb-6">
            <h3 className="text-xl font-display font-bold text-white">MENU</h3>
            <button onClick={() => setIsMobileMenuOpen(false)}><IconX /></button>
          </div>

          <div className="md:sticky md:top-28 h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar space-y-8 pb-10">
            
            {/* SERVICES SECTION (NEW) */}
            <div>
               <h4 className="text-xs font-bold text-cyber-secondary uppercase mb-4 tracking-widest flex items-center gap-2">
                  <span className="w-1 h-4 bg-cyber-secondary rounded-full"></span>
                  Ferramentas & Serviços
                </h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => switchView('shop')}
                    className={`w-full text-left px-4 py-3 rounded border transition-all flex items-center gap-3 ${
                      currentView === 'shop' 
                      ? 'bg-cyber-primary/10 border-cyber-primary text-cyber-primary' 
                      : 'bg-white/5 border-transparent text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <IconBox />
                    <span className="font-bold">Catálogo Geral</span>
                  </button>
                  
                  <button 
                    onClick={() => switchView('quote')}
                    className={`w-full text-left px-4 py-3 rounded border transition-all flex items-center gap-3 ${
                      currentView === 'quote' 
                      ? 'bg-cyber-primary/10 border-cyber-primary text-cyber-primary' 
                      : 'bg-white/5 border-transparent text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <IconCpu />
                    <div>
                      <span className="font-bold block">Orçamento 3D</span>
                      <span className="text-[10px] text-gray-500 uppercase">Slicer Simulador</span>
                    </div>
                  </button>
                </div>
            </div>

            {currentView === 'shop' && (
              <>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Filtros</h3>
                  <button 
                    onClick={() => setFilters({category: 'Todas', materials: [], scales: [], detailLevel: [], colors: [], searchTerm: '', types: []})}
                    className="text-[10px] text-cyber-secondary hover:underline transition-colors"
                  >
                    Limpar Tudo
                  </button>
                </div>

                {/* Product Type Filter (Physical vs Digital) */}
                <div>
                  <h4 className="text-xs font-bold text-cyber-primary uppercase mb-4 tracking-widest">Tipo de Produto</h4>
                  <div className="flex flex-col gap-2">
                    {PRODUCT_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleFilter('types', type)}
                        className={`text-left text-sm py-1.5 px-3 rounded border transition-all ${
                          filters.types.includes(type)
                            ? 'bg-cyber-primary text-black font-bold border-cyber-primary'
                            : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h4 className="text-xs font-bold text-cyber-primary uppercase mb-4 tracking-widest flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyber-primary rounded-full"></span>
                    Categorias
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setFilters(prev => ({...prev, category: 'Todas'}))}
                      className={`group w-full flex items-center justify-between text-left text-sm py-2 px-3 rounded transition-all ${
                        filters.category === 'Todas' 
                        ? 'bg-cyber-primary text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>TODAS</span>
                      <span className={`text-[10px] py-0.5 px-2 rounded-full ${
                        filters.category === 'Todas' ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-500'
                      }`}>
                        {categoryCounts['Todas']}
                      </span>
                    </button>
                    {CATEGORIES.filter(cat => cat !== Category.ALL).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilters(prev => ({...prev, category: cat}))}
                        className={`group w-full flex items-center justify-between text-left text-sm py-2 px-3 rounded transition-all ${
                          filters.category === cat 
                          ? 'bg-cyber-primary text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{cat.toUpperCase()}</span>
                        <span className={`text-[10px] py-0.5 px-2 rounded-full ${
                          filters.category === cat ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-500'
                        }`}>
                          {categoryCounts[cat] || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material Filter */}
                <div>
                  <h4 className="text-xs font-bold text-cyber-primary uppercase mb-4 tracking-widest flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyber-secondary rounded-full"></span>
                    Material
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {MATERIALS.map(mat => (
                      <button
                        key={mat}
                        onClick={() => toggleFilter('materials', mat)}
                        className={`px-3 py-1.5 text-xs rounded border transition-all ${
                          filters.materials.includes(mat) 
                          ? 'bg-cyber-secondary/20 border-cyber-secondary text-white shadow-[0_0_10px_rgba(217,70,239,0.2)]' 
                          : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div className="bg-black/40 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm">
                  <div className="flex border-b border-white/10">
                     <button 
                       onClick={() => setPickerTab('solid')}
                       className={`flex-1 py-2 text-xs font-bold uppercase transition-colors ${pickerTab === 'solid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                     >
                       Cor Sólida
                     </button>
                     <button 
                       onClick={() => setPickerTab('gradient')}
                       className={`flex-1 py-2 text-xs font-bold uppercase transition-colors ${pickerTab === 'gradient' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                     >
                       Gradiente
                     </button>
                  </div>
                  
                  <div className="p-3 space-y-3">
                    <div 
                      className="h-20 w-full rounded border border-white/20 shadow-inner relative group cursor-pointer transition-all hover:border-white/40"
                      style={{ background: pickerTab === 'gradient' ? 'linear-gradient(45deg, #FFDE00, #ef4444, #3b82f6)' : customHex }}
                      onClick={handleCustomColorSelect}
                    >
                       {pickerTab === 'solid' && (
                          <input 
                            type="color" 
                            ref={colorInputRef}
                            value={customHex}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          />
                       )}
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                         <span className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">
                           {pickerTab === 'solid' ? 'Abrir Espectro' : 'Selecionar Filtro'}
                         </span>
                       </div>
                    </div>

                    {pickerTab === 'solid' && (
                      <div className="flex flex-col gap-1 bg-white/5 p-2 rounded">
                        <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase font-mono">
                           <span>HEX: {customHex}</span>
                           {detectedColorName && <span className="text-cyber-primary font-bold">MATCH: {detectedColorName.toUpperCase()}</span>}
                        </div>
                        <div className="h-1 w-full rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 opacity-50" />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleEyeDropper}
                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-cyber-primary/10 hover:bg-cyber-primary/20 border border-cyber-primary/30 rounded text-cyber-primary transition-all hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                        title="Capturar cor da tela"
                      >
                        <IconEyedropper className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Conta-Gotas</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Colors */}
                <div>
                  <h4 className="text-xs font-bold text-cyber-primary uppercase mb-4 tracking-widest flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyber-accent rounded-full"></span>
                    Presets de Cor
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {ALL_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleFilter('colors', color)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 relative ${
                          filters.colors.includes(color) 
                          ? 'border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-110' 
                          : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        style={{ background: getSwatchColor(color) }}
                        title={color}
                      >
                        {filters.colors.includes(color) && <div className="w-2 h-2 bg-white rounded-full shadow-sm mix-blend-difference absolute" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scale Filter */}
                <div>
                  <h4 className="text-xs font-bold text-cyber-primary uppercase mb-4 tracking-widest">Escala</h4>
                  <div className="space-y-2 bg-black/20 p-3 rounded-lg border border-white/5">
                    {SCALES.map(scale => (
                      <label key={scale} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          filters.scales.includes(scale) ? 'bg-cyber-primary border-cyber-primary' : 'border-white/20 group-hover:border-white/50'
                        }`}>
                          {filters.scales.includes(scale) && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{scale}</span>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={filters.scales.includes(scale)}
                          onChange={() => toggleFilter('scales', scale)}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Detail Level */}
                <div>
                  <h4 className="text-xs font-bold text-cyber-primary uppercase mb-4 tracking-widest">Nível de Detalhe</h4>
                  <div className="flex flex-col gap-2">
                    {DETAIL_LEVELS.map(level => (
                      <button
                        key={level}
                        onClick={() => toggleFilter('detailLevel', level)}
                        className={`text-left text-sm py-1 px-2 rounded transition-colors ${
                          filters.detailLevel.includes(level) 
                            ? 'text-cyber-accent font-bold bg-cyber-accent/10 border-l-2 border-cyber-accent' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>

        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 transition-all duration-300">
          
          {currentView === 'quote' ? (
            <QuoteCalculator />
          ) : (
            <>
              {/* Hero Carousel */}
              <HeroCarousel />

              {/* New Arrivals Section */}
              {newArrivals.length > 0 && filters.category === 'Todas' && !filters.searchTerm && filters.types.length === 0 && (
                <section className="mb-20">
                  <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-2xl font-display font-bold text-white tracking-widest flex items-center gap-2">
                        <IconBox className="text-cyber-secondary" />
                        NOVIDADES
                      </h3>
                      <p className="text-xs text-cyber-secondary mt-1">Lançamentos recentes do laboratório</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {newArrivals.slice(0, 4).map(product => (
                      <div 
                        key={`new-${product.id}`}
                        onClick={() => setSelectedProduct(product)}
                        className="group relative h-96 bg-cyber-dark border border-white/5 hover:border-cyber-secondary transition-all cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-cyber-secondary/20 flex flex-col"
                      >
                        <div className="absolute inset-0 z-0 h-2/3">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        </div>
                        
                        {/* Type Badge (Digital/Physical) */}
                        {product.type === ProductType.DIGITAL && (
                          <div className="absolute top-0 left-0 p-3">
                            <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded shadow-lg">
                              STL / DIGITAL
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-cyber-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay pointer-events-none"></div>

                        <div className="absolute top-0 right-0 p-3">
                          <div className="bg-cyber-secondary text-black text-[10px] font-black px-3 py-1 rounded shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform">
                            NEW ARRIVAL
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform h-1/3 flex flex-col justify-between bg-cyber-dark/80 backdrop-blur-sm">
                          <div>
                            <h4 className="font-display font-bold text-white text-xl truncate mb-1">{product.name}</h4>
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-mono text-cyber-secondary bg-cyber-secondary/10 px-2 py-0.5 rounded">{product.category}</p>
                              {product.type === ProductType.DIGITAL ? <IconDownload className="w-4 h-4 text-blue-400" /> : <IconBox className="w-4 h-4 text-white" />}
                            </div>
                          </div>

                          <div className="mt-2">
                            {product.promotionalPrice ? (
                              <div className="flex items-baseline gap-2">
                                <span className="text-[10px] text-gray-500 uppercase">DE</span>
                                <span className="text-xs text-gray-500 line-through decoration-red-500">{formatPrice(product.price)}</span>
                                <span className="text-[10px] text-cyber-secondary uppercase">POR</span>
                                <span className="text-lg font-bold text-cyber-secondary drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">{formatPrice(product.promotionalPrice)}</span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Main Grid Control Bar */}
              <div className="mb-6 flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5 sticky top-24 z-30 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyber-primary/20 rounded">
                    <IconFilter className="w-4 h-4 text-cyber-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {filters.category === 'Todas' ? 'TODOS OS MODELOS' : filters.category.toUpperCase()}
                  </h3>
                </div>
                <span className="text-sm font-mono text-cyber-primary bg-cyber-primary/10 px-3 py-1 rounded-full border border-cyber-primary/20">
                  {filteredProducts.length} ITENS
                </span>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="group relative bg-cyber-dark/50 border border-white/5 hover:border-cyber-primary/50 transition-all duration-300 cursor-pointer overflow-hidden rounded-lg hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col h-full"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-black/50">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Product Type Badge */}
                      {product.type === ProductType.DIGITAL && (
                        <div className="absolute top-2 left-2 z-10 bg-blue-600/80 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded border border-blue-400">
                          STL
                        </div>
                      )}
                      
                      {product.type === ProductType.PHYSICAL && (
                        <div className="absolute top-2 left-2 flex gap-1 z-10">
                          {product.colors.slice(0, 2).map((c, i) => (
                            <div key={i} className="w-3 h-3 rounded-full border border-white/30 shadow-sm" style={{ background: getSwatchColor(c) }}></div>
                          ))}
                          {product.colors.length > 2 && <div className="w-3 h-3 rounded-full bg-gray-800 border border-white/30 flex items-center justify-center text-[8px] text-white">+</div>}
                        </div>
                      )}
                      
                      {product.promotionalPrice && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md transform rotate-3 z-10">
                          OFERTA
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-20">
                        <span className="font-display text-cyber-primary border border-cyber-primary px-6 py-2 rounded tracking-widest uppercase text-sm hover:bg-cyber-primary hover:text-black transition-colors">
                          Ver Detalhes
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 relative flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-display font-bold text-white group-hover:text-cyber-primary transition-colors truncate w-full" title={product.name}>
                          {product.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 mb-4">
                        {product.type === ProductType.PHYSICAL ? (
                          <>
                            <span className="px-2 py-0.5 border border-white/10 rounded bg-white/5 uppercase">
                              {product.material}
                            </span>
                            <span className="px-2 py-0.5 border border-white/10 rounded bg-white/5 uppercase">
                              {product.scale}
                            </span>
                          </>
                        ) : (
                          <span className="px-2 py-0.5 border border-blue-500/30 text-blue-400 rounded bg-blue-500/10 uppercase flex items-center gap-1">
                            <IconDownload className="w-3 h-3" />
                            {product.fileSize || 'N/A'}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-3 border-t border-white/5 flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Valor</span>
                            {product.promotionalPrice ? (
                              <div className="flex flex-col leading-none">
                                <span className="text-[10px] text-gray-500 line-through">De {formatPrice(product.price)}</span>
                                <span className="text-lg font-bold text-cyber-primary drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                                  Por {formatPrice(product.promotionalPrice)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
                            )}
                        </div>

                        {product.type === ProductType.PHYSICAL && (
                          <div className="flex gap-1" title={`Dificuldade: ${product.difficulty}`}>
                              {[1,2,3,4].map(i => (
                                <div 
                                  key={i} 
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    (product.difficulty === 'Fácil' && i <= 1) ||
                                    (product.difficulty === 'Médio' && i <= 2) ||
                                    (product.difficulty === 'Difícil' && i <= 3) ||
                                    (product.difficulty === 'Extremo' && i <= 4)
                                    ? 'bg-cyber-primary shadow-[0_0_5px_rgba(6,182,212,0.8)]' 
                                    : 'bg-white/10'
                                  }`}
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-lg border border-white/10">
                  <IconBox className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <p className="text-2xl text-gray-500 font-display">NENHUM ARTEFATO ENCONTRADO</p>
                  <p className="text-gray-600 mt-2">Ajuste os filtros de busca para localizar novos modelos.</p>
                  <button 
                    onClick={() => setFilters({category: 'Todas', materials: [], scales: [], detailLevel: [], colors: [], searchTerm: '', types: []})}
                    className="mt-6 px-6 py-2 bg-cyber-primary/20 text-cyber-primary border border-cyber-primary hover:bg-cyber-primary hover:text-black transition-colors rounded"
                  >
                    LIMPAR FILTROS
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <DetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {/* Chat Bot */}
      <ChatBot />

      {/* Footer */}
      <footer className="bg-cyber-black py-16 border-t border-cyber-primary/20 text-center relative z-10 mt-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyber-primary/50 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <img 
              src={CONTACT_INFO.logoUrl} 
              alt="Ariarte Logo" 
              className="w-20 h-20 rounded-full border-4 border-cyber-dark shadow-[0_0_30px_rgba(6,182,212,0.3)]" 
            />
            <div className="text-center">
              <p className="font-display font-bold text-3xl text-white tracking-widest">ARIARTE</p>
              <p className="text-cyber-primary text-xs tracking-[0.5em] uppercase mt-1">Future Fabrication</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-lg mx-auto">
             <a 
               href={CONTACT_INFO.instagram} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="flex items-center justify-center gap-3 p-4 bg-white/5 rounded hover:bg-white/10 transition-all border border-transparent hover:border-cyber-secondary group"
             >
               <div className="p-2 bg-cyber-secondary/20 rounded-full text-cyber-secondary group-hover:scale-110 transition-transform">
                 <IconInstagram />
               </div>
               <div className="text-left">
                 <span className="block text-xs text-gray-500 uppercase">Siga no Instagram</span>
                 <span className="block text-white font-bold">{CONTACT_INFO.instagramHandle}</span>
               </div>
             </a>
             
             <div className="flex items-center justify-center gap-3 p-4 bg-white/5 rounded hover:bg-white/10 transition-all border border-transparent hover:border-cyber-primary group cursor-pointer">
               <div className="p-2 bg-cyber-primary/20 rounded-full text-cyber-primary group-hover:scale-110 transition-transform">
                 <IconPhone />
               </div>
               <div className="text-left">
                 <span className="block text-xs text-gray-500 uppercase">Whatsapp / Contato</span>
                 <span className="block text-white font-bold">{CONTACT_INFO.phone}</span>
               </div>
             </div>
          </div>

          <p className="text-gray-600 text-sm font-mono">
            © 2024 Ariarte 3D. <br/>
            Transformando imaginação em realidade tangível.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;