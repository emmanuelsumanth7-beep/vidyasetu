import json
import re

svg_code = """<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EDE6FF"/>
      <stop offset="100%" stop-color="#DCCCFF"/>
    </linearGradient>

    <!-- Back avatar (teal blazer) -->
    <linearGradient id="skinBack" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F6C9A0"/>
      <stop offset="100%" stop-color="#EDB284"/>
    </linearGradient>
    <linearGradient id="blazerBack" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4FBFB0"/>
      <stop offset="100%" stop-color="#33A192"/>
    </linearGradient>

    <!-- Front-left avatar (violet blazer, teacher w/ book) -->
    <linearGradient id="skinLeft" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E8B48C"/>
      <stop offset="100%" stop-color="#D89A6C"/>
    </linearGradient>
    <linearGradient id="blazerLeft" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8B7CF6"/>
      <stop offset="100%" stop-color="#6C5CE0"/>
    </linearGradient>
    <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFC93C"/>
      <stop offset="100%" stop-color="#FF9F1C"/>
    </linearGradient>

    <!-- Front-right avatar (coral blazer, glasses) -->
    <linearGradient id="skinRight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFDCC2"/>
      <stop offset="100%" stop-color="#F5C29E"/>
    </linearGradient>
    <linearGradient id="blazerRight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF8C7A"/>
      <stop offset="100%" stop-color="#F26D5B"/>
    </linearGradient>
    <linearGradient id="hairRight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#5A4632"/>
      <stop offset="100%" stop-color="#3E301F"/>
    </linearGradient>

    <filter name="softShadow" id="softShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#3B2A6B" flood-opacity="0.22"/>
    </filter>
  </defs>

  <!-- Circular background -->
  <circle cx="200" cy="200" r="190" fill="url(#bgGrad)"/>

  <!-- Back avatar (centered, slightly higher, teal) -->
  <g filter="url(#softShadow)">
    <path d="M200 205 C165 205, 137 233, 137 268 L137 285 C137 291, 142 296, 148 296 L252 296 C258 296, 263 291, 263 285 L263 268 C263 233, 235 205, 200 205 Z" fill="url(#blazerBack)"/>
    <circle cx="200" cy="158" r="42" fill="url(#skinBack)"/>
    <path d="M160 148 C160 122, 178 106, 200 106 C222 106, 240 122, 240 148 C240 138, 230 130, 200 130 C170 130, 160 138, 160 148 Z" fill="#2E2A26"/>
  </g>

  <!-- Front-left avatar (violet blazer, holding book) -->
  <g filter="url(#softShadow)">
    <path d="M130 240 C100 240, 76 264, 76 295 L76 320 C76 326, 81 330, 87 330 L173 330 C179 330, 184 326, 184 320 L184 295 C184 264, 160 240, 130 240 Z" fill="url(#blazerLeft)"/>
    <circle cx="130" cy="200" r="36" fill="url(#skinLeft)"/>
    <path d="M98 194 C98 172, 112 158, 130 158 C148 158, 162 172, 162 194 C162 186, 152 178, 130 178 C108 178, 98 186, 98 194 Z" fill="#4A3626"/>

    <!-- Book -->
    <rect x="97" y="292" width="66" height="42" rx="5" fill="url(#bookGrad)" transform="rotate(-4 130 313)"/>
    <line x1="130" y1="292" x2="130" y2="334" stroke="#FFFFFF" stroke-width="3" opacity="0.6" transform="rotate(-4 130 313)"/>
  </g>

  <!-- Front-right avatar (coral blazer, glasses) -->
  <g filter="url(#softShadow)">
    <path d="M270 240 C300 240, 324 264, 324 295 L324 320 C324 326, 319 330, 313 330 L227 330 C221 330, 216 326, 216 320 L216 295 C216 264, 240 240, 270 240 Z" fill="url(#blazerRight)"/>
    <circle cx="270" cy="200" r="36" fill="url(#skinRight)"/>
    <path d="M234 192 C234 170, 250 154, 270 154 C290 154, 306 170, 306 192 C306 184, 296 172, 270 172 C244 172, 234 184, 234 192 Z" fill="url(#hairRight)"/>

    <!-- Glasses -->
    <circle cx="257" cy="202" r="11" fill="none" stroke="#3E301F" stroke-width="4"/>
    <circle cx="283" cy="202" r="11" fill="none" stroke="#3E301F" stroke-width="4"/>
    <line x1="268" y1="202" x2="272" y2="202" stroke="#3E301F" stroke-width="4"/>
  </g>
</svg>"""

with open('unique_svgs_fixed.json') as f:
    svgs = json.load(f)

svgs[12] = svg_code

with open('unique_svgs_fixed.json', 'w') as f:
    json.dump(svgs, f, indent=2)

