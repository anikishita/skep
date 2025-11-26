import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                riot: {
                    dark: '#0a0a0c', // Deep background
                    panel: '#1e2328', // Panel background
                    accent: '#c8aa6e', // Gold/Hextech
                    highlight: '#0ac8b9', // Cyan/Neon
                    text: '#f0e6d2', // Off-white text
                    muted: '#a09b8c', // Muted text
                    danger: '#e84057', // Red
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hextech': 'linear-gradient(135deg, #1e2328 0%, #0a0a0c 100%)',
            },
        },
    },
    plugins: [],
}
export default config
