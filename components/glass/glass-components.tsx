'use client'

import { ReactNode } from 'react'

interface GlassProps {
  children: ReactNode
  className?: string
  variant?: 'subtle' | 'prominent' | 'glow-green' | 'glow-gold'
}

/**
 * Glass Card - Base glassmorphism component
 */
export function GlassCard({
  children,
  className = '',
  variant = 'subtle',
}: GlassProps) {
  const variants = {
    subtle: 'glass-subtle',
    prominent: 'glass-prominent',
    'glow-green': 'glass-glow-green',
    'glow-gold': 'glass-glow-gold',
  }

  return (
    <div className={`${variants[variant]} rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Glass Panel - Full-width glass section
 */
export function GlassPanel({
  children,
  className = '',
  variant = 'prominent',
}: GlassProps) {
  const variants = {
    subtle: 'glass-subtle',
    prominent: 'glass-prominent',
    'glow-green': 'glass-glow-green',
    'glow-gold': 'glass-glow-gold',
  }

  return (
    <div
      className={`${variants[variant]} rounded-3xl p-8 w-full ${className}`}
      style={{
        backdropFilter: 'blur(24px)',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Glass Button - Glassmorphic button
 */
export function GlassButton({
  children,
  onClick,
  variant = 'prominent',
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'subtle' | 'prominent' | 'glow-green' | 'glow-gold'
  className?: string
}) {
  const variants = {
    subtle: 'glass-subtle hover:border-white/20',
    prominent: 'glass-prominent hover:border-white/30',
    'glow-green': 'glass-glow-green',
    'glow-gold': 'glass-glow-gold',
  }

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  )
}

/**
 * Glass Input - Glassmorphic input field
 */
export function GlassInput({
  placeholder = '',
  value = '',
  onChange,
  className = '',
}: {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`glass-subtle rounded-xl px-4 py-3 w-full text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 ${className}`}
    />
  )
}

/**
 * Glass Badge - Glassmorphic badge/pill
 */
export function GlassBadge({
  children,
  variant = 'subtle',
  className = '',
}: {
  children: ReactNode
  variant?: 'subtle' | 'prominent' | 'success' | 'warning' | 'error'
  className?: string
}) {
  const variants = {
    subtle: 'glass-subtle text-slate-300',
    prominent: 'glass-prominent text-white',
    success: 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300',
    warning: 'bg-amber-500/20 border border-amber-500/50 text-amber-300',
    error: 'bg-red-500/20 border border-red-500/50 text-red-300',
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

/**
 * Glass Overlay - Glassmorphic modal/overlay base
 */
export function GlassOverlay({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-md z-50 ${className}`}
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Glass Header - Hero header with glassmorphism
 */
export function GlassHeader({
  title,
  subtitle,
  className = '',
}: {
  title: ReactNode
  subtitle?: ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h1 className="text-5xl md:text-6xl font-bold text-white font-serif">{title}</h1>
      {subtitle && <p className="text-xl text-slate-300 max-w-2xl">{subtitle}</p>}
    </div>
  )
}

/**
 * Glass Grid - Responsive grid with glass cards
 */
export function GlassGrid({
  children,
  columns = 3,
  gap = 6,
  className = '',
}: {
  children: ReactNode[]
  columns?: 1 | 2 | 3 | 4
  gap?: number
  className?: string
}) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const gapClass = {
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
  }

  return (
    <div className={`grid ${gridClass[columns]} ${gapClass[gap as keyof typeof gapClass]} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Glass Divider - Decorative glassmorphic divider
 */
export function GlassDivider({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent ${className}`}
      style={{
        backdropFilter: 'blur(1px)',
      }}
    />
  )
}

/**
 * Glass Tooltip - Glassmorphic tooltip
 */
export function GlassTooltip({
  content,
  children,
  position = 'top',
}: {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}) {
  const positions = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  }

  return (
    <div className="group relative inline-flex">
      {children}
      <div
        className={`absolute hidden group-hover:block ${positions[position]} glass-prominent rounded-lg px-3 py-2 text-sm text-white whitespace-nowrap z-50`}
      >
        {content}
      </div>
    </div>
  )
}

/**
 * Glass Loading - Glassmorphic loading spinner
 */
export function GlassLoading({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`${sizes[size]} relative ${className}`}>
      <div className="absolute inset-0 glass-subtle rounded-full opacity-50" />
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400"
        style={{
          animation: 'spin 1s linear infinite',
        }}
      />
    </div>
  )
}

/**
 * Glass Stack - Stacked glass cards effect
 */
export function GlassStack({
  children,
  layers = 3,
  className = '',
}: {
  children: ReactNode
  layers?: number
  className?: string
}) {
  return (
    <div className={`relative ${className}`} style={{ perspective: '1000px' }}>
      {Array.from({ length: layers }).map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 glass-subtle rounded-2xl"
          style={{
            transform: `translateY(${(layers - i - 1) * 8}px) translateX(${(layers - i - 1) * 8}px)`,
            opacity: 0.5 - i * 0.15,
            zIndex: layers - i,
          }}
        />
      ))}
      <div className="relative glass-prominent rounded-2xl p-6 z-50">{children}</div>
    </div>
  )
}
