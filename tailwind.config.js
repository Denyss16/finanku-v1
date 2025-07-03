/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // --- TAMBAHKAN ATAU GANTI BLOK INI ---
  safelist: [
    "bg-cyan-600",
    "bg-purple-600",
    "bg-blue-600",
    "bg-amber-500",
    "border-cyan-500",
    "border-purple-500",
    "border-blue-500",
    "border-amber-500",
    "text-cyan-600",
    "text-purple-600",
    "text-blue-600",
    "text-amber-600",
    "bg-cyan-50",
    "bg-purple-50",
    "bg-blue-50",
    "bg-amber-50",
  ],
  // ------------------------------------
  plugins: [require('@tailwindcss/typography')],
};
