import React from 'react'

export function Badge({ children, variant, className }: any) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        variant === 'outline' ? 'border border-gray-300 text-gray-700' : 'bg-gray-200 text-gray-800'
      } ${className || ''}`}
    >
      {children}
    </span>
  )
}
