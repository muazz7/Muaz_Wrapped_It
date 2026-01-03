import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'void-black': '#050505',
                'midnight-blue': '#0a1628',
                'cosmic-gold': '#D4AF37',
                'cosmic-gold-light': '#E5C158',
                'star-white': '#FAFAFA',
                'nebula-gray': '#8892a0',
            },
            fontFamily: {
                sans: [
                    'var(--font-noto-sans)',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    'Helvetica',
                    'Arial',
                    'sans-serif',
                ],
                serif: ['var(--font-playfair)', 'serif'],
                montserrat: ['var(--font-montserrat)', 'sans-serif'],
                'new-york': ['var(--font-inter)', 'ui-serif', 'Georgia', 'serif'],
            },
            animation: {
                'twinkle': 'twinkle 3s ease-in-out infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                twinkle: {
                    '0%, 100%': { opacity: '0.3' },
                    '50%': { opacity: '1' },
                },
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};

export default config;
