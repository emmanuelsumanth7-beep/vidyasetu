import json
import re

svg_code = """<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="38%" r="70%">
      <stop offset="0%" stop-color="#2B2F6B"/>
      <stop offset="100%" stop-color="#161A40"/>
    </radialGradient>

    <linearGradient id="bulbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFEB99"/>
      <stop offset="55%" stop-color="#FFD166"/>
      <stop offset="100%" stop-color="#F2A93C"/>
    </linearGradient>

    <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#B4B9C2"/>
      <stop offset="100%" stop-color="#7D8391"/>
    </linearGradient>

    <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5B6FE0"/>
      <stop offset="100%" stop-color="#3A4CBF"/>
    </linearGradient>

    <filter id="bulbGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#05061A" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Background -->
  <circle cx="100" cy="100" r="98" fill="url(#bgGrad)"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#4148A0" stroke-width="1.5" opacity="0.5"/>

  <!-- Halo glow behind bulb -->
  <circle cx="100" cy="80" r="38" fill="#FFD166" opacity="0.18" filter="url(#bulbGlow)"/>

  <!-- Sparkle rays -->
  <g filter="url(#bulbGlow)">
    <line x1="100" y1="24" x2="100" y2="12" stroke="#FFE9A8" stroke-width="3" stroke-linecap="round"/>
    <line x1="64" y1="38" x2="55" y2="30" stroke="#FFE9A8" stroke-width="3" stroke-linecap="round"/>
    <line x1="136" y1="38" x2="145" y2="30" stroke="#FFE9A8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="70" x2="38" y2="66" stroke="#FFE9A8" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="150" y1="70" x2="162" y2="66" stroke="#FFE9A8" stroke-width="2.5" stroke-linecap="round"/>
  </g>

  <!-- Sparkle stars -->
  <g fill="#FFE9A8" filter="url(#bulbGlow)">
    <path d="M 148 46 L 150 52 L 156 54 L 150 56 L 148 62 L 146 56 L 140 54 L 146 52 Z" opacity="0.9"/>
    <path d="M 46 100 L 47.5 104 L 51.5 105.5 L 47.5 107 L 46 111 L 44.5 107 L 40.5 105.5 L 44.5 104 Z" opacity="0.8"/>
  </g>

  <!-- Lightbulb -->
  <g filter="url(#softShadow)">
    <!-- Glass bulb -->
    <path d="M 100 42 
             C 118 42 130 54 130 72 
             C 130 86 122 92 116 100 
             C 113 104 112 108 112 112 
             L 88 112 
             C 88 108 87 104 84 100 
             C 78 92 70 86 70 72 
             C 70 54 82 42 100 42 Z" fill="url(#bulbGrad)"/>
    <!-- Glass shine -->
    <path d="M 84 58 Q 88 48 98 46" stroke="#FFFDF0" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.7"/>

    <!-- Filament -->
    <path d="M 92 68 L 96 82 L 100 70 L 104 82 L 108 68" stroke="#E8901F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.85"/>

    <!-- Screw base -->
    <rect x="88" y="112" width="24" height="6" fill="url(#baseGrad)"/>
    <rect x="88" y="120" width="24" height="6" fill="url(#baseGrad)"/>
    <rect x="90" y="128" width="20" height="8" rx="3" fill="#5F6470"/>
  </g>

  <!-- Speech bubble below -->
  <g filter="url(#softShadow)">
    <path d="M 58 150 
             Q 58 140 68 140 
             L 132 140 
             Q 142 140 142 150 
             L 142 166 
             Q 142 176 132 176 
             L 92 176 
             L 78 188 
             L 80 176 
             L 68 176 
             Q 58 176 58 166 Z" fill="url(#bubbleGrad)"/>

    <!-- Dots inside bubble -->
    <circle cx="84" cy="158" r="4" fill="#FFFFFF" opacity="0.9"/>
    <circle cx="100" cy="158" r="4" fill="#FFFFFF" opacity="0.9"/>
    <circle cx="116" cy="158" r="4" fill="#FFFFFF" opacity="0.9"/>
  </g>
</svg>"""

with open('unique_svgs_fixed.json') as f:
    svgs = json.load(f)

svgs[25] = svg_code

with open('unique_svgs_fixed.json', 'w') as f:
    json.dump(svgs, f, indent=2)

