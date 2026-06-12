import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/utils'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

type RevealState = 'static' | 'hidden' | 'visible'

function canAnimate() {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return false
  }

  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return rect.top < window.innerHeight * 0.85 && rect.bottom > 0
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<RevealState>('static')

  useEffect(() => {
    if (!canAnimate()) {
      setState('visible')
      return
    }

    const element = ref.current
    if (!element) {
      setState('visible')
      return
    }

    if (isInViewport(element)) {
      setState('visible')
      return
    }

    setState('hidden')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        state !== 'static' && 'transition-all duration-[600ms] ease-out',
        state === 'hidden' && 'translate-y-4 opacity-0',
        (state === 'visible' || state === 'static') && 'translate-y-0 opacity-100',
        className,
      )}
      style={state === 'visible' && delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
