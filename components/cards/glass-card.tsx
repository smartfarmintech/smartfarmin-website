'use client';

import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export function GlassCard({
  variant = 'md',
  hover = true,
  icon,
  title,
  description,
  children,
  className = '',
  ...props
}: GlassCardProps) {
  const variantClasses = {
    sm: 'p-4 lg:p-6',
    md: 'p-6 lg:p-8',
    lg: 'p-8 lg:p-10',
  };

  const hoverClass = hover ? 'hover:bg-white/10 hover:border-green-500/50 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-green-500/20' : '';

  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl transition-all duration-300 ${variantClasses[variant]} ${hoverClass} ${className}`}
      {...props}
    >
      {icon && <div className="mb-4 flex items-center justify-center">{icon}</div>}
      {title && <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>}
      {description && <p className="text-sm text-white/70 mb-4">{description}</p>}
      {children}
    </div>
  );
}
