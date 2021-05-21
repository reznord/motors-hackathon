module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      textColor: [
        'responsive',
        'hover',
        'focus',
        'before',
        'after',
        'hover::before',
        'hover::after',
        'focus::before'
      ],
    },
  },
  plugins: [
    require('tailwindcss-pseudo-elements'),
  ],
};
