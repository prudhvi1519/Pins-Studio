/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        hover: "var(--color-hover)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        sheet: "var(--radius-sheet)",
        input: "var(--radius-input)",
        chip: "var(--radius-chip)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        sheet: "var(--shadow-sheet)",
      },
    },
    spacing: {
      0: "0px", // required for some resets like top-0
      4: "4px",
      8: "8px",
      12: "12px",
      16: "16px",
      20: "20px",
      24: "24px",
      32: "32px",
      40: "40px",
      48: "48px",
      64: "64px",
      // Include typical arbitrary percentages since we overwrite spacing
      '1/2': '50%',
      full: '100%',
    },
  },
  plugins: [],
}