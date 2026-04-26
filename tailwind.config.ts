import type { Config } from "tailwindcss";

/**
 * Design tokens sourced from Figma (get_design_context on frames 2:2, 20:65).
 * Background coral: #db5e5e · Ink/navy text: #1e1e1e · Stamp cream: #f9f6e5 · Type: Nunito Sans
 */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          coral: "#db5e5e",
          navy: "#1e1e1e",
          cream: "#f9f6e5",
          "cream-muted": "#e5e3c9",
          surface: "#e2e2e2",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "3rem",
        box: "0",
        stamp: "0.125rem",
      },
    },
  },
} satisfies Config;
