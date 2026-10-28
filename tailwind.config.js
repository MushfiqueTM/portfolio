/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /*
       * Every colour wraps a bare HSL triple from :root in src/index.css with
       * `<alpha-value>`, which is what makes `text-ink/60` and `border-ink/25` work.
       * A token defined in only one of the two places silently produces no utility.
       */
      colors: {
        paper: {
          DEFAULT: "hsl(var(--paper) / <alpha-value>)",
          raised: "hsl(var(--paper-raised) / <alpha-value>)",
          inset: "hsl(var(--paper-inset) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "hsl(var(--ink) / <alpha-value>)",
          light: "hsl(var(--ink-light) / <alpha-value>)",
          soft: "hsl(var(--ink-soft) / <alpha-value>)",
          muted: "hsl(var(--ink-muted) / <alpha-value>)",
        },
        rule: "hsl(var(--rule) / <alpha-value>)",
        cyan: "hsl(var(--cyan) / <alpha-value>)",
        amber: "hsl(var(--amber) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
      },
      borderRadius: {
        lg: "calc(var(--radius) + 2px)",
        DEFAULT: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)",
      },
      /* Flat drafting shadows — paper on a desk, not neumorphic foam. */
      boxShadow: {
        plate: "0 1px 2px hsl(var(--ink) / 0.05), 0 1px 1px hsl(var(--ink) / 0.03)",
        "plate-lg": "0 4px 14px hsl(var(--ink) / 0.09), 0 1px 3px hsl(var(--ink) / 0.05)",
        well: "inset 0 1px 3px hsl(var(--ink) / 0.07)",
        ink: "0 2px 8px hsl(var(--ink) / 0.22)",
      },
      backgroundImage: {
        /* ParallaxOrbs depends on this; it was never defined, so both orbs rendered nothing. */
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
