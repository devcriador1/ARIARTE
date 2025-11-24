import React, { useState, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight, IconSparkles } from './Icons';
import { CONTACT_INFO } from '../constants';

const slides = [
  {
    id: 1,
    title: "SUA IMAGINAÇÃO É O NOSSO LIMITE",
    subtitle: "Do conceito à realidade tangível em filamento e resina.",
    image: "https://picsum.photos/id/58/1600/600",
    badge: "ARIARTE 3D",
    color: "from-cyber-secondary",
    cta: "Explorar Artes"
  },
  {
    id: 2,
    title: "PRODUTOS PERSONALIZADOS",
    subtitle: "Alta qualidade, acabamento premium e fidelidade técnica.",
    image: "https://picsum.photos/id/133/1600/600",
    badge: "QUALIDADE SUPERIOR",
    color: "from-cyber-primary",
    cta: "Ver Projetos"
  },
  {
    id: 3,
    title: "PROMOÇÕES ESPECIAIS",
    subtitle: "Confira as peças exclusivas com preços de outro mundo.",
    image: "https://picsum.photos/id/64/1600/600",
    badge: "OFERTA DA SEMANA",
    color: "from-cyber-accent",
    cta: "Comprar Agora"
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden border border-cyber-primary/30 group mb-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-black">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity md:mix-blend-normal"
            />
          </div>

          {/* Gradient Overlays */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-cyber-black/80 to-transparent mix-blend-multiply opacity-80`} />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent" />
          
          {/* Cyberpunk Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,6px_100%] pointer-events-none" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-30 max-w-4xl">
            <div className={`
              inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border w-fit backdrop-blur-md
              text-xs font-mono tracking-widest uppercase
              ${index === current ? 'animate-in slide-in-from-left fade-in duration-700' : ''}
              border-white/30 text-white bg-white/10
            `}>
              <IconSparkles className="w-3 h-3" />
              {slide.badge}
            </div>

            <h2 className={`
              text-3xl md:text-6xl font-display font-black text-white mb-2 leading-none
              ${index === current ? 'animate-in slide-in-from-bottom fade-in duration-700 delay-100' : ''}
            `}>
              {slide.title.split(' ').map((word, i) => (
                <span key={i} className="block md:inline mr-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {word}
                </span>
              ))}
            </h2>

            <p className={`
              text-gray-300 text-sm md:text-xl font-sans max-w-xl mb-8 border-l-4 pl-4 border-white/50
              ${index === current ? 'animate-in slide-in-from-bottom fade-in duration-700 delay-200' : ''}
            `}>
              {slide.subtitle}
            </p>

            <a 
              href={CONTACT_INFO.instagram}
              target="_blank"
              rel="noreferrer"
              className={`
              px-8 py-3 bg-white text-black font-bold font-display uppercase tracking-wider clip-corner
              hover:bg-cyber-primary transition-colors w-fit
              shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]
              ${index === current ? 'animate-in zoom-in fade-in duration-500 delay-300' : ''}
            `}>
              {slide.cta}
            </a>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/50 border border-white/10 hover:border-cyber-primary text-white hover:text-cyber-primary rounded-full backdrop-blur transition-all hover:scale-110 hidden md:block"
      >
        <IconChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/50 border border-white/10 hover:border-cyber-primary text-white hover:text-cyber-primary rounded-full backdrop-blur transition-all hover:scale-110 hidden md:block"
      >
        <IconChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`
              h-1 transition-all duration-300 rounded-full
              ${idx === current ? 'w-8 bg-cyber-primary shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'w-2 bg-white/30 hover:bg-white/60'}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;