'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface IntersectionAnimationProps {
  children: ReactNode
  animationClass?: string
  threshold?: number
  delay?: number
}

/**
 * Premium scroll-triggered animation component
 * Triggers animations when elements enter viewport
 */
export function ScrollAnimation({
  children,
  animationClass = 'scale-in',
  threshold = 0.2,
  delay = 0,
}: IntersectionAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add(animationClass)
          }, delay)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [animationClass, threshold, delay])

  return <div ref={ref}>{children}</div>
}

/**
 * Parallax scroll effect for hero sections
 */
export function ParallaxScroll({
  children,
  intensity = 0.5,
}: {
  children: ReactNode
  intensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.scrollY
      const parallax = (scrolled - (window.innerHeight - rect.top)) * intensity

      ref.current.style.transform = `translateY(${parallax}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [intensity])

  return (
    <div ref={ref} className="will-change-transform transition-transform duration-300 ease-out">
      {children}
    </div>
  )
}

/**
 * Staggered animation for list items
 */
export function StaggerAnimation({
  children,
  animationClass = 'slide-in-up',
  staggerDelay = 0.1,
  threshold = 0.1,
}: {
  children: ReactNode[]
  animationClass?: string
  staggerDelay?: number
  threshold?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('[data-stagger-item]')
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add(animationClass)
            }, index * (staggerDelay * 1000))
          })
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [animationClass, staggerDelay, threshold])

  return (
    <div ref={containerRef} className="space-y-4">
      {children.map((child, index) => (
        <div key={index} data-stagger-item className="opacity-0">
          {child}
        </div>
      ))}
    </div>
  )
}

/**
 * Counter animation for metrics
 */
export function CounterAnimation({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
}: {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = React.useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let startTime: number
        const animate = (currentTime: number) => {
          if (!startTime) startTime = currentTime
          const progress = Math.min((currentTime - startTime) / duration, 1)
          setCount(Math.floor(value * progress))

          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        requestAnimationFrame(animate)
        observer.unobserve(entry.target)
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, duration])

  return (
    <div ref={ref} className="font-bold text-4xl">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  )
}

/**
 * Text shimmer effect for headings
 */
export function ShimmerText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(90deg, #10b981, #34d399, #10b981)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s infinite',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Floating button with pulse effect
 */
export function PulseButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`relative group ${className}`}
      style={{
        animation: 'pulse-subtle 2s ease-in-out infinite',
      }}
    >
      <div className="absolute inset-0 bg-emerald-500 rounded-full blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
      <div className="relative bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 transform group-hover:scale-105">
        {children}
      </div>
    </button>
  )
}

/**
 * Gradient border animation
 */
export function GradientBorderCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 rounded-2xl p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(45deg, #10b981, #f59e0b, #10b981)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 3s ease infinite',
        }}
      />
      <div className="relative bg-background rounded-2xl p-6">{children}</div>
    </div>
  )
}

// Re-export React for use in the component
import React from 'react'
