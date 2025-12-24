/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Theme tokens driven by CSS variables (NativeWind v4)
        background: "#040c1c",
        "light-background": "#1e293b",
        foreground: "#fffafa",
        "light-foreground": "#94a3b8",
        accent: "#6afdff",
      },
    },
  },
  plugins: [],
}