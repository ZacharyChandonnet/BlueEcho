/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose100:'#F079F1',
        rose200:'#DB35F1',
        rose300:'#8C1D9B',
        bleuGradient:'#74C8D6',
        bleuGradient2:'#354798',
        roseGradient:'#E384B5',
        bleu100:'#48F2F2',
        bleu200:'#19B6D9',
        bleu300:'#1F398D',
        bleuDisabled:'#0F1A3A',
        mauve100:'#DAB6F3',
        mauve200:'#9E4BF1',
        mauve300:'#4B2D73',
        violet100:'#A99EF2',
        violet200:'#7F6EF2',
        violet300:'#514695',
      }
    },
    screens: {
      'xs': '390px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    }
  },
  plugins: [],
}