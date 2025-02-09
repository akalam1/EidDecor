import React from 'react';
import { Lamp } from 'lucide-react';

const FloatingLanterns = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute floating-lantern"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            '--delay': `${i * 0.5}s`,
          } as React.CSSProperties}
        >
          <div className="relative">
            <Lamp 
              className="w-8 h-8 text-yellow-500/30"
              style={{ filter: 'drop-shadow(0 0 10px rgba(234, 179, 8, 0.3))' }}
            />
            <div className="absolute inset-0 animate-glow rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingLanterns;