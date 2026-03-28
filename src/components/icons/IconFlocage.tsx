interface IconProps { className?: string; size?: number }

export function IconFlocage({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* T-shirt silhouette */}
      <path
        d="M16 8 L8 14 L12 18 L12 40 L36 40 L36 18 L40 14 L32 8 L28 12 C26 14 22 14 20 12 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Texture velours — lignes parallèles */}
      <line x1="18" y1="22" x2="18" y2="36" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2"/>
      <line x1="22" y1="22" x2="22" y2="36" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2"/>
      <line x1="26" y1="22" x2="26" y2="36" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2"/>
      <line x1="30" y1="22" x2="30" y2="36" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2"/>
    </svg>
  )
}
