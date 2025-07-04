import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
          hover: "oklch(var(--primary-hover) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
          hover: "oklch(var(--secondary-hover) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
          hover: "oklch(var(--accent-hover) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
          hover: "oklch(var(--card-hover) / <alpha-value>)",
        },
        "border-soft": "oklch(var(--border-soft) / <alpha-value>)",
        "foreground-secondary": "oklch(var(--foreground-secondary) / <alpha-value>)",
      },
      boxShadow: {
        "soft-xs": "var(--shadow-soft-xs)",
        "soft": "var(--shadow-soft)",
        "soft-md": "var(--shadow-soft-md)",
        "soft-lg": "var(--shadow-soft-lg)",
        "soft-xl": "var(--shadow-soft-xl)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "var(--radius-lg)",
        "2xl": "var(--radius-xl)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)",
        "gradient-accent": "var(--gradient-accent)",
      },
      backdropBlur: {
        "soft": "8px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "oklch(var(--muted-foreground))",
            h1: {
              color: "oklch(var(--foreground))",
              fontWeight: "700",
              letterSpacing: "-0.025em",
            },
            h2: {
              color: "oklch(var(--foreground))",
              fontWeight: "600",
              letterSpacing: "-0.025em",
            },
            h3: {
              color: "oklch(var(--foreground))",
              fontWeight: "600",
              letterSpacing: "-0.025em",
            },
            h4: {
              color: "oklch(var(--foreground))",
              fontWeight: "600",
            },
            code: {
              color: "oklch(var(--foreground))",
              backgroundColor: "oklch(var(--muted))",
              padding: "0.25rem 0.375rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: "500",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              backgroundColor: "oklch(var(--muted))",
              color: "oklch(var(--foreground))",
              border: "1px solid oklch(var(--border))",
              borderRadius: "0.5rem",
            },
            "pre code": {
              backgroundColor: "transparent",
              color: "inherit",
              padding: "0",
              borderRadius: "0",
            },
            a: {
              color: "oklch(var(--foreground))",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              textDecorationColor: "oklch(var(--muted-foreground))",
              transition: "all 0.2s ease",
              "&:hover": {
                textDecorationColor: "oklch(var(--foreground))",
              },
            },
            blockquote: {
              color: "oklch(var(--muted-foreground))",
              borderLeftColor: "oklch(var(--border))",
              fontSize: "1rem",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: "1.75",
            },
            "blockquote p:first-of-type::before": {
              content: '""',
            },
            "blockquote p:last-of-type::after": {
              content: '""',
            },
            ul: {
              color: "oklch(var(--muted-foreground))",
            },
            ol: {
              color: "oklch(var(--muted-foreground))",
            },
            li: {
              color: "oklch(var(--muted-foreground))",
              "&::marker": {
                color: "oklch(var(--muted-foreground))",
              },
            },
            table: {
              fontSize: "0.875rem",
            },
            th: {
              color: "oklch(var(--foreground))",
              fontWeight: "600",
              backgroundColor: "oklch(var(--muted))",
              borderColor: "oklch(var(--border))",
            },
            td: {
              color: "oklch(var(--muted-foreground))",
              borderColor: "oklch(var(--border))",
            },
            hr: {
              borderColor: "oklch(var(--border))",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    function({ addComponents, theme }: { addComponents: any; theme: any }) {
      addComponents({
        '.container-padding': {
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
          '@screen sm': {
            paddingLeft: theme('spacing.6'),
            paddingRight: theme('spacing.6'),
          },
          '@screen lg': {
            paddingLeft: theme('spacing.8'),
            paddingRight: theme('spacing.8'),
          },
        },
        '.section-padding': {
          paddingTop: theme('spacing.16'),
          paddingBottom: theme('spacing.16'),
          '@screen md': {
            paddingTop: theme('spacing.24'),
            paddingBottom: theme('spacing.24'),
          },
          '@screen lg': {
            paddingTop: theme('spacing.32'),
            paddingBottom: theme('spacing.32'),
          },
        },
      });
    },
  ],
} satisfies Config

export default config 