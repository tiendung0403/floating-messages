/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // bong bóng lơ lửng trong màn hình (không biến mất)
        floaty: {
          "0%,100%": { transform: "translate3d(var(--dx,0px), var(--dy,0px), 0)" },
          "50%": { transform: "translate3d(calc(var(--dx,0px) * -1), calc(var(--dy,0px) * -1), 0)" },
        },
        // vào màn hình nhẹ nhàng (pop-in)
        popin: {
          "0%": { transform: "translateY(18px) scale(0.98)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        toastIn: {
          "0%": { transform: "translateX(14px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        floaty: "floaty var(--dur, 7s) ease-in-out infinite",
        popin: "popin 280ms ease-out both",
        toastIn: "toastIn 220ms ease-out both",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,.10), 0 12px 30px rgba(0,0,0,.35), 0 0 30px rgba(125,211,252,.20)",
      },
    },
  },
  plugins: [],
};
