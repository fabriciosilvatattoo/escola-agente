/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                nexus: {
                    bg: '#020617',     // slate-950
                    card: '#0f172a',   // slate-900
                    border: '#1e293b', // slate-800
                    text: '#f1f5f9',   // slate-100
                    muted: '#94a3b8',  // slate-400
                    primary: '#8b5cf6', // violet-500
                    secondary: '#d946ef' // fuchsia-500
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
