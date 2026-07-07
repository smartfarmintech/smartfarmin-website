import React from 'react';

export function AnimatedOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Primary green orb - top right */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-b from-green-600/30 via-green-500/15 to-transparent blur-3xl animate-pulse" />
      
      {/* Secondary green orb - bottom left */}
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-t from-green-500/20 via-green-600/10 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      {/* Accent orb - center right */}
      <div className="absolute top-1/3 -right-48 h-80 w-80 rounded-full bg-gradient-to-l from-green-400/15 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Floating circles */}
      <div className="absolute top-20 left-10 h-20 w-20 rounded-full border border-green-500/20 animate-pulse" />
      <div className="absolute top-40 right-20 h-32 w-32 rounded-full border border-green-500/10" style={{ animationDelay: '0.3s' }} />
      <div className="absolute bottom-20 left-1/4 h-24 w-24 rounded-full border border-green-500/15 animate-pulse" />
    </div>
  );
}

export function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
