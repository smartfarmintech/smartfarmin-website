'use client';

export function SunriseHeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient - sunrise sky to dark night */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950" />
      
      {/* Sun glow - golden sunrise orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      
      {/* Secondary sun reflection */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full blur-3xl opacity-15" />
      
      {/* Field green accent - agricultural landscape */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-900/30 via-green-800/10 to-transparent" />
      
      {/* Organic farm field texture with animated gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-green-950 via-slate-950 to-transparent opacity-40" />
      
      {/* Accent light rays */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-yellow-300 to-transparent blur-sm" />
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-amber-400 to-transparent blur-sm" />
      </div>
      
      {/* Animated clouds/mist */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent blur-2xl animate-pulse" style={{ animationDuration: '8s' }} />
      </div>
    </div>
  )
}
