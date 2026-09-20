import React from "react";

export function NationalEmblem({ className = "", size = 48 }) {
  return (
    <div className={`gov-national-emblem ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
        aria-label="State Emblem of India"
      >
        {/* Ashoka Lion Capital Vector Silhouette / Official Seal */}
        <circle cx="50" cy="55" r="48" fill="#F8FAFC" stroke="#0A2540" strokeWidth="2" />
        {/* Decorative Sunburst / Ring */}
        <circle cx="50" cy="55" r="44" stroke="#D97706" strokeWidth="1" strokeDasharray="2 2" />
        
        {/* Lion Capital Silhouette in Antique Bronze / Deep Navy */}
        <g fill="#0A2540">
          {/* Central Lion */}
          <path d="M50 18 C46 18 42 22 42 27 C42 32 44 35 46 38 C44 41 45 46 47 48 L53 48 C55 46 56 41 54 38 C56 35 58 32 58 27 C58 22 54 18 50 18 Z" />
          {/* Left Lion Mane & Profile */}
          <path d="M38 24 C34 24 30 27 30 32 C30 36 33 39 36 41 C35 43 36 47 38 49 L43 49 C42 46 41 42 41 38 C39 36 38 33 38 24 Z" />
          {/* Right Lion Mane & Profile */}
          <path d="M62 24 C66 24 70 27 70 32 C70 36 67 39 64 41 C65 43 64 47 62 49 L57 49 C58 46 59 42 59 38 C61 36 62 33 62 24 Z" />
          
          {/* Pedestal / Abacus */}
          <rect x="25" y="50" width="50" height="8" rx="2" fill="#0A2540" />
          
          {/* Ashoka Chakra Wheel in Center */}
          <circle cx="50" cy="65" r="7" stroke="#1D4ED8" strokeWidth="1.5" fill="#FFFFFF" />
          <circle cx="50" cy="65" r="2" fill="#1D4ED8" />
          {/* Spokes */}
          <line x1="50" y1="58" x2="50" y2="72" stroke="#1D4ED8" strokeWidth="0.8" />
          <line x1="43" y1="65" x2="57" y2="65" stroke="#1D4ED8" strokeWidth="0.8" />
          <line x1="45" y1="60" x2="55" y2="70" stroke="#1D4ED8" strokeWidth="0.8" />
          <line x1="45" y1="70" x2="55" y2="60" stroke="#1D4ED8" strokeWidth="0.8" />
          
          {/* Flanking Bull & Horse icons */}
          <path d="M32 63 C30 63 28 65 29 67 L34 67 C35 65 34 63 32 63 Z" fill="#D97706" />
          <path d="M68 63 C70 63 72 65 71 67 L66 67 C65 65 66 63 68 63 Z" fill="#D97706" />
          
          {/* Lower Base */}
          <rect x="22" y="74" width="56" height="5" rx="1.5" fill="#0A2540" />
          
          {/* Satyameva Jayate Inscription in Devanagari */}
          <text
            x="50"
            y="91"
            textAnchor="middle"
            fill="#B45309"
            fontSize="7"
            fontFamily="'Noto Sans', 'Merriweather', serif"
            fontWeight="bold"
            letterSpacing="0.5"
          >
            सत्यमेव जयते
          </text>
        </g>
      </svg>
    </div>
  );
}

export function GovDigitalIndiaBadge({ size = 36 }) {
  return (
    <div className="digital-india-badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <div style={{
        backgroundColor: "#0A2540",
        border: "1px solid #1E3A8A",
        padding: "2px",
        borderRadius: "4px",
        display: "inline-block"
      }}>
        <div style={{ background: "#FFFFFF", padding: "2px 6px", borderRadius: "3px", fontSize: "10px", fontWeight: "800", color: "#0A2540" }}>
          Digital India
        </div>
      </div>
    </div>
  );
}
