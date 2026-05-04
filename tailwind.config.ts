import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains-mono)', 'Courier New', 'monospace'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        sdr: {
          base:          'var(--bg-base)',
          surface:       'var(--bg-surface)',
          elevated:      'var(--bg-elevated)',
          overlay:       'var(--bg-overlay)',
          'border-dim':  'var(--border-dim)',
          'border-base': 'var(--border-base)',
          amber:         'var(--amber)',
          'amber-dim':   'var(--amber-dim)',
          cyan:          'var(--cyan)',
          'text-primary':'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-muted':  'var(--text-muted)',
        },
      },
      boxShadow: {
        'amber-glow': '0 0 0 1px var(--amber), 0 0 20px var(--amber-glow)',
        'cyan-glow':  '0 0 0 1px var(--cyan), 0 0 20px var(--cyan-glow)',
        'card':       '0 1px 0 0 var(--border-base), inset 0 1px 0 0 var(--border-dim)',
      },
      animation: {
        'fade-up':      'fade-up 300ms ease forwards',
        'slide-in-left':'slide-in-left 250ms ease forwards',
        'pulse-amber':  'pulse-amber 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
