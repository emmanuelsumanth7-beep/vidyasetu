import React from 'react';
import { Calculator, FileText } from 'lucide-react';

export const FeePaymentIcon = () => (
<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
        
        <linearGradient id="iconBG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#95D9F1', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#65A6D1', stopOpacity: 1}} />
        </linearGradient>
    </defs>
    
    
    <circle cx="256" cy="256" r="256" fill="url(#iconBG)">
        <animate attributeName="r" from="0" to="256" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4, 0, 0.2, 1" />
        <animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze" />
    </circle>
    
    
    <g>
        <animateTransform attributeName="transform" type="translate" from="110, -300" to="110, 160" dur="0.8s" begin="0.4s" fill="freeze" calcMode="spline" keySplines="0.215, 0.61, 0.355, 1" />
        <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.4s" fill="freeze" />

        
        <g>
            <path d="M10,80 L200,80 A10,10 0 0 1 210,90 L210,210 A10,10 0 0 1 200,220 L10,220 A10,10 0 0 1 0,210 L0,90 A10,10 0 0 1 10,80 Z" fill="#2ECC71" transform="skewX(-15)"/>
            <path d="M10,60 L200,60 A10,10 0 0 1 210,70 L210,190 A10,10 0 0 1 200,200 L10,200 A10,10 0 0 1 0,190 L0,70 A10,10 0 0 1 10,60 Z" fill="#36E37D" transform="skewX(-10)"/>
            <path d="M10,40 L200,40 A10,10 0 0 1 210,50 L210,170 A10,10 0 0 1 200,180 L10,180 A10,10 0 0 1 0,170 L0,50 A10,10 0 0 1 10,40 Z" fill="#3DFF8C"/>
            <path d="M60,80 L160,80" stroke="#FFF" strokeWidth="6" strokeLinecap="round"/>
            <path d="M60,110 L160,110" stroke="#FFF" strokeWidth="6" strokeLinecap="round"/>
            <circle cx="110" cy="140" r="15" fill="#FFF"/>
        </g>
    </g>
    
    
    <g>
        <animateTransform attributeName="transform" type="translate" from="700, 100" to="300, 100" dur="0.8s" begin="0.6s" fill="freeze" calcMode="spline" keySplines="0.215, 0.61, 0.355, 1" />
        <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.6s" fill="freeze" />

        
        <g>
            <rect x="0" y="0" width="160" height="220" rx="10" fill="#FFFFFF"/>
            <line x1="30" y1="40" x2="130" y2="40" stroke="#DDE7EC" strokeWidth="8" strokeLinecap="round"/>
            <line x1="30" y1="70" x2="130" y2="70" stroke="#DDE7EC" strokeWidth="8" strokeLinecap="round"/>
            <line x1="30" y1="100" x2="130" y2="100" stroke="#DDE7EC" strokeWidth="8" strokeLinecap="round"/>
            <line x1="30" y1="140" x2="80" y2="140" stroke="#B0BEC5" strokeWidth="6" strokeLinecap="round"/>
            <line x1="30" y1="170" x2="100" y2="170" stroke="#B0BEC5" strokeWidth="6" strokeLinecap="round"/>
        </g>
    </g>

    
    <path d="M350,260 L370,280 L430,220" stroke="#FF5722" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="160" strokeDashoffset="160">
        <animate attributeName="strokeDashoffset" from="160" to="0" dur="0.6s" begin="1.4s" fill="freeze" calcMode="spline" keySplines="0.4, 0, 0.2, 1" />
        
        
        <animateTransform attributeName="transform" type="scale" from="1" to="1.05" dur="1s" begin="2s" repeatCount="indefinite" additive="sum" />
        <animateTransform attributeName="transform" type="scale" from="1.05" to="1" dur="1s" begin="3s" repeatCount="indefinite" additive="sum" />
    </path>
    
</svg>
);

export const ProfileIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#EAF6FF"/>
      <stop offset="100%" stopColor="#CDE9FF"/>
    </linearGradient>
    <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#57A2FF"/>
      <stop offset="100%" stopColor="#2E74E6"/>
    </linearGradient>
    <linearGradient id="headGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFB681"/>
      <stop offset="100%" stopColor="#FF8A42"/>
    </linearGradient>
    <clipPath id="circleClip">
      <circle cx="100" cy="100" r="100"/>
    </clipPath>
  </defs>

  
  <circle cx="100" cy="100" r="100" fill="url(#bgGrad)"/>

  
  <circle cx="100" cy="100" r="98" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2"/>

  <g clipPath="url(#circleClip)">
    
    <ellipse cx="100" cy="176" rx="62" ry="14" fill="#1E4FA8" opacity="0.10"/>

    
    <path d="M100,112
             C68,112 42,133 35,172
             C33,182 33,192 33,200
             L167,200
             C167,192 167,182 165,172
             C158,133 132,112 100,112 Z"
          fill="url(#shirtGrad)"/>

    
    <path d="M83,114 Q100,132 117,114 L117,124 Q100,140 83,124 Z"
          fill="#FFFFFF" opacity="0.18"/>

    
    <path d="M100,112 C132,112 158,133 165,172 C166,178 167,184 167,190
             L150,190 C148,158 128,128 100,120 Z"
          fill="#1E5FCC" opacity="0.25"/>
  </g>

  
  <circle cx="100" cy="80" r="38" fill="url(#headGrad)"/>

  
  <path d="M100,42 C120,42 136,58 138,78 C128,64 116,56 100,56 C90,56 81,60 74,66
           C81,50 90,42 100,42 Z" fill="#E8722A" opacity="0.20"/>

  
  <ellipse cx="86" cy="65" rx="11" ry="7" fill="#FFFFFF" opacity="0.30"/>
</svg>
);

export const RemarksIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#F7C600"/>
      <stop offset="100%" stopColor="#E6B400"/>
    </linearGradient>
    <linearGradient id="frontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFE066"/>
      <stop offset="100%" stopColor="#FFC300"/>
    </linearGradient>
    <linearGradient id="foldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#E6A800"/>
      <stop offset="100%" stopColor="#CC8F00"/>
    </linearGradient>
    <radialGradient id="pinGrad" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stopColor="#FF7A7A"/>
      <stop offset="55%" stopColor="#F13C4E"/>
      <stop offset="100%" stopColor="#D6202F"/>
    </radialGradient>
    <linearGradient id="pinNeedle" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#E8E8E8"/>
      <stop offset="100%" stopColor="#B0B0B0"/>
    </linearGradient>
  </defs>

  
  <ellipse cx="102" cy="178" rx="66" ry="9" fill="#000000" opacity="0.08"/>

  
  <g transform="rotate(-9 85 100)">
    <rect x="35" y="50" width="100" height="100" rx="12" fill="url(#backGrad)"/>
  </g>

  
  <g transform="rotate(7 115 115)">
    <rect x="65" y="65" width="100" height="100" rx="12" fill="url(#frontGrad)"/>
    
    <path d="M165,165 L165,141 L141,165 Z" fill="url(#foldGrad)"/>
    
    <rect x="67" y="67" width="96" height="20" rx="10" fill="#FFFFFF" opacity="0.16"/>
  </g>

  
  <path d="M101,88 L115,88 L108,100 Z" fill="url(#pinNeedle)"/>

  
  <ellipse cx="108" cy="90" rx="11" ry="4" fill="#000000" opacity="0.15"/>

  
  <circle cx="108" cy="76" r="17" fill="url(#pinGrad)"/>
  <ellipse cx="102" cy="70" rx="6" ry="4" fill="#FFFFFF" opacity="0.45"/>
</svg>
);

export const AbsentInfoIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#F3F5FA"/>
      <stop offset="100%" stopColor="#DEE4F0"/>
    </linearGradient>
    <linearGradient id="chairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#66AEDB"/>
      <stop offset="100%" stopColor="#2E7FB0"/>
    </linearGradient>
    <linearGradient id="chairLegGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#2A6D96"/>
      <stop offset="100%" stopColor="#1F5578"/>
    </linearGradient>
    <linearGradient id="deskTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#EDAD6E"/>
      <stop offset="100%" stopColor="#C9793A"/>
    </linearGradient>
    <linearGradient id="deskLegGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#B36A2E"/>
      <stop offset="100%" stopColor="#8F5322"/>
    </linearGradient>
    <linearGradient id="xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FF7A7A"/>
      <stop offset="100%" stopColor="#E0202F"/>
    </linearGradient>
  </defs>

  
  <circle cx="100" cy="100" r="100" fill="url(#bgGrad)"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2"/>

  
  <ellipse cx="106" cy="181" rx="66" ry="8" fill="#000000" opacity="0.07"/>

  
  <rect x="42" y="66" width="24" height="38" rx="6" fill="url(#chairGrad)"/>
  <rect x="38" y="102" width="34" height="10" rx="4" fill="url(#chairGrad)"/>
  <rect x="42" y="112" width="4" height="28" rx="2" fill="url(#chairLegGrad)"/>
  <rect x="68" y="112" width="4" height="28" rx="2" fill="url(#chairLegGrad)"/>

  
  <rect x="112" y="116" width="34" height="16" rx="3" fill="url(#deskLegGrad)"/>
  <rect x="124" y="122" width="10" height="3" rx="1.5" fill="#6B4321"/>
  <rect x="70" y="130" width="9" height="42" rx="3" fill="url(#deskLegGrad)"/>
  <rect x="147" y="130" width="9" height="42" rx="3" fill="url(#deskLegGrad)"/>
  <rect x="62" y="116" width="102" height="14" rx="5" fill="url(#deskTopGrad)"/>
  <rect x="62" y="116" width="102" height="4" rx="2" fill="#FFFFFF" opacity="0.28"/>

  
  <ellipse cx="118" cy="119" rx="17" ry="4" fill="#000000" opacity="0.14"/>

  
  <g>
    <rect x="96" y="52.5" width="44" height="11" rx="5.5" fill="url(#xGrad)" transform="rotate(45 118 58)"/>
    <rect x="96" y="52.5" width="44" height="11" rx="5.5" fill="url(#xGrad)" transform="rotate(-45 118 58)"/>
  </g>
</svg>
);

export const StudyMaterialIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="35%" cy="25%" r="85%">
      <stop offset="0%" stopColor="#8B5FE0"/>
      <stop offset="55%" stopColor="#5A31A6"/>
      <stop offset="100%" stopColor="#331A5C"/>
    </radialGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#5C9BFF"/>
      <stop offset="100%" stopColor="#2354C7"/>
    </linearGradient>
    <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFE066"/>
      <stop offset="100%" stopColor="#FFB700"/>
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FF7A7A"/>
      <stop offset="100%" stopColor="#E0202F"/>
    </linearGradient>
    <linearGradient id="pagesGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#FFFDF7"/>
      <stop offset="100%" stopColor="#EFE3C6"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFEDBB"/>
      <stop offset="100%" stopColor="#D4A94A"/>
    </linearGradient>
    <clipPath id="bgClip">
      <circle cx="100" cy="100" r="100"/>
    </clipPath>
    <clipPath id="book1Clip">
      <rect x="38" y="133" width="124" height="24" rx="6"/>
    </clipPath>
    <clipPath id="book2Clip">
      <rect x="48" y="111" width="104" height="22" rx="5"/>
    </clipPath>
    <clipPath id="book3Clip">
      <rect x="57" y="90" width="86" height="20" rx="5"/>
    </clipPath>
  </defs>

  
  <circle cx="100" cy="100" r="100" fill="url(#bgGrad)"/>
  <g clipPath="url(#bgClip)">
    <ellipse cx="65" cy="50" rx="75" ry="42" fill="#FFFFFF" opacity="0.09"/>
  </g>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="2"/>

  
  <ellipse cx="100" cy="163" rx="66" ry="9" fill="#000000" opacity="0.20"/>

  
  <g transform="rotate(-4 100 145)">
    <rect x="38" y="133" width="124" height="24" rx="6" fill="url(#blueGrad)"/>
    <g clipPath="url(#book1Clip)">
      <rect x="148" y="133" width="14" height="24" fill="url(#pagesGrad)"/>
    </g>
    <rect x="46" y="136" width="100" height="3" rx="1.5" fill="#FFFFFF" opacity="0.25"/>
  </g>

  
  <g transform="rotate(4 100 122)">
    <rect x="48" y="111" width="104" height="22" rx="5" fill="url(#yellowGrad)"/>
    <g clipPath="url(#book2Clip)">
      <rect x="48" y="111" width="14" height="22" fill="url(#pagesGrad)"/>
    </g>
    <rect x="58" y="114" width="78" height="3" rx="1.5" fill="#FFFFFF" opacity="0.28"/>
  </g>

  
  <g transform="rotate(-6 100 100)">
    <rect x="57" y="90" width="86" height="20" rx="5" fill="url(#redGrad)"/>
    <g clipPath="url(#book3Clip)">
      <rect x="129" y="90" width="14" height="20" fill="url(#pagesGrad)"/>
    </g>
    <rect x="65" y="93" width="62" height="3" rx="1.5" fill="#FFFFFF" opacity="0.28"/>
  </g>

  
  <ellipse cx="100" cy="93" rx="32" ry="4" fill="#000000" opacity="0.18"/>

  
  <line x1="60" y1="80" x2="44" y2="87" stroke="url(#goldGrad)" strokeWidth="3.5" strokeLinecap="round"/>
  <line x1="140" y1="80" x2="156" y2="87" stroke="url(#goldGrad)" strokeWidth="3.5" strokeLinecap="round"/>
  <path d="M95,83 Q100,78 105,83" fill="none" stroke="url(#goldGrad)" strokeWidth="3.5" strokeLinecap="round"/>
  <ellipse cx="78" cy="83" rx="19" ry="13.5" fill="#DCEFFF" opacity="0.45"/>
  <ellipse cx="78" cy="83" rx="19" ry="13.5" fill="none" stroke="url(#goldGrad)" strokeWidth="4"/>
  <ellipse cx="122" cy="83" rx="19" ry="13.5" fill="#DCEFFF" opacity="0.45"/>
  <ellipse cx="122" cy="83" rx="19" ry="13.5" fill="none" stroke="url(#goldGrad)" strokeWidth="4"/>
  <ellipse cx="71" cy="78" rx="6" ry="3.5" fill="#FFFFFF" opacity="0.55"/>
  <ellipse cx="115" cy="78" rx="6" ry="3.5" fill="#FFFFFF" opacity="0.55"/>
</svg>
);

export const LateComerIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#DFF8EE"/>
      <stop offset="100%" stopColor="#B9E9D6"/>
    </linearGradient>
    <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#2FBBA3"/>
      <stop offset="100%" stopColor="#1C8A7C"/>
    </linearGradient>
    <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#A7BCD0"/>
      <stop offset="100%" stopColor="#7C97B3"/>
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FF7A7A"/>
      <stop offset="100%" stopColor="#E0202F"/>
    </linearGradient>
    <clipPath id="cardClip">
      <rect x="55" y="45" width="90" height="120" rx="14"/>
    </clipPath>
  </defs>

  
  <circle cx="100" cy="100" r="100" fill="url(#bgGrad)"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2"/>

  
  <ellipse cx="100" cy="180" rx="58" ry="8" fill="#000000" opacity="0.07"/>

  
  <rect x="55" y="45" width="90" height="120" rx="14" fill="#FFFFFF"/>
  <g clipPath="url(#cardClip)">
    <rect x="55" y="45" width="90" height="36" fill="url(#bandGrad)"/>
    <circle cx="100" cy="55" r="5" fill="#FFFFFF" opacity="0.85"/>
  </g>
  <rect x="55" y="45" width="90" height="120" rx="14" fill="none" stroke="#E3E9EE" strokeWidth="1.5"/>

  
  <circle cx="100" cy="101" r="13" fill="url(#avatarGrad)"/>
  <path d="M100,113 C86,113 76,121 73,135 L127,135 C124,121 114,113 100,113 Z" fill="url(#avatarGrad)"/>

  
  <rect x="68" y="143" width="64" height="6" rx="3" fill="#C9D2DB"/>
  <rect x="75" y="153" width="50" height="5" rx="2.5" fill="#DDE4EA"/>

  
  <circle cx="142" cy="150" r="27" fill="url(#redGrad)"/>
  <circle cx="142" cy="150" r="21" fill="#FFFFFF"/>

  
  <rect x="140.5" y="130" width="3" height="6" rx="1.5" fill="#BFC6CC"/>
  <rect x="157" y="148.5" width="6" height="3" rx="1.5" fill="#BFC6CC"/>
  <rect x="140.5" y="164" width="3" height="6" rx="1.5" fill="#BFC6CC"/>
  <rect x="121" y="148.5" width="6" height="3" rx="1.5" fill="#BFC6CC"/>

  
  <line x1="142" y1="150" x2="130" y2="138" stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round"/>
  <line x1="142" y1="150" x2="160" y2="158" stroke="#E0202F" strokeWidth="3" strokeLinecap="round"/>
  <circle cx="142" cy="150" r="3" fill="#2A2A2A"/>
</svg>
);

export const NotificationIcon = () => (
<svg className="w-full h-full" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="phoneBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#2B2D6B"/>
      <stop offset="100%" stopColor="#1A1B3F"/>
    </linearGradient>
    <linearGradient id="screenBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#5B5FEF"/>
      <stop offset="100%" stopColor="#4145C7"/>
    </linearGradient>
    <linearGradient id="bellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFE066"/>
      <stop offset="100%" stopColor="#FFC107"/>
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FF6B6B"/>
      <stop offset="100%" stopColor="#EE3B3B"/>
    </linearGradient>
    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.18"/>
    </filter>
  </defs>

  
  <rect x="90" y="35" width="220" height="330" rx="36" fill="url(#phoneBody)" filter="url(#softShadow)"/>

  
  <rect x="175" y="58" width="50" height="6" rx="3" fill="#4B4E9E"/>

  
  <rect x="112" y="80" width="176" height="255" rx="18" fill="url(#screenBg)"/>

  
  <path d="M148 150 C130 165, 122 190, 128 215" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.55"/>
  <path d="M162 160 C150 172, 145 190, 149 208" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7"/>

  
  <path d="M252 150 C270 165, 278 190, 272 215" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.55"/>
  <path d="M238 160 C250 172, 255 190, 251 208" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7"/>

  
  <circle cx="200" cy="140" r="8" fill="url(#bellGrad)"/>

  
  <path d="M200 148
           C172 148, 158 168, 158 196
           L158 226
           C158 240, 150 250, 140 256
           L260 256
           C250 250, 242 240, 242 226
           L242 196
           C242 168, 228 148, 200 148 Z"
        fill="url(#bellGrad)"/>

  
  <rect x="150" y="256" width="100" height="12" rx="6" fill="#F5A623"/>

  
  <path d="M186 274 C186 286, 192 296, 200 296 C208 296, 214 286, 214 274 Z" fill="#F5A623"/>

  
  <circle cx="288" cy="70" r="26" fill="url(#badgeGrad)" stroke="#1A1B3F" strokeWidth="5"/>
  <text x="288" y="79" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="700" fill="#FFFFFF" textAnchor="middle">!</text>
</svg>
);

export const CalendarIcon = () => (
<svg className="w-full h-full" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FF6B5E"/>
      <stop offset="100%" stopColor="#E8362A"/>
    </linearGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF"/>
      <stop offset="100%" stopColor="#F4F5F9"/>
    </linearGradient>
    <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FF6B5E"/>
      <stop offset="100%" stopColor="#D8281D"/>
    </linearGradient>
    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.16"/>
    </filter>
  </defs>

  
  <rect x="70" y="90" width="260" height="240" rx="22" fill="url(#bodyGrad)" filter="url(#softShadow)"/>

  
  <path d="M70 112 C70 99.7, 79.7 90, 92 90 L308 90 C320.3 90, 330 99.7, 330 112 L330 150 L70 150 Z" fill="url(#headerGrad)"/>

  
  <rect x="118" y="62" width="18" height="56" rx="9" fill="#B4372B"/>
  <rect x="264" y="62" width="18" height="56" rx="9" fill="#B4372B"/>
  <rect x="118" y="62" width="18" height="30" rx="9" fill="#D8483A"/>
  <rect x="264" y="62" width="18" height="30" rx="9" fill="#D8483A"/>

  
  <line x1="130" y1="150" x2="130" y2="330" stroke="#E3E5EE" strokeWidth="4"/>
  <line x1="200" y1="150" x2="200" y2="330" stroke="#E3E5EE" strokeWidth="4"/>
  <line x1="270" y1="150" x2="270" y2="330" stroke="#E3E5EE" strokeWidth="4"/>

  
  <line x1="70" y1="196" x2="330" y2="196" stroke="#E3E5EE" strokeWidth="4"/>
  <line x1="70" y1="242" x2="330" y2="242" stroke="#E3E5EE" strokeWidth="4"/>
  <line x1="70" y1="288" x2="330" y2="288" stroke="#E3E5EE" strokeWidth="4"/>

  
  <circle cx="100" cy="173" r="5" fill="#D6D9E4"/>
  <circle cx="165" cy="173" r="5" fill="#D6D9E4"/>
  <circle cx="235" cy="173" r="5" fill="#D6D9E4"/>
  <circle cx="300" cy="173" r="5" fill="#D6D9E4"/>

  <circle cx="100" cy="219" r="5" fill="#D6D9E4"/>
  <circle cx="165" cy="219" r="5" fill="#D6D9E4"/>
  <circle cx="300" cy="219" r="5" fill="#D6D9E4"/>

  <circle cx="100" cy="265" r="5" fill="#D6D9E4"/>
  <circle cx="165" cy="265" r="5" fill="#D6D9E4"/>
  <circle cx="300" cy="265" r="5" fill="#D6D9E4"/>

  <circle cx="100" cy="309" r="5" fill="#D6D9E4"/>
  <circle cx="300" cy="309" r="5" fill="#D6D9E4"/>

  
  <rect x="207" y="205" width="56" height="46" rx="10" fill="#FFECEA"/>

  
  <path d="M221 228 L233 240 L251 216" stroke="url(#checkGrad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
</svg>
);

export const CetRegistrationIcon = () => (
<svg className="w-full h-full" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#E7F3FF"/>
      <stop offset="100%" stopColor="#D2E8FF"/>
    </linearGradient>
    <linearGradient id="docGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF"/>
      <stop offset="100%" stopColor="#F3F6FB"/>
    </linearGradient>
    <linearGradient id="billBack" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#38B27A"/>
      <stop offset="100%" stopColor="#2A9D63"/>
    </linearGradient>
    <linearGradient id="billMid" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#43C989"/>
      <stop offset="100%" stopColor="#31B071"/>
    </linearGradient>
    <linearGradient id="billFront" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#5EE0A0"/>
      <stop offset="100%" stopColor="#3ECB86"/>
    </linearGradient>
    <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#5EE0A0"/>
      <stop offset="100%" stopColor="#2A9D63"/>
    </linearGradient>
    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1A3A5C" floodOpacity="0.18"/>
    </filter>
  </defs>

  
  <circle cx="200" cy="200" r="190" fill="url(#bgGrad)"/>

  
  <g filter="url(#softShadow)">
    <rect x="150" y="70" width="150" height="200" rx="14" fill="url(#docGrad)"/>
    
    <path d="M262 70 L300 108 L272 108 C265.4 108, 262 104.6, 262 98 Z" fill="#DCE4EF"/>
  </g>

  
  <rect x="172" y="118" width="88" height="8" rx="4" fill="#B8C4D6"/>
  <rect x="172" y="140" width="66" height="8" rx="4" fill="#B8C4D6"/>
  <rect x="172" y="162" width="88" height="8" rx="4" fill="#B8C4D6"/>
  <rect x="172" y="184" width="50" height="8" rx="4" fill="#B8C4D6"/>

  
  <circle cx="238" cy="232" r="26" fill="url(#checkGrad)"/>
  <path d="M226 232 L235 241 L251 221" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

  
  <g>
    <rect x="98" y="252" width="140" height="60" rx="10" fill="url(#billBack)"/>
    <rect x="92" y="238" width="140" height="60" rx="10" fill="url(#billMid)"/>
    <rect x="86" y="224" width="140" height="60" rx="10" fill="url(#billFront)"/>

    
    <circle cx="156" cy="254" r="18" fill="#FFFFFF" opacity="0.35"/>
    <text x="156" y="261" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700" fill="#1E7A50" textAnchor="middle">$</text>
    <line x1="188" y1="238" x2="216" y2="238" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
    <line x1="188" y1="250" x2="210" y2="250" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
  </g>
</svg>
);

export const UpcomingEventsIcon = () => (
<svg className="w-full h-full" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#7C7FF2"/>
      <stop offset="100%" stopColor="#5A5DE0"/>
    </linearGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF"/>
      <stop offset="100%" stopColor="#F4F5FB"/>
    </linearGradient>
    <linearGradient id="clockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFC93C"/>
      <stop offset="100%" stopColor="#FF9F1C"/>
    </linearGradient>
    <linearGradient id="clockFace" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF"/>
      <stop offset="100%" stopColor="#FFF6E5"/>
    </linearGradient>
    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="7" stdDeviation="9" floodColor="#000000" floodOpacity="0.16"/>
    </filter>
    <filter id="clockShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#B45F00" floodOpacity="0.35"/>
    </filter>
  </defs>

  
  <g filter="url(#softShadow)">
    <rect x="55" y="90" width="230" height="215" rx="20" fill="url(#bodyGrad)"/>
    <path d="M55 112 C55 99.85, 64.85 90, 77 90 L263 90 C275.15 90, 285 99.85, 285 112 L285 148 L55 148 Z" fill="url(#headerGrad)"/>
  </g>

  
  <rect x="100" y="64" width="16" height="52" rx="8" fill="#43459E"/>
  <rect x="224" y="64" width="16" height="52" rx="8" fill="#43459E"/>
  <rect x="100" y="64" width="16" height="26" rx="8" fill="#5A5DE0"/>
  <rect x="224" y="64" width="16" height="26" rx="8" fill="#5A5DE0"/>

  
  <line x1="55" y1="192" x2="285" y2="192" stroke="#E7E9F3" strokeWidth="4"/>
  <line x1="55" y1="234" x2="285" y2="234" stroke="#E7E9F3" strokeWidth="4"/>
  <line x1="55" y1="276" x2="285" y2="276" stroke="#E7E9F3" strokeWidth="4"/>
  <line x1="120" y1="148" x2="120" y2="305" stroke="#E7E9F3" strokeWidth="4"/>
  <line x1="185" y1="148" x2="185" y2="305" stroke="#E7E9F3" strokeWidth="4"/>

  
  <circle cx="85" cy="170" r="5" fill="#D6D9EC"/>
  <circle cx="150" cy="170" r="5" fill="#D6D9EC"/>
  <circle cx="85" cy="213" r="5" fill="#D6D9EC"/>
  <circle cx="150" cy="213" r="5" fill="#D6D9EC"/>
  <circle cx="85" cy="255" r="5" fill="#D6D9EC"/>
  <circle cx="150" cy="255" r="5" fill="#D6D9EC"/>
  <circle cx="85" cy="291" r="5" fill="#D6D9EC"/>
  <circle cx="150" cy="291" r="5" fill="#D6D9EC"/>

  
  <g filter="url(#clockShadow)">
    <circle cx="270" cy="270" r="82" fill="url(#clockGrad)"/>
    <circle cx="270" cy="270" r="62" fill="url(#clockFace)"/>
  </g>

  
  <line x1="270" y1="218" x2="270" y2="228" stroke="#FF9F1C" strokeWidth="5" strokeLinecap="round"/>
  <line x1="270" y1="312" x2="270" y2="322" stroke="#FF9F1C" strokeWidth="5" strokeLinecap="round"/>
  <line x1="218" y1="270" x2="228" y2="270" stroke="#FF9F1C" strokeWidth="5" strokeLinecap="round"/>
  <line x1="312" y1="270" x2="322" y2="270" stroke="#FF9F1C" strokeWidth="5" strokeLinecap="round"/>

  
  <line x1="270" y1="270" x2="270" y2="234" stroke="#3A3D7A" strokeWidth="8" strokeLinecap="round"/>
  <line x1="270" y1="270" x2="298" y2="284" stroke="#3A3D7A" strokeWidth="8" strokeLinecap="round"/>
  <circle cx="270" cy="270" r="8" fill="#FF9F1C"/>
</svg>
);

export const BiometricsIcon = () => (
<svg className="w-full h-full" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#E4F1FF"/>
      <stop offset="100%" stopColor="#CDE6FF"/>
    </linearGradient>

    <linearGradient id="panelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#3D63E8"/>
      <stop offset="100%" stopColor="#2544B8"/>
    </linearGradient>

    <linearGradient id="scanScreen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#123B8F"/>
      <stop offset="100%" stopColor="#0B285F"/>
    </linearGradient>

    <linearGradient id="printGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#8FCBFF"/>
      <stop offset="100%" stopColor="#4FA3FF"/>
    </linearGradient>

    <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#5EE0A0" stopOpacity="0"/>
      <stop offset="50%" stopColor="#5EE0A0" stopOpacity="0.95"/>
      <stop offset="100%" stopColor="#5EE0A0" stopOpacity="0"/>
    </linearGradient>

    <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#5EE0A0"/>
      <stop offset="100%" stopColor="#2A9D63"/>
    </linearGradient>

    <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="softShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#0B2A5C" floodOpacity="0.25"/>
    </filter>
  </defs>

  
  <circle cx="200" cy="200" r="190" fill="url(#bgGrad)"/>

  
  <g filter="url(#softShadow)">
    <rect x="100" y="88" width="200" height="224" rx="28" fill="url(#panelGrad)"/>
    <rect x="122" y="112" width="156" height="176" rx="16" fill="url(#scanScreen)"/>
  </g>

  
  <path d="M132 122 L132 112 L142 112" stroke="#8FCBFF" strokeWidth="5" strokeLinecap="round" fill="none"/>
  <path d="M268 122 L268 112 L258 112" stroke="#8FCBFF" strokeWidth="5" strokeLinecap="round" fill="none"/>
  <path d="M132 278 L132 288 L142 288" stroke="#8FCBFF" strokeWidth="5" strokeLinecap="round" fill="none"/>
  <path d="M268 278 L268 288 L258 288" stroke="#8FCBFF" strokeWidth="5" strokeLinecap="round" fill="none"/>

  
  <g fill="none" stroke="url(#printGrad)" strokeWidth="6" strokeLinecap="round" filter="url(#glow)">
    <path d="M200 150 C170 150, 152 172, 152 200 C152 226, 168 246, 190 252"/>
    <path d="M200 162 C178 162, 165 178, 165 200 C165 220, 178 236, 197 240"/>
    <path d="M200 174 C186 174, 177 184, 177 200 C177 214, 187 226, 202 229"/>
    <path d="M200 138 C154 138, 128 168, 128 200 C128 228, 143 252, 168 264"/>
    <path d="M215 150 C238 158, 252 178, 250 202 C248 224, 233 240, 213 245"/>
    <path d="M222 138 C255 148, 274 176, 271 208 C268 236, 248 258, 220 264"/>
  </g>

  
  <rect x="122" y="196" width="156" height="8" fill="url(#laserGrad)" filter="url(#glow)"/>

  
  <g filter="url(#softShadow)">
    <circle cx="278" cy="278" r="38" fill="url(#checkGrad)" stroke="#EAF3FF" strokeWidth="7"/>
  </g>
  <path d="M262 278 L273 289 L296 264" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
</svg>
);

export const GradesIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  
  <circle cx="100" cy="100" r="98" fill="#FDF6E3"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#F0DFAE" strokeWidth="2"/>

  
  <g>
    
    <rect x="62" y="70" width="76" height="60" rx="4" fill="#FFFDF5"/>
    <rect x="62" y="70" width="76" height="60" rx="4" fill="none" stroke="#E8DCC0" strokeWidth="1.5"/>

    
    <ellipse cx="62" cy="100" rx="10" ry="32" fill="#F5EFDD"/>
    <ellipse cx="62" cy="100" rx="10" ry="32" fill="none" stroke="#D8C89A" strokeWidth="1.5"/>
    <path d="M 55 82 Q 62 100 55 118" stroke="#D8C89A" strokeWidth="1.2" fill="none"/>

    
    <ellipse cx="138" cy="100" rx="10" ry="32" fill="#F5EFDD"/>
    <ellipse cx="138" cy="100" rx="10" ry="32" fill="none" stroke="#D8C89A" strokeWidth="1.5"/>
    <path d="M 145 82 Q 138 100 145 118" stroke="#D8C89A" strokeWidth="1.2" fill="none"/>

    
    <rect x="76" y="84" width="48" height="3" rx="1.5" fill="#C9A63C" opacity="0.6"/>
    <rect x="80" y="93" width="40" height="2.5" rx="1.25" fill="#D8C89A"/>
    <rect x="80" y="101" width="40" height="2.5" rx="1.25" fill="#D8C89A"/>
    <rect x="80" y="109" width="30" height="2.5" rx="1.25" fill="#D8C89A"/>
  </g>

  
  <g>
    <path d="M 88 118 L 88 156 L 100 147 L 112 156 L 112 118 Z" fill="#D7263D"/>
    <path d="M 88 118 L 88 156 L 100 147 L 100 118 Z" fill="#C21A30"/>
    <rect x="86" y="112" width="28" height="10" rx="3" fill="#E63946"/>
  </g>

  
  <g>
    <circle cx="100" cy="122" r="17" fill="#F2C14E"/>
    <circle cx="100" cy="122" r="17" fill="none" stroke="#D9A62B" strokeWidth="2"/>
    <circle cx="100" cy="122" r="12" fill="none" stroke="#FFE9A8" strokeWidth="1.5" strokeDasharray="2 2"/>
    
    <path d="M 100 114 L 102.2 119.8 L 108.5 119.9 L 103.4 123.6 L 105.3 129.6 L 100 126 L 94.7 129.6 L 96.6 123.6 L 91.5 119.9 L 97.8 119.8 Z" fill="#FFF6DA"/>
  </g>

  
  <circle cx="145" cy="65" r="3" fill="#F2C14E" opacity="0.8"/>
  <circle cx="55" cy="60" r="2" fill="#D7263D" opacity="0.7"/>
  <circle cx="150" cy="135" r="2.5" fill="#C9A63C" opacity="0.6"/>
</svg>
);

export const TransportIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  
  <circle cx="100" cy="100" r="98" fill="#E0F5F3"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#BFE8E3" strokeWidth="2"/>

  
  <circle cx="150" cy="55" r="10" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="162" cy="60" r="7" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="141" cy="62" r="6" fill="#FFFFFF" opacity="0.6"/>

  
  <rect x="0" y="140" width="200" height="40" fill="#3D4B56"/>
  <rect x="0" y="140" width="200" height="6" fill="#2E3940"/>
  
  <rect x="10" y="158" width="18" height="5" rx="2" fill="#F2C14E"/>
  <rect x="46" y="158" width="18" height="5" rx="2" fill="#F2C14E"/>
  <rect x="82" y="158" width="18" height="5" rx="2" fill="#F2C14E"/>
  <rect x="118" y="158" width="18" height="5" rx="2" fill="#F2C14E"/>
  <rect x="154" y="158" width="18" height="5" rx="2" fill="#F2C14E"/>
  <rect x="190" y="158" width="14" height="5" rx="2" fill="#F2C14E"/>

  
  <rect x="18" y="98" width="20" height="4" rx="2" fill="#8FD3CB"/>
  <rect x="12" y="112" width="14" height="4" rx="2" fill="#8FD3CB"/>

  
  <g>
    
    <path d="M 48 92 
             L 158 92 
             Q 168 92 168 102 
             L 168 132 
             Q 168 138 162 138 
             L 44 138 
             Q 38 138 38 132 
             L 38 102 
             Q 38 92 48 92 Z" fill="#FFC93C"/>
    <path d="M 48 92 
             L 158 92 
             Q 168 92 168 102 
             L 168 132 
             Q 168 138 162 138 
             L 44 138 
             Q 38 138 38 132 
             L 38 102 
             Q 38 92 48 92 Z" fill="none" stroke="#E0A825" strokeWidth="1.5"/>

    
    <rect x="42" y="92" width="122" height="8" fill="#FFD65C"/>

    
    <path d="M 158 96 Q 168 96 168 106 L 168 132 Q 168 138 162 138 L 158 138 Z" fill="#F5B82E"/>

    
    <rect x="38" y="130" width="130" height="8" fill="#2E3940"/>

    
    <rect x="48" y="100" width="20" height="18" rx="3" fill="#BEE9F0"/>
    <rect x="72" y="100" width="20" height="18" rx="3" fill="#BEE9F0"/>
    <rect x="96" y="100" width="20" height="18" rx="3" fill="#BEE9F0"/>
    <rect x="120" y="100" width="20" height="18" rx="3" fill="#BEE9F0"/>
    
    <rect x="146" y="100" width="16" height="18" rx="3" fill="#DFF3F7"/>

    
    <rect x="150" y="120" width="12" height="16" rx="2" fill="#E0A825"/>
    <line x1="156" y1="120" x2="156" y2="136" stroke="#B9861B" strokeWidth="1"/>

    
    <circle cx="165" cy="126" r="4" fill="#FFF6DA"/>
    <circle cx="165" cy="126" r="4" fill="none" stroke="#E0A825" strokeWidth="1"/>

    
    <circle cx="55" cy="108" r="0" fill="none"/>
    <rect x="40" y="108" width="6" height="6" fill="#D7263D" opacity="0.9"/>
  </g>

  
  <g>
    <circle cx="62" cy="142" r="14" fill="#2E3940"/>
    <circle cx="62" cy="142" r="6" fill="#8A99A3"/>
    <circle cx="148" cy="142" r="14" fill="#2E3940"/>
    <circle cx="148" cy="142" r="6" fill="#8A99A3"/>
  </g>
</svg>
);

export const DiaryIcon = () => (
<svg className="w-full h-full" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#1FAE72"/>
      <stop offset="100%" stopColor="#0D7D50"/>
    </linearGradient>

    <linearGradient id="ledgerLeft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#F4F7FB"/>
      <stop offset="100%" stopColor="#E3E9F2"/>
    </linearGradient>
    <linearGradient id="ledgerRight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#FFFFFF"/>
      <stop offset="100%" stopColor="#F1F4FA"/>
    </linearGradient>
    <linearGradient id="ledgerSpine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#2E2FB8"/>
      <stop offset="100%" stopColor="#1D1E7E"/>
    </linearGradient>

    <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#5EE0A0"/>
      <stop offset="100%" stopColor="#2A9D63"/>
    </linearGradient>

    <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#B7F5D8"/>
      <stop offset="100%" stopColor="#FFFFFF"/>
    </linearGradient>

    <filter id="softShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="7" stdDeviation="8" floodColor="#00301C" floodOpacity="0.3"/>
    </filter>
  </defs>

  
  <circle cx="200" cy="200" r="190" fill="url(#bgGrad)"/>

  
  <g filter="url(#softShadow)">
    <path d="M200 150 L96 168 C90 169, 86 174, 86 180 L86 296 C86 303, 92 308, 99 307 L200 288 Z" fill="url(#ledgerLeft)"/>
    <path d="M200 150 L304 168 C310 169, 314 174, 314 180 L314 296 C314 303, 308 308, 301 307 L200 288 Z" fill="url(#ledgerRight)"/>
    <rect x="196" y="148" width="8" height="142" fill="url(#ledgerSpine)"/>
  </g>

  
  <line x1="104" y1="196" x2="176" y2="188" stroke="#C7D1E0" strokeWidth="4" strokeLinecap="round"/>
  <line x1="104" y1="220" x2="176" y2="213" stroke="#C7D1E0" strokeWidth="4" strokeLinecap="round"/>
  <line x1="104" y1="244" x2="176" y2="238" stroke="#C7D1E0" strokeWidth="4" strokeLinecap="round"/>
  <line x1="104" y1="268" x2="176" y2="263" stroke="#C7D1E0" strokeWidth="4" strokeLinecap="round"/>

  
  <line x1="224" y1="188" x2="296" y2="196" stroke="#C7D1E0" strokeWidth="4" strokeLinecap="round"/>
  <line x1="224" y1="213" x2="296" y2="220" stroke="#C7D1E0" strokeWidth="4" strokeLinecap="round"/>

  
  <rect x="228" y="248" width="14" height="20" rx="2" fill="url(#barGrad)"/>
  <rect x="248" y="238" width="14" height="30" rx="2" fill="url(#barGrad)"/>
  <rect x="268" y="226" width="14" height="42" rx="2" fill="url(#barGrad)"/>

  
  <g filter="url(#softShadow)">
    <path d="M130 200 L170 160 L205 188 L260 118"
          fill="none" stroke="url(#arrowGrad)" strokeWidth="12"
          strokeLinecap="round" strokeLinejoin="round"/>
    
    <path d="M232 118 L262 112 L268 142 Z" fill="url(#arrowGrad)"/>
  </g>

  
  <circle cx="130" cy="200" r="8" fill="#FFFFFF"/>
  <circle cx="170" cy="160" r="8" fill="#FFFFFF"/>
  <circle cx="205" cy="188" r="8" fill="#FFFFFF"/>
</svg>
);

export const AnalyticsIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    
    <radialGradient id="bgGrad" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stopColor="#FF6FB5"/>
      <stop offset="100%" stopColor="#E8399A"/>
    </radialGradient>

    
    <linearGradient id="pieSide" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#B02E7A"/>
      <stop offset="100%" stopColor="#8A2261"/>
    </linearGradient>

    
    <linearGradient id="barGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFD166"/>
      <stop offset="100%" stopColor="#F2A93C"/>
    </linearGradient>
    <linearGradient id="barGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#4ADE80"/>
      <stop offset="100%" stopColor="#22B573"/>
    </linearGradient>
    <linearGradient id="barGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#5EC8F2"/>
      <stop offset="100%" stopColor="#2E9FD6"/>
    </linearGradient>

    <filter name="softShadow" id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#6E1A4C" floodOpacity="0.35"/>
    </filter>

    <filter id="glassShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#4A0F33" floodOpacity="0.4"/>
    </filter>
  </defs>

  
  <circle cx="100" cy="100" r="98" fill="url(#bgGrad)"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#FF9FCC" strokeWidth="1.5" opacity="0.6"/>

  
  <circle cx="42" cy="42" r="2.2" fill="#FFE9F5" opacity="0.85"/>
  <circle cx="160" cy="150" r="1.6" fill="#FFE9F5" opacity="0.7"/>

  
  <g filter="url(#softShadow)">
    
    <rect x="44" y="138" width="66" height="5" rx="2" fill="#8A2261"/>

    
    <rect x="48" y="112" width="14" height="26" rx="2.5" fill="url(#barGrad1)"/>
    <rect x="66" y="98" width="14" height="40" rx="2.5" fill="url(#barGrad2)"/>
    <rect x="84" y="86" width="14" height="52" rx="2.5" fill="url(#barGrad3)"/>
  </g>

  
  <g filter="url(#softShadow)">
    
    <path d="M 118 128
             A 30 30 0 0 0 152 116
             L 152 124
             A 30 30 0 0 1 118 136
             Z" fill="url(#pieSide)"/>
    <path d="M 152 116
             A 30 30 0 0 0 140 92
             L 140 100
             A 30 30 0 0 1 152 124
             Z" fill="#7A1D57"/>

    
    <g transform="translate(0,-8)">
      <path d="M 135 106 L 135 76 A 30 30 0 0 1 158.97 89.5 Z" fill="#FFD166"/>
      <path d="M 135 106 L 158.97 89.5 A 30 30 0 0 1 162 106 Z" fill="#4ADE80"/>
      <path d="M 135 106 L 162 106 A 30 30 0 0 1 149 130.5 Z" fill="#5EC8F2"/>
      <path d="M 135 106 L 149 130.5 A 30 30 0 0 1 105 106 Z" fill="#FF9FCC"/>
      <path d="M 135 106 L 105 106 A 30 30 0 0 1 135 76 Z" fill="#F2A93C"/>
    </g>
  </g>

  
  <g filter="url(#glassShadow)">
    <circle cx="122" cy="66" r="20" fill="#DFF3F7" opacity="0.35"/>
    <circle cx="122" cy="66" r="20" fill="none" stroke="#FFFFFF" strokeWidth="5"/>
    <circle cx="122" cy="66" r="20" fill="none" stroke="#8A2261" strokeWidth="1.5" opacity="0.4"/>
    <line x1="136" y1="80" x2="152" y2="96" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round"/>
    <line x1="136" y1="80" x2="152" y2="96" stroke="#8A2261" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
    
    <path d="M 112 58 A 14 14 0 0 1 124 50" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8"/>
  </g>
</svg>
);

export const SettingsIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    
    <radialGradient id="bgGrad2" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stopColor="#484D57"/>
      <stop offset="100%" stopColor="#24272D"/>
    </radialGradient>

    
    <linearGradient id="gearPurple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#B79CF0"/>
      <stop offset="45%" stopColor="#7C5CC4"/>
      <stop offset="100%" stopColor="#4E3888"/>
    </linearGradient>

    <linearGradient id="gearSilver2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#EDEFF2"/>
      <stop offset="45%" stopColor="#B4BBC3"/>
      <stop offset="100%" stopColor="#7E8891"/>
    </linearGradient>

    <linearGradient id="gearAmber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFCF7A"/>
      <stop offset="45%" stopColor="#F0A93E"/>
      <stop offset="100%" stopColor="#B87418"/>
    </linearGradient>

    <filter id="softShadow2" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.5"/>
    </filter>

    <filter id="glow2" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  
  <circle cx="100" cy="100" r="98" fill="url(#bgGrad2)"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#54585F" strokeWidth="1.5" opacity="0.6"/>

  
  <g filter="url(#softShadow2)" transform="translate(62,58)">
    <path d="M 0,-20 L 3.5,-20 L 5,-14.5 L 11,-12.2 L 15.5,-16 L 18.2,-13.2 L 14.5,-8.7 L 16.8,-2.7 L 22.5,-1.2 L 22.5,2.2 L 16.8,3.7 L 14.5,9.7 L 18.2,14.2 L 15.5,17 L 11,13.2 L 5,15.5 L 3.5,21 L 0,21 L -1.5,15.5 L -7.5,13.2 L -12,17 L -14.7,14.2 L -11,9.7 L -13.3,3.7 L -19,2.2 L -19,-1.2 L -13.3,-2.7 L -11,-8.7 L -14.7,-13.2 L -12,-16 L -7.5,-12.2 L -1.5,-14.5 Z" fill="url(#gearAmber)"/>
    <circle cx="0" cy="0" r="9" fill="#B87418"/>
    <circle cx="0" cy="0" r="6.2" fill="#24272D"/>
  </g>

  
  <g filter="url(#softShadow2)" transform="translate(138,132)">
    <path d="M 0,-27 L 4.5,-27 L 6.3,-20.2 L 14.4,-17 L 20.7,-22 L 24.3,-18.4 L 19.3,-12.1 L 22.5,-4 L 30.2,-2.2 L 30.2,3.2 L 22.5,5 L 19.3,13.1 L 24.3,19.4 L 20.7,23 L 14.4,18 L 6.3,21.2 L 4.5,28 L 0,28 L -1.8,21.2 L -9.9,18 L -16.2,23 L -19.8,19.4 L -14.8,13.1 L -18,5 L -25.7,3.2 L -25.7,-2.2 L -18,-4 L -14.8,-12.1 L -19.8,-18.4 L -16.2,-22 L -9.9,-17 L -1.8,-20.2 Z" fill="url(#gearSilver2)"/>
    <circle cx="0" cy="0" r="12.2" fill="#7E8891"/>
    <circle cx="0" cy="0" r="8.5" fill="#24272D"/>
  </g>

  
  <g filter="url(#softShadow2)" transform="translate(98,98)">
    <path d="M 0,-38 L 6,-38 L 8.5,-28.5 L 20,-24 L 29,-31 L 34,-26 L 27,-17 L 31.5,-5.5 L 42,-3 L 42,4.5 L 31.5,7 L 27,18.5 L 34,27.5 L 29,32.5 L 20,25.5 L 8.5,30 L 6,39.5 L 0,39.5 L -2.5,30 L -14,25.5 L -23,32.5 L -28,27.5 L -21,18.5 L -25.5,7 L -36,4.5 L -36,-3 L -25.5,-5.5 L -21,-17 L -28,-26 L -23,-31 L -14,-24 L -2.5,-28.5 Z" fill="url(#gearPurple)"/>
    <circle cx="0" cy="0" r="17" fill="#4E3888"/>
    <circle cx="0" cy="0" r="12" fill="#24272D"/>
  </g>

  
  <g filter="url(#glow2)">
    <circle cx="62" cy="38" r="2.2" fill="#FFD98F" opacity="0.9"/>
    <circle cx="164" cy="112" r="2" fill="#E4E8EC" opacity="0.85"/>
    <circle cx="98" cy="60" r="2.4" fill="#C4ACF5" opacity="0.9"/>
  </g>

  
  <path d="M 36 44 A 90 90 0 0 1 128 26" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.12"/>
</svg>
);

export const LogoutIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    
    <radialGradient id="bgGrad" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stopColor="#FBE4E2"/>
      <stop offset="55%" stopColor="#F5C9C6"/>
      <stop offset="100%" stopColor="#E8A9A5"/>
    </radialGradient>

    
    <linearGradient id="frameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#5C4A42"/>
      <stop offset="100%" stopColor="#3E312B"/>
    </linearGradient>

    
    <linearGradient id="doorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#8A6A56"/>
      <stop offset="100%" stopColor="#6B4F3F"/>
    </linearGradient>

    
    <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#FF6A4D"/>
      <stop offset="100%" stopColor="#E8351E"/>
    </linearGradient>

    <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#5C231C" floodOpacity="0.3"/>
    </filter>

    <filter id="arrowGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  
  <circle cx="100" cy="100" r="98" fill="url(#bgGrad)"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#E8A9A5" strokeWidth="1.5" opacity="0.6"/>

  
  <g filter="url(#softShadow)">
    <rect x="54" y="46" width="14" height="108" rx="2" fill="url(#frameGrad)"/>
  </g>

  
  <g filter="url(#softShadow)">
    <path d="M 68 48 L 104 58 L 104 144 L 68 152 Z" fill="url(#doorGrad)"/>
    <path d="M 68 48 L 104 58 L 104 66 L 68 58 Z" fill="#9B7A64" opacity="0.5"/>
    
    <circle cx="96" cy="102" r="4" fill="#FFD166"/>
    <circle cx="96" cy="102" r="4" fill="none" stroke="#B8862E" strokeWidth="1"/>
  </g>

  
  <path d="M 68 48 L 68 152 L 60 150 L 60 50 Z" fill="#2A1F1A" opacity="0.5"/>

  
  <g filter="url(#arrowGlow)">
    <line x1="86" y1="100" x2="146" y2="100" stroke="url(#arrowGrad)" strokeWidth="9" strokeLinecap="round"/>
    <path d="M 130 82 L 152 100 L 130 118" fill="none" stroke="url(#arrowGrad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
  </g>

  
  <circle cx="150" cy="56" r="2.2" fill="#FF6A4D" opacity="0.6"/>
  <circle cx="46" cy="150" r="1.8" fill="#E8A9A5" opacity="0.7"/>
</svg>
);

export const AttendanceIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stopColor="#FFDCB0"/>
      <stop offset="55%" stopColor="#FFB870"/>
      <stop offset="100%" stopColor="#F29940"/>
    </radialGradient>

    <linearGradient id="boardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#B5824F"/>
      <stop offset="100%" stopColor="#8F6236"/>
    </linearGradient>

    <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF"/>
      <stop offset="100%" stopColor="#F4F1E8"/>
    </linearGradient>

    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFD98F"/>
      <stop offset="100%" stopColor="#E8901F"/>
    </linearGradient>

    <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#7A4A16" floodOpacity="0.3"/>
    </filter>

    <filter id="ringShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#7A4A16" floodOpacity="0.35"/>
    </filter>
  </defs>

  
  <circle cx="100" cy="100" r="98" fill="url(#bgGrad)"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#F2A24F" strokeWidth="1.5" opacity="0.6"/>

  
  <g filter="url(#softShadow)">
    <rect x="46" y="40" width="88" height="120" rx="8" fill="url(#boardGrad)"/>
    <rect x="54" y="52" width="72" height="100" rx="4" fill="url(#paperGrad)"/>
  </g>

  
  <rect x="76" y="32" width="28" height="16" rx="6" fill="#6B4726"/>
  <rect x="80" y="36" width="20" height="8" rx="3" fill="#8F6236"/>

  
  <g>
    
    <rect x="62" y="64" width="14" height="14" rx="3" fill="#22B573"/>
    <path d="M 65 71 L 69 75 L 75 66" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <rect x="82" y="68" width="36" height="3" rx="1.5" fill="#C8BEA8"/>

    
    <rect x="62" y="86" width="14" height="14" rx="3" fill="#22B573"/>
    <path d="M 65 93 L 69 97 L 75 88" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <rect x="82" y="90" width="32" height="3" rx="1.5" fill="#C8BEA8"/>

    
    <rect x="62" y="108" width="14" height="14" rx="3" fill="#E8351E"/>
    <path d="M 65 111 L 73 119 M 73 111 L 65 119" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <rect x="82" y="112" width="34" height="3" rx="1.5" fill="#C8BEA8"/>

    
    <rect x="62" y="130" width="14" height="14" rx="3" fill="#22B573"/>
    <path d="M 65 137 L 69 141 L 75 132" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <rect x="82" y="134" width="28" height="3" rx="1.5" fill="#C8BEA8"/>
  </g>

  
  <g filter="url(#ringShadow)">
    <circle cx="140" cy="146" r="26" fill="#FFFDF7"/>
    <circle cx="140" cy="146" r="26" fill="none" stroke="#F0E5D0" strokeWidth="5"/>
    <circle cx="140" cy="146" r="26" fill="none" stroke="url(#ringGrad)" strokeWidth="5"
            strokeLinecap="round" strokeDasharray="127.2" strokeDashoffset="27"
            transform="rotate(-90 140 146)"/>
    <text x="140" y="151" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" fill="#8F5A1E">79%</text>
  </g>
</svg>
);

export const SuggestionIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="38%" r="70%">
      <stop offset="0%" stopColor="#2B2F6B"/>
      <stop offset="100%" stopColor="#161A40"/>
    </radialGradient>

    <linearGradient id="bulbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFEB99"/>
      <stop offset="55%" stopColor="#FFD166"/>
      <stop offset="100%" stopColor="#F2A93C"/>
    </linearGradient>

    <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#B4B9C2"/>
      <stop offset="100%" stopColor="#7D8391"/>
    </linearGradient>

    <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#5B6FE0"/>
      <stop offset="100%" stopColor="#3A4CBF"/>
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
      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#05061A" floodOpacity="0.45"/>
    </filter>
  </defs>

  
  <circle cx="100" cy="100" r="98" fill="url(#bgGrad)"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#4148A0" strokeWidth="1.5" opacity="0.5"/>

  
  <circle cx="100" cy="80" r="38" fill="#FFD166" opacity="0.18" filter="url(#bulbGlow)"/>

  
  <g filter="url(#bulbGlow)">
    <line x1="100" y1="24" x2="100" y2="12" stroke="#FFE9A8" strokeWidth="3" strokeLinecap="round"/>
    <line x1="64" y1="38" x2="55" y2="30" stroke="#FFE9A8" strokeWidth="3" strokeLinecap="round"/>
    <line x1="136" y1="38" x2="145" y2="30" stroke="#FFE9A8" strokeWidth="3" strokeLinecap="round"/>
    <line x1="50" y1="70" x2="38" y2="66" stroke="#FFE9A8" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="150" y1="70" x2="162" y2="66" stroke="#FFE9A8" strokeWidth="2.5" strokeLinecap="round"/>
  </g>

  
  <g fill="#FFE9A8" filter="url(#bulbGlow)">
    <path d="M 148 46 L 150 52 L 156 54 L 150 56 L 148 62 L 146 56 L 140 54 L 146 52 Z" opacity="0.9"/>
    <path d="M 46 100 L 47.5 104 L 51.5 105.5 L 47.5 107 L 46 111 L 44.5 107 L 40.5 105.5 L 44.5 104 Z" opacity="0.8"/>
  </g>

  
  <g filter="url(#softShadow)">
    
    <path d="M 100 42 
             C 118 42 130 54 130 72 
             C 130 86 122 92 116 100 
             C 113 104 112 108 112 112 
             L 88 112 
             C 88 108 87 104 84 100 
             C 78 92 70 86 70 72 
             C 70 54 82 42 100 42 Z" fill="url(#bulbGrad)"/>
    
    <path d="M 84 58 Q 88 48 98 46" stroke="#FFFDF0" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7"/>

    
    <path d="M 92 68 L 96 82 L 100 70 L 104 82 L 108 68" stroke="#E8901F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85"/>

    
    <rect x="88" y="112" width="24" height="6" fill="url(#baseGrad)"/>
    <rect x="88" y="120" width="24" height="6" fill="url(#baseGrad)"/>
    <rect x="90" y="128" width="20" height="8" rx="3" fill="#5F6470"/>
  </g>

  
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

    
    <circle cx="84" cy="158" r="4" fill="#FFFFFF" opacity="0.9"/>
    <circle cx="100" cy="158" r="4" fill="#FFFFFF" opacity="0.9"/>
    <circle cx="116" cy="158" r="4" fill="#FFFFFF" opacity="0.9"/>
  </g>
</svg>
);

export const NightModeIcon = () => (
<svg className="w-full h-full" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#B78CFF"/>
      <stop offset="55%" stopColor="#8B5CF6"/>
      <stop offset="100%" stopColor="#5B21B6"/>
    </linearGradient>
    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFF4C2"/>
      <stop offset="100%" stopColor="#FFD84D"/>
    </linearGradient>
    <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#EAF2FF"/>
      <stop offset="100%" stopColor="#C7DBFF"/>
    </linearGradient>
    <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35"/>
      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
    </radialGradient>
    <filter id="softShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#3B1E80" floodOpacity="0.25"/>
    </filter>
  </defs>

  
  <circle cx="190" cy="170" r="140" fill="url(#moonGlow)"/>

  
  <g filter="url(#softShadow)">
    <path d="M235 90
             C170 90, 118 142, 118 207
             C118 272, 170 324, 235 324
             C260 324, 283 316, 302 302
             C263 296, 232 260, 232 216
             C232 172, 263 136, 302 130
             C283 106, 260 90, 235 90 Z"
          fill="url(#moonGrad)"/>
  </g>

  
  <circle cx="180" cy="160" r="9" fill="#7434E6" opacity="0.35"/>
  <circle cx="165" cy="230" r="6" fill="#7434E6" opacity="0.3"/>
  <circle cx="205" cy="270" r="5" fill="#7434E6" opacity="0.3"/>

  
  <g filter="url(#softShadow)">
    <path d="M300 70
             L309 92
             L333 96
             L315 113
             L320 137
             L300 125
             L280 137
             L285 113
             L267 96
             L291 92 Z"
          fill="url(#starGrad)"/>
  </g>

  
  <path d="M328 150 L332 160 L342 164 L332 168 L328 178 L324 168 L314 164 L324 160 Z" fill="url(#starGrad)"/>

  
  <g filter="url(#softShadow)">
    <path d="M90 300
             C90 284, 103 271, 119 271
             C123 271, 127 272, 131 274
             C137 258, 152 247, 170 247
             C193 247, 212 265, 213 288
             C213 288, 214 288, 215 288
             C230 288, 242 300, 242 315
             C242 330, 230 342, 215 342
             L112 342
             C97 342, 85 330, 85 315
             C85 308, 87 303, 90 300 Z"
          fill="url(#cloudGrad)"/>
  </g>
</svg>
);

export const BellIcon = () => (
<svg className="w-full h-full" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bellStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#4C5AF0"/>
      <stop offset="100%" stopColor="#2E2FB8"/>
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FF6B5E"/>
      <stop offset="100%" stopColor="#E01F2E"/>
    </linearGradient>
    <radialGradient id="bellGlow" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stopColor="#4C5AF0" stopOpacity="0.18"/>
      <stop offset="100%" stopColor="#4C5AF0" stopOpacity="0"/>
    </radialGradient>
    <filter id="softShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#1B1D6B" floodOpacity="0.25"/>
    </filter>
    <filter name="badgeShadow" id="badgeShadow" x="-80%" y="-80%" width="260%" height="260%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#8A0E17" floodOpacity="0.4"/>
    </filter>
  </defs>

  
  <circle cx="200" cy="195" r="150" fill="url(#bellGlow)"/>

  
  <g filter="url(#softShadow)">
    <path d="M200 70
             C216 70, 229 83, 229 99
             C229 101.3, 228.8 103.5, 228.3 105.6
             C260 118, 282 148, 282 184
             L282 240
             C282 254, 290 266, 302 274
             L98 274
             C110 266, 118 254, 118 240
             L118 184
             C118 148, 140 118, 171.7 105.6
             C171.2 103.5, 171 101.3, 171 99
             C171 83, 184 70, 200 70 Z"
          fill="none"
          stroke="url(#bellStroke)"
          strokeWidth="16"
          strokeLinejoin="round"
          strokeLinecap="round"/>

    
    <path d="M172 290 C172 306, 184 318, 200 318 C216 318, 228 306, 228 290 Z"
          fill="none"
          stroke="url(#bellStroke)"
          strokeWidth="16"
          strokeLinejoin="round"
          strokeLinecap="round"/>
  </g>

  
  <g filter="url(#badgeShadow)">
    <circle cx="286" cy="94" r="42" fill="url(#badgeGrad)" stroke="#FFFFFF" strokeWidth="8"/>
  </g>
  <text x="286" y="106" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="800" fill="#FFFFFF" textAnchor="middle">0</text>
</svg>
);

export const StaffIcon = () => (
<svg className="w-full h-full" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#EDE6FF"/>
      <stop offset="100%" stopColor="#DCCCFF"/>
    </linearGradient>

    
    <linearGradient id="skinBack" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#F6C9A0"/>
      <stop offset="100%" stopColor="#EDB284"/>
    </linearGradient>
    <linearGradient id="blazerBack" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#4FBFB0"/>
      <stop offset="100%" stopColor="#33A192"/>
    </linearGradient>

    
    <linearGradient id="skinLeft" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#E8B48C"/>
      <stop offset="100%" stopColor="#D89A6C"/>
    </linearGradient>
    <linearGradient id="blazerLeft" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#8B7CF6"/>
      <stop offset="100%" stopColor="#6C5CE0"/>
    </linearGradient>
    <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#FFC93C"/>
      <stop offset="100%" stopColor="#FF9F1C"/>
    </linearGradient>

    
    <linearGradient id="skinRight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFDCC2"/>
      <stop offset="100%" stopColor="#F5C29E"/>
    </linearGradient>
    <linearGradient id="blazerRight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FF8C7A"/>
      <stop offset="100%" stopColor="#F26D5B"/>
    </linearGradient>
    <linearGradient id="hairRight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#5A4632"/>
      <stop offset="100%" stopColor="#3E301F"/>
    </linearGradient>

    <filter name="softShadow" id="softShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#3B2A6B" floodOpacity="0.22"/>
    </filter>
  </defs>

  
  <circle cx="200" cy="200" r="190" fill="url(#bgGrad)"/>

  
  <g filter="url(#softShadow)">
    <path d="M200 205 C165 205, 137 233, 137 268 L137 285 C137 291, 142 296, 148 296 L252 296 C258 296, 263 291, 263 285 L263 268 C263 233, 235 205, 200 205 Z" fill="url(#blazerBack)"/>
    <circle cx="200" cy="158" r="42" fill="url(#skinBack)"/>
    <path d="M160 148 C160 122, 178 106, 200 106 C222 106, 240 122, 240 148 C240 138, 230 130, 200 130 C170 130, 160 138, 160 148 Z" fill="#2E2A26"/>
  </g>

  
  <g filter="url(#softShadow)">
    <path d="M130 240 C100 240, 76 264, 76 295 L76 320 C76 326, 81 330, 87 330 L173 330 C179 330, 184 326, 184 320 L184 295 C184 264, 160 240, 130 240 Z" fill="url(#blazerLeft)"/>
    <circle cx="130" cy="200" r="36" fill="url(#skinLeft)"/>
    <path d="M98 194 C98 172, 112 158, 130 158 C148 158, 162 172, 162 194 C162 186, 152 178, 130 178 C108 178, 98 186, 98 194 Z" fill="#4A3626"/>

    
    <rect x="97" y="292" width="66" height="42" rx="5" fill="url(#bookGrad)" transform="rotate(-4 130 313)"/>
    <line x1="130" y1="292" x2="130" y2="334" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" transform="rotate(-4 130 313)"/>
  </g>

  
  <g filter="url(#softShadow)">
    <path d="M270 240 C300 240, 324 264, 324 295 L324 320 C324 326, 319 330, 313 330 L227 330 C221 330, 216 326, 216 320 L216 295 C216 264, 240 240, 270 240 Z" fill="url(#blazerRight)"/>
    <circle cx="270" cy="200" r="36" fill="url(#skinRight)"/>
    <path d="M234 192 C234 170, 250 154, 270 154 C290 154, 306 170, 306 192 C306 184, 296 172, 270 172 C244 172, 234 184, 234 192 Z" fill="url(#hairRight)"/>

    
    <circle cx="257" cy="202" r="11" fill="none" stroke="#3E301F" strokeWidth="4"/>
    <circle cx="283" cy="202" r="11" fill="none" stroke="#3E301F" strokeWidth="4"/>
    <line x1="268" y1="202" x2="272" y2="202" stroke="#3E301F" strokeWidth="4"/>
  </g>
</svg>
);

export const CalculatorIcon = () => (
  <div className="w-full h-full text-blue-500">
    <Calculator size={32} strokeWidth={1.5} />
  </div>
);

export const SystemIcon = () => (
<svg className="w-full h-full" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#3B1467"/>
      <stop offset="55%" stopColor="#230C4A"/>
      <stop offset="100%" stopColor="#120629"/>
    </linearGradient>

    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#E040FB" stopOpacity="0.55"/>
      <stop offset="60%" stopColor="#9B30FF" stopOpacity="0.25"/>
      <stop offset="100%" stopColor="#9B30FF" stopOpacity="0"/>
    </radialGradient>

    <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#F792FF"/>
      <stop offset="50%" stopColor="#C64BFF"/>
      <stop offset="100%" stopColor="#7A2FE0"/>
    </linearGradient>

    <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF"/>
      <stop offset="100%" stopColor="#E9C6FF"/>
    </linearGradient>

    <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFF7C2"/>
      <stop offset="100%" stopColor="#FFD24C"/>
    </linearGradient>

    <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="softShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000000" floodOpacity="0.35"/>
    </filter>
  </defs>

  
  <circle cx="200" cy="200" r="190" fill="url(#bgGrad)"/>

  
  <circle cx="200" cy="200" r="150" fill="url(#coreGlow)"/>

  
  <circle cx="200" cy="200" r="120" fill="none" stroke="#B85CFF" strokeWidth="2.5" opacity="0.4" strokeDasharray="4 10"/>

  
  <g stroke="#3B1467" strokeWidth="4" strokeLinecap="round" opacity="0.55" fill="none">
    <path d="M170 160 L170 190 L196 190"/>
    <path d="M200 150 L200 175"/>
    <path d="M228 165 L228 195 L206 210"/>
    <path d="M160 220 L188 220 L188 244"/>
    <path d="M212 230 L238 230 L238 208"/>
    <path d="M200 210 L200 236"/>
  </g>

  
  <circle cx="170" cy="160" r="6" fill="url(#nodeGrad)"/>
  <circle cx="196" cy="190" r="6" fill="url(#nodeGrad)"/>
  <circle cx="228" cy="165" r="6" fill="url(#nodeGrad)"/>
  <circle cx="206" cy="210" r="6" fill="url(#nodeGrad)"/>
  <circle cx="160" cy="220" r="6" fill="url(#nodeGrad)"/>
  <circle cx="188" cy="244" r="6" fill="url(#nodeGrad)"/>
  <circle cx="238" cy="230" r="6" fill="url(#nodeGrad)"/>
  <circle cx="238" cy="208" r="6" fill="url(#nodeGrad)"/>
  <circle cx="200" cy="150" r="6" fill="url(#nodeGrad)"/>
  <circle cx="200" cy="236" r="6" fill="url(#nodeGrad)"/>

  
  <line x1="200" y1="200" x2="120" y2="140" stroke="#E9C6FF" strokeWidth="2" opacity="0.5"/>
  <line x1="200" y1="200" x2="288" y2="150" stroke="#E9C6FF" strokeWidth="2" opacity="0.5"/>
  <line x1="200" y1="200" x2="284" y2="270" stroke="#E9C6FF" strokeWidth="2" opacity="0.5"/>
  <circle cx="120" cy="140" r="7" fill="url(#nodeGrad)" filter="url(#glow)"/>
  <circle cx="288" cy="150" r="7" fill="url(#nodeGrad)" filter="url(#glow)"/>
  <circle cx="284" cy="270" r="7" fill="url(#nodeGrad)" filter="url(#glow)"/>

  
  <g filter="url(#glow)">
    <path d="M112 260 L117 272 L129 277 L117 282 L112 294 L107 282 L95 277 L107 272 Z" fill="url(#sparkGrad)"/>
    <path d="M296 205 L300 214 L309 218 L300 222 L296 231 L292 222 L283 218 L292 214 Z" fill="url(#sparkGrad)"/>
    <path d="M250 90 L253 97 L260 100 L253 103 L250 110 L247 103 L240 100 L247 97 Z" fill="url(#sparkGrad)"/>
  </g>
</svg>
);

export const DocumentIcon = () => (
  <div className="w-full h-full text-indigo-500">
    <FileText size={32} strokeWidth={1.5} />
  </div>
);

export const SunIcon = () => (
<svg className="w-full h-full" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  
  <circle cx="100" cy="100" r="98" fill="#FF8A3D"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#F26E1D" strokeWidth="2"/>

  
  <circle cx="152" cy="46" r="12" fill="#FFD166"/>
  <g stroke="#FFD166" strokeWidth="3" strokeLinecap="round">
    <line x1="152" y1="24" x2="152" y2="18"/>
    <line x1="152" y1="68" x2="152" y2="74"/>
    <line x1="130" y1="46" x2="124" y2="46"/>
    <line x1="174" y1="46" x2="180" y2="46"/>
    <line x1="136" y1="30" x2="132" y2="26"/>
    <line x1="168" y1="62" x2="172" y2="66"/>
    <line x1="168" y1="30" x2="172" y2="26"/>
    <line x1="136" y1="62" x2="132" y2="66"/>
  </g>

  
  <rect x="52" y="152" width="96" height="10" rx="4" fill="#B8541E"/>

  
  <g>
    <rect x="46" y="58" width="108" height="96" rx="8" fill="#FFFDF7"/>
    <rect x="46" y="58" width="108" height="96" rx="8" fill="none" stroke="#E8DCC0" strokeWidth="1.5"/>

    
    <path d="M 46 66 Q 46 58 54 58 L 146 58 Q 154 58 154 66 L 154 80 L 46 80 Z" fill="#D7263D"/>

    
    <rect x="66" y="48" width="8" height="20" rx="4" fill="#8A99A3"/>
    <rect x="126" y="48" width="8" height="20" rx="4" fill="#8A99A3"/>

    
    <rect x="80" y="66" width="40" height="6" rx="3" fill="#FFFFFF" opacity="0.85"/>
  </g>

  
  <g>
    
    <path d="M 46 140 Q 100 128 154 140 L 154 154 Q 154 154 154 154 L 46 154 Z" fill="#F5D998"/>
    
    <rect x="46" y="122" width="108" height="18" fill="#7FD8D6"/>
    <path d="M 46 128 Q 60 124 74 128 Q 88 132 100 128 Q 114 124 128 128 Q 142 132 154 128" stroke="#5EC0BE" strokeWidth="1.5" fill="none" opacity="0.7"/>

    
    <g>
      <path d="M 68 140 Q 65 118 70 104" stroke="#8A5A2B" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M 70 104 Q 52 96 44 104" fill="#2FA35A"/>
      <path d="M 70 104 Q 60 90 48 90" fill="#38B568"/>
      <path d="M 70 104 Q 78 88 92 92" fill="#2FA35A"/>
      <path d="M 70 104 Q 86 100 96 108" fill="#38B568"/>
      <path d="M 70 104 Q 66 90 74 78" fill="#2FA35A"/>
    </g>

    
    <g>
      <line x1="122" y1="152" x2="122" y2="112" stroke="#8A5A2B" strokeWidth="3" strokeLinecap="round"/>
      <path d="M 96 112 Q 122 90 148 112 Q 148 116 144 115 Q 133 108 122 111 Q 111 108 100 115 Q 96 116 96 112 Z" fill="#D7263D"/>
      <path d="M 96 112 Q 109 108 122 111 L 122 112 Q 109 110 96 112 Z" fill="#B31E31"/>
      <path d="M 122 111 Q 133 108 144 115 L 144 116 Q 133 110 122 112 Z" fill="#B31E31"/>
      <path d="M 122 90 L 122 112" stroke="#B31E31" strokeWidth="1.5"/>
    </g>

    
    <g>
      <path d="M 84 148 L 90 130 L 100 133 L 96 150 Z" fill="#4AA6E8"/>
      <path d="M 84 148 L 78 150 L 96 156 L 100 150 Z" fill="#3B8FCB"/>
      <line x1="84" y1="148" x2="80" y2="156" stroke="#8A5A2B" strokeWidth="2"/>
      <line x1="96" y1="150" x2="94" y2="157" stroke="#8A5A2B" strokeWidth="2"/>
    </g>
  </g>

  
  <g transform="translate(150,150) rotate(-25)">
    <path d="M 0 0 L 14 4 L 20 3 L 14 6 L 12 12 L 9 11 L 8 6 L 0 4 L -3 6 L -4 3 L -3 1 Z" fill="#FFFDF7" opacity="0.95"/>
  </g>
</svg>
);

