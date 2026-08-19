/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primitives. Raw values — do not reference these directly for text.
        term: {
          void: '#050706',
          panel: '#0a0f0d',
          line: '#132018',
          phosphor: '#00ff9c',
          amber: '#ffb000',
          magenta: '#ff2e97',
          text: '#8fa39a',
          bright: '#d8f5e8',
        },

        // Semantic text ramp. Solid values pre-composited over the void; ratios vs #050706.
        ink: {
          strong: '#d8f5e8', // 16.9:1 — display type, values, answers
          body: '#8fa39a',   //  7.3:1 — prose and terminal output
          label: '#02b56f',  //  7.5:1 — labels, chrome, prompt sigils
          hint: '#028f59',   //  4.9:1 — metadata keys and hints. The floor.
        },

        // Two border weights.
        edge: {
          DEFAULT: 'rgba(0,255,156,0.30)',
          strong: 'rgba(0,255,156,0.60)',
        },
      },

      // One job per face: display = headings and hero, ui = chrome, mono = read content.
      fontFamily: {
        mono: ['"Noto Sans Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['VT323', '"Noto Sans Mono"', 'monospace'],
        ui: ['"Share Tech Mono"', '"Noto Sans Mono"', 'monospace'],
      },

      // Semantic role scale. Components name a role, never a pixel size.
      fontSize: {
        display: ['clamp(2.75rem, 11vw, 6rem)', { lineHeight: '0.92' }],
        heading: ['clamp(1.75rem, 5vw, 2.75rem)', { lineHeight: '1.05' }],
        role: ['1.125rem', { lineHeight: '1.35' }],
        body: ['1.0625rem', { lineHeight: '1.65', letterSpacing: '0.01em' }],
        chrome: ['0.8125rem', { lineHeight: '1.4' }],
        meta: ['0.75rem', { lineHeight: '1.45' }],
      },

      boxShadow: {
        'glow-sm': '0 0 4px rgba(0,255,156,0.35)',
        glow: '0 0 12px rgba(0,255,156,0.30), 0 0 2px rgba(0,255,156,0.55)',
        'glow-lg': '0 0 28px rgba(0,255,156,0.28), 0 0 8px rgba(0,255,156,0.45)',
        'glow-amber': '0 0 10px rgba(255,176,0,0.30)',
      },
      keyframes: {
        flicker: {
          '0%,100%': { opacity: '0.16' },
          '8%': { opacity: '0.22' },
          '12%': { opacity: '0.12' },
          '30%': { opacity: '0.19' },
          '52%': { opacity: '0.13' },
          '73%': { opacity: '0.21' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'glitch-x': {
          '0%,100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 1px)' },
          '40%': { transform: 'translate(2px, -1px)' },
          '60%': { transform: 'translate(-1px, -1px)' },
          '80%': { transform: 'translate(1px, 1px)' },
        },
        'glitch-y': {
          '0%,100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(2px, -1px)' },
          '40%': { transform: 'translate(-2px, 1px)' },
          '60%': { transform: 'translate(1px, 1px)' },
          '80%': { transform: 'translate(-1px, -1px)' },
        },
        blink: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
        'boot-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 4px rgba(0,255,156,0.25)' },
          '50%': { boxShadow: '0 0 16px rgba(0,255,156,0.55)' },
        },
      },
      animation: {
        flicker: 'flicker 4s infinite steps(1)',
        scanline: 'scanline 7s linear infinite',
        'glitch-x': 'glitch-x 0.35s steps(2) infinite',
        'glitch-y': 'glitch-y 0.35s steps(2) infinite',
        blink: 'blink 1.05s steps(1) infinite',
        'boot-in': 'boot-in 0.4s ease-out both',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
