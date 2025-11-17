import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        shake: "shake 0.3s ease-in-out",
        shine: "shine 2.5s infinite",
        fadeInGlow: "fadeInGlow 0.6s ease-out",
        underlineLoop: "underlineLoop 2s linear infinite",
        tourGlow: "tourGlow 2s ease-in-out infinite",
        tourPulse: "tourPulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        underlineLoop: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "50%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
        },
        tourGlow: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(0, 166, 244, 0.6)",
          },
          "50%": {
            boxShadow: "0 0 35px rgba(0, 166, 244, 1)",
          },
        },
        tourPulse: {
          "0%, 100%": {
            transform: "scale(1.1)",
            boxShadow: "0 0 25px rgba(0, 166, 244, 0.7)",
          },
          "50%": {
            transform: "scale(1.15)",
            boxShadow: "0 0 40px rgba(0, 166, 244, 1)",
          },
        },

        shine: {
          "0%": { left: "-75%" },
          "100%": { left: "125%" },
        },
        fadeInGlow: {
          "0%": {
            opacity: "0.2",
            transform: "scale(1)",
            textShadow: "none",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.2)",
            textShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
            textShadow: "none",
          },
        },
      },
      screens: {
        xs: { max: "320px" },
        sm: { max: "500px" },
        md: { max: "768px" },
        lg: { max: "1024px" },
        smDesktop: { max: "1144px" },
        mdDesktop: { max: "1280px" },
        lgDesktop: { max: "1440px" },
        xlDesktop: { max: "1600px" },
        xxl: { max: "1920px" },
      },
      colors: {
        primary: {
          DEFAULT: "#18A1F7",
        },

        primaryLight: {
          DEFAULT: "#f2f9ff",
        },

        secondary: {
          DEFAULT: "#259DE8",
        },

        grey: {
          DEFAULT: "#d1d9e5",
        },

        lightGrey: {
          DEFAULT: "#f4f5f7",
        },

        darkGrey: {
          DEFAULT: "#475569",
        },

        darkBlue: {
          DEFAULT: " #073D5E",
        },

        lightYellow: {
          DEFAULT: "#ffcf4c",
        },

        yellow: {
          DEFAULT: "#F7BB18",
        },

        yellowDark: {
          DEFAULT: "#E5B022",
        },

        faded: {
          DEFAULT: "rgb(107 114 128)",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
export default config;
