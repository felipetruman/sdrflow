import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
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
        display: ['var(--font-syne)', 'Times New Roman', 'serif'],
        mono:    ['var(--font-jetbrains-mono)', 'Courier New', 'monospace'],
      },
      fontSize: {
        '2xs': 'var(--text-2xs)',
        xs:    'var(--text-xs)',
        sm:    'var(--text-sm)',
        base:  'var(--text-base)',
        lg:    'var(--text-lg)',
        xl:    'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
      },
      colors: {
        // shadcn aliases — pull from CSS variables (hex form, no alpha-value)
        border:      'var(--border)',
        input:       'var(--input)',
        ring:        'var(--ring)',
        background:  'var(--background)',
        foreground:  'var(--foreground)',
        primary: {
          DEFAULT:    'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT:    'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT:    'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT:    'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT:    'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT:    'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        // Editorial Noir — direct semantic access
        ink: {
          950: 'var(--ink-950)',
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
          600: 'var(--ink-600)',
          500: 'var(--ink-500)',
          400: 'var(--ink-400)',
        },
        paper: {
          DEFAULT: 'var(--paper)',
          soft:    'var(--paper-soft)',
          muted:   'var(--paper-muted)',
          quiet:   'var(--paper-quiet)',
          fade:    'var(--paper-fade)',
        },
        signal: {
          DEFAULT: 'var(--signal)',
          soft:    'var(--signal-soft)',
          strong:  'var(--signal-strong)',
          deep:    'var(--signal-deep)',
        },
        positive: 'var(--positive)',
        negative: 'var(--negative)',
        pending:  'var(--pending)',
        info:     'var(--info)',

        // Legacy aliases — keep until full migration sweep
        sdr: {
          base:          'var(--ink-950)',
          surface:       'var(--ink-900)',
          elevated:      'var(--ink-800)',
          overlay:       'var(--ink-700)',
          'border-dim':  'var(--ink-700)',
          'border-base': 'var(--ink-600)',
          amber:         'var(--signal)',
          'amber-dim':   'var(--signal-strong)',
          cyan:          'var(--info)',
          'text-primary':   'var(--paper)',
          'text-secondary': 'var(--paper-muted)',
          'text-muted':     'var(--paper-quiet)',
        },
      },
      borderRadius: {
        xs:  'var(--radius-xs)',
        sm:  'var(--radius-sm)',
        md:  'var(--radius-md)',
        lg:  'var(--radius-lg)',
        xl:  'var(--radius-xl)',
      },
      boxShadow: {
        '1':           'var(--shadow-1)',
        '2':           'var(--shadow-2)',
        '3':           'var(--shadow-3)',
        'signal':      '0 0 0 1px var(--signal), 0 0 24px var(--signal-glow)',
        'signal-soft': '0 0 0 1px var(--signal-deep), 0 0 16px var(--signal-bg)',
      },
      animation: {
        'fade-up':       'fade-up 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':       'fade-in 200ms ease forwards',
        'slide-in-left': 'slide-in-left 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'count-up':      'count-up 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'accordion-down': 'accordion-down 200ms ease-out',
        'accordion-up':   'accordion-up 200ms ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
      },
      backgroundImage: {
        'mesh': 'var(--mesh)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
