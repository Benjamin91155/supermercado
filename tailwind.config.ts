import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0B4DB6",
          red: "#E11D48",
          ice: "#F5F8FF",
          ink: "#0B1B3A"
        }
      },
      boxShadow: {
        soft: "0 12px 30px rgba(11, 77, 182, 0.14)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        floatSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(11, 77, 182, 0)" },
          "50%": { boxShadow: "0 18px 30px rgba(11, 77, 182, 0.18)" }
        }
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out both",
        "float-soft": "floatSoft 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
