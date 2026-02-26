import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB",
          violet: "#7C3AED",
        },
      },
    },
  },
  plugins: [],
};

export default config;
