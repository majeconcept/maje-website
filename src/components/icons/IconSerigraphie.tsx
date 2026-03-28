interface IconProps { className?: string; size?: number }

export function IconSerigraphie({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* Pochoir / grille sérigraphie */}
      <rect x="6" y="10" width="36" height="28" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="14" y1="10" x2="14" y2="38" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3"/>
      <line x1="22" y1="10" x2="22" y2="38" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3"/>
      <line x1="30" y1="10" x2="30" y2="38" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3"/>
      <line x1="6" y1="18" x2="42" y2="18" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3"/>
      <line x1="6" y1="26" x2="42" y2="26" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3"/>
      {/* Raclette */}
      <line x1="4" y1="8" x2="44" y2="8" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="4" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="32" y1="4" x2="32" y2="8" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}
