import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "ui-serif", "serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#e11d74",
          dark: "#c41062",
          soft: "rgba(225, 29, 116, 0.12)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
