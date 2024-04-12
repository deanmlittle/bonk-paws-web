import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "bonk-orange": "#ff5a01",
        "bonk-yellow": "#ffd502",
        "bonk-white": "#FDFFF7",
        "bonk-blue": {
          dark: "#00243d",
          light: "#293f65",
        },
        "bonk-green": "#2dc48d",
        "bonk-gray": {
          light: "#2B3649",
          dark: "#000205",
        },
        "bonk-red": {
          light: "#FF0000",
          dark: "#800000",
        },
      },
      fontFamily: {
        herborn: ["var(--font-herborn)"],
      },
    },
  },
  plugins: [],
};
export default config;
