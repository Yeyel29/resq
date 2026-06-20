import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F9FB",
        surface: "#F7F9FB",
        "surface-lowest": "#FFFFFF",
        "surface-low": "#F2F4F6",
        "surface-container": "#ECEEF0",
        "surface-high": "#E6E8EA",
        "surface-highest": "#E0E3E5",
        "surface-variant": "#E0E3E5",
        "on-surface": "#191C1E",
        "on-surface-variant": "#45464D",
        outline: "#76777D",
        "outline-variant": "#C6C6CD",
        primary: "#0F172A",
        "primary-container": "#131B2E",
        "on-primary": "#FFFFFF",
        "primary-soft": "#DAE2FD",
        secondary: "#006A61",
        teal: "#0D9488",
        "secondary-container": "#86F2E4",
        "sky-helper": "#E0F2FE",
        warning: "#F59E0B",
        "warning-soft": "#FEF3C7",
        error: "#BA1A1A",
        "error-soft": "#FFDAD6",
      },
      boxShadow: {
        academic: "0 12px 28px rgba(15, 23, 42, 0.06)",
        soft: "0 4px 14px rgba(15, 23, 42, 0.05)",
      },
      borderRadius: {
        card: "1rem",
      },
      maxWidth: {
        workspace: "1280px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
