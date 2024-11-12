import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        fuzzy: ["Balsamiq Sans", "sans-serif"],
      },
    },
    colors: {
      white: "#ffffff",
      beige: "#F2E8B1",
      primary: "#139774",
      success: "#139774",
      danger: "#C74D3A",
      warning: "#a47000",
      secondary: "#F8F8E5",
      lightGrey: "#c3c6c3",
      grey: "#f1f5f9",
      text: "#482A2A",
      black: "#000000",
      transparent: "rgba(0, 0, 0, 0)",
    },
  },
  plugins: [],
};
export default config;
