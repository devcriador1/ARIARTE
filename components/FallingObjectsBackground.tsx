import React, { useEffect, useState } from 'react';
import { IconBox, IconHexagon, IconTriangle, IconCircleTech, IconCpu } from './Icons';

const FallingObjectsBackground: React.FC = () => {
  const [items, setItems] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
    opacity: number;
    Icon: React.ElementType;
    color: string;
  }>>([]);

  useEffect(() => {
    // Generate particles only on client side to match "hydration"
    const icons = [IconBox, IconHexagon, IconTriangle, IconCircleTech, IconCpu];
    const colors = ['text-cyber-primary', 'text-cyber-secondary', 'text-cyber-accent', 'text-gray-700'];
    
    const newItems = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      delay: Math.random() * 5, // seconds
      duration: 10 + Math.random() * 20, // seconds (slow fall)
      size: 16 + Math.random() * 32, // px
      opacity: 0.05 + Math.random() * 0.15, // Low opacity
      Icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    setItems(newItems);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Overlay to darken background for readability */}
      <div className="absolute inset-0 bg-cyber-black/90 z-0"></div>
      
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute top-[-10%] ${item.color} animate-fall`}
          style={{
            left: `${item.left}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            opacity: item.opacity,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear'
          }}
        >
          <item.Icon className="w-full h-full" />
        </div>
      ))}
      
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }
        .animate-fall {
          animation-name: fall;
        }
      `}</style>
    </div>
  );
};

export default FallingObjectsBackground;