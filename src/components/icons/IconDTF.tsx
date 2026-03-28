interface IconProps { className?: string; size?: number }

export function IconDTF({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* Imprimante / tête d'impression */}
      <rect x="8" y="16" width="32" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="14" y="8" width="20" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="14" y="32" width="20" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      {/* Buses impression */}
      <line x1="18" y1="36" x2="18" y2="42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="24" y1="36" x2="24" y2="44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="30" y1="36" x2="30" y2="42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Pixels couleur */}
      <rect x="20" y="20" width="3" height="3" fill="currentColor" opacity="0.6"/>
      <rect x="25" y="20" width="3" height="3" fill="currentColor" opacity="0.8"/>
      <rect x="20" y="25" width="3" height="3" fill="currentColor" opacity="0.4"/>
      <rect x="25" y="25" width="3" height="3" fill="currentColor"/>
    </svg>
  )
}
