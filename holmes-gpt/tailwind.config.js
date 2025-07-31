/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary color - keep existing orange
        primary: {
          DEFAULT: "#EF6448",
          50: "#FEF3F1",
          100: "#FDE7E3",
          200: "#FBCFC7",
          300: "#F8B8AB",
          400: "#F6A08F",
          500: "#EF6448",
          600: "#E54725",
          700: "#B8391E",
          800: "#8B2B16",
          900: "#5D1C0F",
        },

        // Secondary colors - deep blue and purple
        secondary: {
          blue: {
            DEFAULT: "#4A5568",
            50: "#F7FAFC",
            100: "#EDF2F7",
            200: "#E2E8F0",
            300: "#CBD5E0",
            400: "#A0AEC0",
            500: "#718096",
            600: "#4A5568",
            700: "#2D3748",
            800: "#1A202C",
            900: "#171923",
          },
          purple: {
            DEFAULT: "#805AD5",
            50: "#FAF5FF",
            100: "#E9D8FD",
            200: "#D6BCFA",
            300: "#B794F6",
            400: "#9F7AEA",
            500: "#805AD5",
            600: "#6B46C1",
            700: "#553C9A",
            800: "#44337A",
            900: "#322659",
          },
        },

        // Neutral colors - off-white and grays
        neutral: {
          white: "#F7FAFC",
          50: "#F7FAFC",
          100: "#EDF2F7",
          200: "#E2E8F0",
          300: "#CBD5E0",
          400: "#A0AEC0",
          500: "#718096",
          600: "#4A5568",
          700: "#2D3748",
          800: "#1A202C",
          900: "#171923",
        },

        // Dark mode variants
        dark: {
          primary: "#0F172A",
          secondary: "#1E293B",
          tertiary: "#334155",
          accent: "#805AD5",
          blue: "#1E3A8A",
          purple: "#5B21B6",
        },

        // Legacy colors for compatibility
        "holmes-gold": "#D4AF37",
        "holmes-navy": "#1B365D",
        "holmes-cream": "#F5F5DC",
      },

      fontFamily: {
        // Inter for body text and headings
        sans: ["Inter", "system-ui", "sans-serif"],
        // Playfair Display for main headings
        display: ["Playfair Display", "serif"],
        // Fallback serif
        serif: ["Georgia", "serif"],
      },

      fontSize: {
        // Typographic scale
        "page-title": ["2.5rem", { lineHeight: "1.3", fontWeight: "700" }],
        "section-heading": [
          "1.875rem",
          { lineHeight: "1.3", fontWeight: "600" },
        ],
        subheading: ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }],
      },

      spacing: {
        // Consistent spacing scale
        18: "4.5rem",
        88: "22rem",
      },

      borderRadius: {
        // Glassmorphism rounded corners
        glass: "0.75rem",
        "glass-lg": "1rem",
        "glass-xl": "1.5rem",
      },

      backdropBlur: {
        glass: "10px",
        "glass-lg": "20px",
      },

      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-lg": "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        button: "0 4px 15px 0 rgba(239, 100, 72, 0.2)",
        card: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },

      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },

      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(-20px) rotate(10deg)",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
