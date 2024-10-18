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
    },
    colors: {
      white: "#ffffff",
      lightGreen: "#e1f9df",
      primary: "#3cc534",
      success: "#3cc534",
      danger: "#f33131",
      secondary: "#e1f9df",
      lightGrey: "#c3c6c3",
      grey: "#f1f5f9",
      text: "#092a09",
      black: "#000000",
      transparent: "rgba(0, 0, 0, 0)",
    },
  },
  plugins: [],
};
export default config;
