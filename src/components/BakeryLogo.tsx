import React from "react";

interface BakeryLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export function BakeryLogo({ size = "md", showTagline = true }: BakeryLogoProps) {
  const iconDimensions = {
    sm: "h-9 w-9",
    md: "h-11 w-11",
    lg: "h-14 w-14",
  }[size];

  const titleSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  const subSize = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
  }[size];

  return (
    <div className="flex items-center gap-3.5 group cursor-pointer select-none">
      {/* 👑 Unique Luxury Artisanal Emblem SVG */}
      <div className={`relative ${iconDimensions} shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1`}>
        {/* Ambient Gold Glow Halo */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#e5b967]/30 to-[#edd093]/10 blur-sm group-hover:blur-md transition-all" />

        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative h-full w-full drop-shadow-[0_4px_12px_rgba(229,185,103,0.3)]"
        >
          <defs>
            {/* Rich Champagne Gold Gradients */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdf0cd" />
              <stop offset="35%" stopColor="#e5b967" />
              <stop offset="70%" stopColor="#c2913e" />
              <stop offset="100%" stopColor="#e8c27a" />
            </linearGradient>

            <linearGradient id="badgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#241a14" />
              <stop offset="100%" stopColor="#140f0c" />
            </linearGradient>
          </defs>

          {/* Outer Octagonal / Curved Shield Badge */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="22"
            fill="url(#badgeBg)"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
          />

          {/* Inner Delicate Concentric Frame */}
          <rect
            x="12"
            y="12"
            width="76"
            height="76"
            rx="16"
            fill="none"
            stroke="#e5b967"
            strokeWidth="0.75"
            strokeDasharray="2 2"
            opacity="0.6"
          />

          {/* Flourishing Botanical Wheat / Laurel Leaves on Left */}
          <path
            d="M26 68 C 24 55, 27 40, 35 30 C 33 36, 32 45, 34 56 C 30 60, 27 65, 26 68 Z"
            fill="url(#goldGradient)"
            opacity="0.85"
          />
          <path
            d="M24 48 C 20 44, 22 38, 28 38 C 26 42, 25 45, 24 48 Z"
            fill="url(#goldGradient)"
            opacity="0.7"
          />
          <path
            d="M31 37 C 28 32, 32 27, 37 28 C 34 32, 33 34, 31 37 Z"
            fill="url(#goldGradient)"
            opacity="0.7"
          />

          {/* Flourishing Botanical Wheat / Laurel Leaves on Right */}
          <path
            d="M74 68 C 76 55, 73 40, 65 30 C 67 36, 68 45, 66 56 C 70 60, 73 65, 74 68 Z"
            fill="url(#goldGradient)"
            opacity="0.85"
          />
          <path
            d="M76 48 C 80 44, 78 38, 72 38 C 74 42, 75 45, 76 48 Z"
            fill="url(#goldGradient)"
            opacity="0.7"
          />
          <path
            d="M69 37 C 72 32, 68 27, 63 28 C 66 32, 67 34, 69 37 Z"
            fill="url(#goldGradient)"
            opacity="0.7"
          />

          {/* Artisanal Mini Crown / Cake Tier Peak */}
          <path
            d="M44 26 L50 20 L56 26 L54 28 L46 28 Z"
            fill="url(#goldGradient)"
          />
          <circle cx="50" cy="18" r="1.75" fill="#fff5da" />

          {/* Stylized Interlocking Monogram 'S' & 'C' */}
          {/* Ornate 'S' */}
          <path
            d="M57 37 C 54 33.5, 47 33, 44 36.5 C 41 40, 42 45, 48 47.5 C 55 50.5, 57 55, 54 60 C 50.5 64.5, 43 64.5, 39 60.5"
            stroke="url(#goldGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Ornate 'C' Interlaced */}
          <path
            d="M61 46 C 62.5 43, 62 39, 58 38"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M58 59 C 62 58.5, 63 54, 61 51"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />

          {/* Floating Sparkle Crumbs */}
          <circle cx="50" cy="74" r="1.5" fill="#edd093" />
          <circle cx="43" cy="72" r="1" fill="#e5b967" opacity="0.8" />
          <circle cx="57" cy="72" r="1" fill="#e5b967" opacity="0.8" />
        </svg>
      </div>

      {/* Typography Brandmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-display ${titleSize} font-bold text-[#f3e8d9] tracking-tight group-hover:text-white transition-colors`}>
            Sweet Crumb
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#e5b967] shadow-[0_0_8px_#e5b967]"></span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5">
            <span className={`font-sans ${subSize} uppercase tracking-[0.28em] text-[#e5b967] font-semibold`}>
              Artisan Cakery
            </span>
            <span className="text-[8px] text-[#e5b967]/50">•</span>
            <span className={`font-sans ${subSize} uppercase tracking-[0.2em] text-[#b8a695]`}>
              Est. 2024
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
