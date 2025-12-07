/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                linkedin: {
                    blue: '#0077b5',
                    dark: '#004182',
                }
            }
        },
    },
    plugins: [],
}
