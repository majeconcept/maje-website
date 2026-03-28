interface IconProps { className?: string; size?: number }

export function IconBroderie({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* Bobine de fil */}
      <ellipse cx="24" cy="12" rx="10" ry="5" stroke="currentColor" strokeWidth="1.5"/>
      <ellipse cx="24" cy="36" rx="10" ry="5" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="14" y1="12" x2="14" y2="36" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="34" y1="12" x2="34" y2="36" stroke="currentColor" strokeWidth="1.5"/>
      {/* Fil qui sort */}
      <path d="M34 24 C38 20 42 28 38 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Aiguille */}
      <line x1="38" y1="32" x2="44" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="44" cy="38" r="1.5" fill="currentColor"/>
    </svg>
  )
}
